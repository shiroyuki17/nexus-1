import amqp from 'amqplib';
import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';

const exchangeName = process.env.RABBITMQ_EXCHANGE ?? 'nexus.events';
const queueName = process.env.RABBITMQ_AUDIT_QUEUE ?? 'nexus.audit.events';
const rabbitUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

let connection;
let channel;
let connecting;

function rabbitEnabled() {
  return process.env.RABBITMQ_ENABLED !== 'false';
}

async function getChannel() {
  if (!rabbitEnabled()) {
    return null;
  }

  if (channel) {
    return channel;
  }

  if (!connecting) {
    connecting = amqp
      .connect(rabbitUrl)
      .then(async (conn) => {
        connection = conn;
        connection.on('close', () => {
          connection = null;
          channel = null;
          connecting = null;
        });
        connection.on('error', (error) => {
          console.warn('[rabbitmq] connection error:', error.message);
        });

        channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        return channel;
      })
      .catch((error) => {
        connection = null;
        channel = null;
        connecting = null;
        console.warn('[rabbitmq] unavailable:', error.message);
        return null;
      });
  }

  return connecting;
}

export function createEvent(type, payload = {}, metadata = {}) {
  return {
    type,
    payload,
    metadata: {
      eventId: metadata.eventId ?? crypto.randomUUID(),
      timestamp: metadata.timestamp ?? new Date().toISOString(),
      version: metadata.version ?? 1,
      source: metadata.source ?? 'nexus-api',
    },
  };
}

export async function publishEvent(type, payload = {}, metadata = {}) {
  const event = createEvent(type, payload, metadata);
  const activeChannel = await getChannel();

  if (!activeChannel) {
    return { published: false, event };
  }

  const routingKey = type
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .toLowerCase();

  activeChannel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(event)),
    {
      contentType: 'application/json',
      persistent: true,
      messageId: event.metadata.eventId,
      timestamp: Math.floor(Date.now() / 1000),
    }
  );

  return { published: true, event };
}

export async function startEventConsumers() {
  const activeChannel = await getChannel();
  if (!activeChannel) {
    return false;
  }

  await activeChannel.assertQueue(queueName, {
    durable: true,
    deadLetterExchange: `${exchangeName}.dlx`,
  });
  await activeChannel.assertExchange(`${exchangeName}.dlx`, 'fanout', { durable: true });
  await activeChannel.bindQueue(queueName, exchangeName, '#');
  await activeChannel.prefetch(10);

  await activeChannel.consume(queueName, async (message) => {
    if (!message) return;

    try {
      const event = JSON.parse(message.content.toString('utf8'));
      await prisma.eventLog.upsert({
        where: { eventId: event.metadata.eventId },
        create: {
          eventId: event.metadata.eventId,
          type: event.type,
          entity: event.payload.entity ?? null,
          entityId: event.payload.id ?? event.payload.entityId ?? null,
          payload: event,
        },
        update: {},
      });
      activeChannel.ack(message);
    } catch (error) {
      console.error('[rabbitmq] consumer failed:', error.message);
      activeChannel.nack(message, false, false);
    }
  });

  console.log(`[rabbitmq] consuming ${queueName} from ${exchangeName}`);
  return true;
}

export async function closeRabbitMq() {
  await channel?.close().catch(() => {});
  await connection?.close().catch(() => {});
  channel = null;
  connection = null;
  connecting = null;
}
