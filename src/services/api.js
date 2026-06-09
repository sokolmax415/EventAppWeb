import { supabase } from '../lib/supabaseClient'

const API_BASE = 'http://127.0.0.1:8080'

async function request(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    await supabase.auth.signOut();
    window.location.href = '/login';
    throw new Error('No session');
  }

  const token = session?.access_token

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    await supabase.auth.signOut()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  if (res.status !== 204) {
    return res.json()
  }
  return null
}

export const api = {
  // Auth
  getMe: () => request('/me'),
  updateProfile: (data) => request('/me', { method: 'PATCH', body: JSON.stringify(data) }),

  // Events
  getEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  getCategories: () => request('/categories'),

  // Participation
  setParticipation: (eventId, status) => 
    request(`/events/${eventId}/participation`, { method: 'POST', body: JSON.stringify({ status }) }),
  cancelParticipation: (eventId) => 
    request(`/events/${eventId}/participation`, { method: 'DELETE' }),

  // User data
  getMyEvents: () => request('/me/events'),
  getMyCreatedEvents: () => request('/me/created-events'),
  getAchievements: () => request('/me/achievements'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),

  // Admin
  getAdminUsers: () => request('/admin/users'),
  changeUserRole: (userId, role) => request(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  approveEvent: (id) => request(`/admin/events/${id}/approve`, { method: 'POST' }),
  rejectEvent: (id) => request(`/admin/events/${id}/reject`, { method: 'POST' }),
  confirmAttendance: (eventId, userId) => request(`/admin/events/${eventId}/attendance/${userId}`, { method: 'POST' }),
}