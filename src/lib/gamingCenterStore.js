const STORAGE_KEY = 'nexus_gaming_center_state';
const CURRENT_USER_KEY = 'nexus_current_user_id';

const nowIso = () => new Date().toISOString();

const defaultGames = [
  {
    id: 'game-valorant',
    title: 'Valorant',
    category: 'FPS',
    description: '5v5 tactical shooter, tournament болон ranked тоглолтод тохиромжтой.',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    is_featured: true,
    popularity: 96,
    min_specs: 'RTX 3060 / 144Hz+',
  },
  {
    id: 'game-cs2',
    title: 'Counter-Strike 2',
    category: 'FPS',
    description: 'LAN match, team practice, competitive setup.',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    is_featured: true,
    popularity: 94,
    min_specs: 'RTX 3060 / 165Hz',
  },
  {
    id: 'game-dota2',
    title: 'Dota 2',
    category: 'MOBA',
    description: '5v5 багийн тоглолт, tournament room-д тохиромжтой.',
    image_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=80',
    is_featured: false,
    popularity: 88,
    min_specs: 'GTX 1660 / 120Hz',
  },
  {
    id: 'game-lol',
    title: 'League of Legends',
    category: 'MOBA',
    description: 'Solo/duo болон team queue тоглолт.',
    image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80',
    is_featured: false,
    popularity: 84,
    min_specs: 'GTX 1650 / 120Hz',
  },
  {
    id: 'game-pubg',
    title: 'PUBG',
    category: 'Battle Royale',
    description: 'Squad room, headset setup, high FPS configuration.',
    image_url: 'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=900&q=80',
    is_featured: true,
    popularity: 90,
    min_specs: 'RTX 3060 / 165Hz',
  },
  {
    id: 'game-fifa',
    title: 'EA Sports FC',
    category: 'Sports',
    description: '1v1 болон casual tournament-д тохиромжтой.',
    image_url: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80',
    is_featured: false,
    popularity: 72,
    min_specs: 'GTX 1650 / Controller',
  },
];

