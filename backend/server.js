import 'dotenv/config';
import { app } from './app.js';
import { startEventConsumers } from './events/rabbitmq.js';

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`Nexus API listening on http://localhost:${port}`);
});

startEventConsumers().catch((error) => {
  console.warn('[rabbitmq] consumers did not start:', error.message);
});
