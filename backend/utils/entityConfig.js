export const entityConfig = {
  users: {
    model: 'userProfile',
    dateFields: ['session_start'],
    numberFields: ['balance', 'points', 'total_hours', 'current_pc'],
  },
  pcs: {
    model: 'pC',
    dateFields: ['session_start'],
    numberFields: ['pc_number', 'hourly_rate'],
  },
  reservations: {
    model: 'reservation',
    dateFields: ['date'],
    numberFields: ['pc_number', 'duration_hours', 'total_cost'],
  },
  games: {
    model: 'game',
    numberFields: ['popularity'],
  },
  products: {
    model: 'product',
    numberFields: ['price'],
  },
  'food-orders': {
    model: 'foodOrder',
    numberFields: ['total', 'pc_number'],
  },
  tournaments: {
    model: 'tournament',
    dateFields: ['date'],
    numberFields: ['max_participants', 'current_participants', 'entry_fee'],
  },
  'tournament-registrations': {
    model: 'tournamentRegistration',
  },
  transactions: {
    model: 'transaction',
    numberFields: ['amount', 'balance_after'],
  },
};

export function getEntityConfig(entity) {
  return entityConfig[entity] ?? null;
}

export function normalizePayload(payload, config) {
  const data = { ...payload };

  for (const field of config.dateFields ?? []) {
    if (data[field]) {
      data[field] = new Date(data[field]);
    }
  }

  for (const field of config.numberFields ?? []) {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      data[field] = Number(data[field]);
    }
  }

  return data;
}
