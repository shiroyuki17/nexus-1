const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? '';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  health: () => request('/health'),
  list: (entity) => request(`/${entity}`),
  get: (entity, id) => request(`/${entity}/${id}`),
  create: (entity, data) => request(`/${entity}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (entity, id, data) => request(`/${entity}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  remove: (entity, id) => request(`/${entity}/${id}`, {
    method: 'DELETE',
  }),
};
