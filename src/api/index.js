const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function req(path, options = {}) {
  const headers = { ...options.headers }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера')
  return data
}

export const api = {
  // Auth
  register: (body) => req('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => req('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => req('/auth/me'),

  // Products
  getProducts: () => req('/products'),
  getProduct: (id) => req(`/products/${id}`),
  createProduct: (formData) => req('/products', { method: 'POST', body: formData }),
  updateProduct: (id, body) => req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => req(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => req('/orders'),
  createOrder: (body) => req('/orders', { method: 'POST', body: JSON.stringify(body) }),
  toggleDone: (id, done) => req(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ done }) }),
}
