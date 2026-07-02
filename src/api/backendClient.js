const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? '';

// Get tenant from localStorage or use default
function getTenantSlug() {
  try {
    return localStorage.getItem('nexus_tenant_slug') || 'default';
  } catch {
    return 'default';
  }
}

async function request(path, options = {}) {
  const tenantSlug = getTenantSlug();
  const url = new URL(`${API_URL}${path}`, window.location.origin);
  
  // Add tenant as query parameter
  if (!url.searchParams.has('tenant')) {
    url.searchParams.set('tenant', tenantSlug);
  }

  const response = await fetch(url.toString(), {
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
  // Tenant API
  registerTenant: (data) => request('/tenants/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getCurrentTenant: () => request('/tenants/current'),
  updateTenantSettings: (data) => request('/tenants/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  upgradeSubscription: (plan) => request('/tenants/subscription/upgrade', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  }),
  getTenantStats: () => request('/tenants/stats'),
  setTenant: (slug) => {
    try {
      localStorage.setItem('nexus_tenant_slug', slug);
    } catch {}
  },
  getTenant: () => getTenantSlug(),
};
