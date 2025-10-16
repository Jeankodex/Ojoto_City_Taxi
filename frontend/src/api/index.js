
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
})

// attach token when present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ojoto_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function register(data){ return api.post('/auth/register', data) }
export async function login(data){ return api.post('/auth/login', data) }
export async function createTrip(payload){ return api.post('/trips', payload) }
export async function listTrips(){ return api.get('/trips') }
export async function deleteTrip(id){ return api.delete(`/trips/${id}`) }
export async function updateTrip(id, payload) {return api.put(`/trips/${id}`, payload)}
export async function sendMessage(payload) {return api.post('/contact', payload)}
export async function updateProfile(formData) {return api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' }})}
export async function fetchProfile() { return api.get('/auth/profile') }


export default api