const defaultProducts = [
  { id: 'product-cola', name: 'Coca-Cola', category: 'drinks', price: 3500, description: 'Хүйтэн ундаа', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80', available: true },
  { id: 'product-water', name: 'Water', category: 'drinks', price: 2000, description: 'Цэвэр ус', image_url: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80', available: true },
  { id: 'product-energy', name: 'Energy Drink', category: 'drinks', price: 6500, description: 'Gaming boost', image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=900&q=80', available: true },
  { id: 'product-chips', name: 'Chips', category: 'snacks', price: 4500, description: 'Snack pack', image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=900&q=80', available: true },
  { id: 'product-burger', name: 'Nexus Burger', category: 'meals', price: 12000, description: 'Burger + fries', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', available: true },
  { id: 'product-combo', name: 'Gamer Combo', category: 'combo', price: 18000, description: 'Burger + drink + chips', image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=80', available: true },
];

const defaultTournaments = [
  {
    id: 'tournament-valorant',
    title: 'Valorant Friday Cup',
    game: 'Valorant',
    description: '5v5 багийн тэмцээн. Check-in 18:30.',
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    time: '19:00',
    max_participants: 8,
    current_participants: 2,
    prize_pool: '500,000₮',
    entry_fee: 25000,
    status: 'registration_open',
    image_url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tournament-cs2',
    title: 'CS2 Night Clash',
    game: 'Counter-Strike 2',
    description: '2v2 wingman format. Fast bracket.',
    date: new Date(Date.now() + 86400000 * 9).toISOString(),
    time: '20:00',
    max_participants: 16,
    current_participants: 5,
    prize_pool: '300,000₮',
    entry_fee: 15000,
    status: 'registration_open',
    image_url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tournament-fc',
    title: 'FC 1v1 Weekend',
    game: 'EA Sports FC',
    description: 'Casual controller tournament.',
    date: new Date(Date.now() + 86400000 * 12).toISOString(),
    time: '16:00',
    max_participants: 12,
    current_participants: 0,
    prize_pool: '150,000₮',
    entry_fee: 10000,
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  },
];

const defaultState = {
  users: [
    {
      id: 'admin',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      balance: 150000,
      points: 420,
      rank: 'Diamond',
      total_hours: 36,
    },
    {
      id: 'player',
      username: 'player',
      password: 'player123',
      role: 'user',
      balance: 50000,
      points: 80,
      rank: 'Bronze',
      total_hours: 4,
    },
  ],
  pcs: Array.from({ length: 12 }, (_, index) => {
    const number = index + 1;
    const zone = number > 10 ? 'tournament' : number > 6 ? 'vip' : 'standard';
    return {
      id: `pc-${number}`,
      pc_number: number,
      zone,
      status: 'available',
      specs: zone === 'standard' ? 'RTX 3060 / 165Hz' : 'RTX 4070 / 240Hz',
      current_user_id: null,
      session_start: null,
      hourly_rate: zone === 'standard' ? 5000 : zone === 'vip' ? 8000 : 10000,
    };
  }),
  games: defaultGames,
  products: defaultProducts,
  reservations: [],
  foodOrders: [],
  tournaments: defaultTournaments,
  tournamentRegistrations: [],
  sessions: [],
  payments: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeState(state) {
  const mergeDefaults = (items = [], defaults = []) =>
    items.length
      ? items.map((item) => ({ ...defaults.find((entry) => entry.id === item.id), ...item, image_url: item.image_url || defaults.find((entry) => entry.id === item.id)?.image_url || '' }))
      : clone(defaults);

  return {
    ...clone(defaultState),
    ...state,
    games: mergeDefaults(state.games, defaultGames),
    products: mergeDefaults(state.products, defaultProducts),
    tournaments: mergeDefaults(state.tournaments, defaultTournaments),
    reservations: state.reservations ?? [],
    foodOrders: state.foodOrders ?? [],
    tournamentRegistrations: state.tournamentRegistrations ?? [],
  };
}

export function getState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = clone(defaultState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  const state = normalizeState(JSON.parse(raw));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('nexus-state-change'));
  return state;
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  return getState();
}

export function getCurrentUser() {
  const state = getState();
  const id = localStorage.getItem(CURRENT_USER_KEY);
  return state.users.find((user) => user.id === id) ?? null;
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new Event('nexus-auth-change'));
}

export function loginUser(username, password) {
  const state = getState();
  const user = state.users.find(
    (item) => item.username.toLowerCase() === username.toLowerCase() && item.password === password
  );

  if (!user) {
    throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу байна.');
  }

  setCurrentUser(user);
  return user;
}

export function registerUser(username, password) {
  const state = getState();
  if (state.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Ийм нэртэй хэрэглэгч бүртгэлтэй байна.');
  }

  const user = {
    id: `user-${Date.now()}`,
    username,
    password,
    role: 'user',
    balance: 30000,
    points: 0,
    rank: 'Bronze',
    total_hours: 0,
  };

  state.users.push(user);
  saveState(state);
  setCurrentUser(user);
  return user;
}

export function startPcSession(pcId, userId) {
  const state = getState();
  const pc = state.pcs.find((item) => item.id === pcId);
  const user = state.users.find((item) => item.id === userId);

  if (!pc || !user) throw new Error('PC эсвэл хэрэглэгч олдсонгүй.');
  if (pc.status !== 'available') throw new Error('Энэ PC одоогоор сул биш байна.');

  const session = {
    id: `session-${Date.now()}`,
    pc_id: pc.id,
    pc_number: pc.pc_number,
    user_id: user.id,
    user_name: user.username,
    start_time: nowIso(),
    end_time: null,
    hourly_rate: pc.hourly_rate,
    total_cost: 0,
    status: 'active',
  };

  pc.status = 'occupied';
  pc.current_user_id = user.id;
  pc.session_start = session.start_time;
  state.sessions.push(session);
  saveState(state);
  return session;
}

export function stopPcSession(pcId) {
  const state = getState();
  const pc = state.pcs.find((item) => item.id === pcId);
  if (!pc || pc.status !== 'occupied') throw new Error('Идэвхтэй session алга.');

  const session = state.sessions.find((item) => item.pc_id === pc.id && item.status === 'active');
  const user = state.users.find((item) => item.id === pc.current_user_id);
  if (!session || !user) throw new Error('Session мэдээлэл олдсонгүй.');

  const end = new Date();
  const start = new Date(session.start_time);
  const durationHours = Math.max((end.getTime() - start.getTime()) / 36e5, 1 / 60);
  const totalCost = Math.ceil(durationHours * session.hourly_rate);

  session.end_time = end.toISOString();
  session.duration_hours = Number(durationHours.toFixed(2));
  session.total_cost = totalCost;
  session.status = 'completed';

  user.balance = Math.max(0, user.balance - totalCost);
  user.points += Math.max(1, Math.round(totalCost / 1000));
  user.total_hours = Number((user.total_hours + durationHours).toFixed(2));

  state.payments.push({
    id: `payment-${Date.now()}`,
    user_id: user.id,
    user_name: user.username,
    pc_number: pc.pc_number,
    amount: totalCost,
    type: 'session',
    description: `PC ${pc.pc_number} цагийн төлбөр`,
    createdAt: end.toISOString(),
  });

  pc.status = 'available';
  pc.current_user_id = null;
  pc.session_start = null;
  saveState(state);
  return session;
}

export function updatePcRate(pcId, hourlyRate) {
  const state = getState();
  const pc = state.pcs.find((item) => item.id === pcId);
  if (!pc) throw new Error('PC олдсонгүй.');
  pc.hourly_rate = Number(hourlyRate);
  saveState(state);
  return pc;
}

export function topUpUser(userId, amount) {
  const state = getState();
  const user = state.users.find((item) => item.id === userId);
  if (!user) throw new Error('Хэрэглэгч олдсонгүй.');

  const value = Number(amount);
  user.balance += value;
  state.payments.push({
    id: `payment-${Date.now()}`,
    user_id: user.id,
    user_name: user.username,
    amount: value,
    type: 'top_up',
    description: 'Данс цэнэглэлт',
    createdAt: nowIso(),
  });
  saveState(state);
  return user;
}

export function createReservation(userId, pcId, reservationDate, startTime, durationHours) {
  const state = getState();
  const user = state.users.find((item) => item.id === userId);
  const pc = state.pcs.find((item) => item.id === pcId);
  if (!user || !pc) throw new Error('Хэрэглэгч эсвэл PC олдсонгүй.');

  const duration = Number(durationHours);
  const totalCost = Math.ceil(duration * pc.hourly_rate);
  const reservation = {
    id: `reservation-${Date.now()}`,
    user_id: user.id,
    user_name: user.username,
    pc_id: pc.id,
    pc_number: pc.pc_number,
    zone: pc.zone,
    date: reservationDate,
    start_time: startTime,
    end_time: addHoursToTime(startTime, duration),
    duration_hours: duration,
    status: 'confirmed',
    total_cost: totalCost,
    createdAt: nowIso(),
  };

  state.reservations.push(reservation);
  saveState(state);
  return reservation;
}

export function cancelReservation(reservationId) {
  const state = getState();
  const reservation = state.reservations.find((item) => item.id === reservationId);
  if (!reservation) throw new Error('Захиалга олдсонгүй.');
  reservation.status = 'cancelled';
  saveState(state);
  return reservation;
}

export function placeFoodOrder(userId, items, pcNumber, notes = '') {
  const state = getState();
  const user = state.users.find((item) => item.id === userId);
  if (!user) throw new Error('Хэрэглэгч олдсонгүй.');

  const orderItems = items.map((item) => {
    const product = state.products.find((entry) => entry.id === item.product_id);
    return {
      product_id: item.product_id,
      name: product?.name ?? item.name,
      quantity: Number(item.quantity),
      price: Number(product?.price ?? item.price),
    };
  });
  const total = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  if (total <= 0) throw new Error('Сагс хоосон байна.');

  user.balance = Math.max(0, user.balance - total);
  const order = {
    id: `food-order-${Date.now()}`,
    user_id: user.id,
    user_name: user.username,
    items: orderItems,
    total,
    status: 'pending',
    pc_number: pcNumber ? Number(pcNumber) : null,
    notes,
    createdAt: nowIso(),
  };

  state.foodOrders.push(order);
  state.payments.push({
    id: `payment-${Date.now()}`,
    user_id: user.id,
    user_name: user.username,
    amount: total,
    type: 'food_order',
    description: `Food order #${state.foodOrders.length}`,
    createdAt: order.createdAt,
  });
  saveState(state);
  return order;
}

export function updateFoodOrderStatus(orderId, status) {
  const state = getState();
  const order = state.foodOrders.find((item) => item.id === orderId);
  if (!order) throw new Error('Захиалга олдсонгүй.');
  order.status = status;
  saveState(state);
  return order;
}

export function toggleProductAvailability(productId) {
  const state = getState();
  const product = state.products.find((item) => item.id === productId);
  if (!product) throw new Error('Бүтээгдэхүүн олдсонгүй.');
  product.available = !product.available;
  saveState(state);
  return product;
}

export function addGame(data) {
  const state = getState();
  const game = {
    id: `game-${Date.now()}`,
    title: data.title,
    category: data.category,
    description: data.description,
    image_url: '',
    is_featured: Boolean(data.is_featured),
    popularity: Number(data.popularity ?? 50),
    min_specs: data.min_specs,
  };
  state.games.push(game);
  saveState(state);
  return game;
}

export function registerTournament(tournamentId, userId, teamName) {
  const state = getState();
  const tournament = state.tournaments.find((item) => item.id === tournamentId);
  const user = state.users.find((item) => item.id === userId);
  if (!tournament || !user) throw new Error('Тэмцээн эсвэл хэрэглэгч олдсонгүй.');
  if (tournament.current_participants >= tournament.max_participants) throw new Error('Оролцогчийн тоо дүүрсэн байна.');
  if (state.tournamentRegistrations.some((item) => item.tournament_id === tournamentId && item.user_id === userId)) {
    throw new Error('Та энэ тэмцээнд бүртгүүлсэн байна.');
  }

  user.balance = Math.max(0, user.balance - tournament.entry_fee);
  tournament.current_participants += 1;

  const registration = {
    id: `tournament-registration-${Date.now()}`,
    tournament_id: tournament.id,
    user_id: user.id,
    user_name: user.username,
    team_name: teamName || user.username,
    status: 'registered',
    createdAt: nowIso(),
  };

  state.tournamentRegistrations.push(registration);
  state.payments.push({
    id: `payment-${Date.now()}`,
    user_id: user.id,
    user_name: user.username,
    amount: tournament.entry_fee,
    type: 'tournament',
    description: `${tournament.title} entry fee`,
    createdAt: registration.createdAt,
  });
  saveState(state);
  return registration;
}

function addHoursToTime(time, hours) {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setMinutes(date.getMinutes() + Number(hours) * 60);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatMoney(value) {
  return `${Number(value ?? 0).toLocaleString('mn-MN')}₮`;
}

export function getStats(state = getState()) {
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const activeSessions = state.sessions.filter((session) => session.status === 'active');
  const revenueToday = state.payments
    .filter((payment) => payment.createdAt.slice(0, 10) === today)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const revenueMonth = state.payments
    .filter((payment) => payment.createdAt.slice(0, 7) === month)
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalPcs: state.pcs.length,
    availablePcs: state.pcs.filter((pc) => pc.status === 'available').length,
    activeSessions: activeSessions.length,
    revenueToday,
    revenueMonth,
    users: state.users.length,
    reservations: state.reservations.length,
    foodOrders: state.foodOrders.length,
    tournamentRegistrations: state.tournamentRegistrations.length,
  };
}
