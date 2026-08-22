// MASAA API Client Service
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class MasaaApiService {
  constructor() {
    this.token = localStorage.getItem('masaa_jwt_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('masaa_jwt_token', token);
    else localStorage.removeItem('masaa_jwt_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[MASAA API] Call to ${endpoint} failed (${err.message}). Using local fallback mode.`);
      throw err;
    }
  }

  // Auth Endpoints
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getMe() {
    return await this.request('/auth/me');
  }

  // Events & Calendars
  async getEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/events${query ? '?' + query : ''}`);
  }

  async createEvent(eventData) {
    return await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async verifyQRTicket(eventId, qrCodeId) {
    return await this.request(`/events/${eventId}/qr-verify`, {
      method: 'POST',
      body: JSON.stringify({ qrCodeId })
    });
  }

  // Tasks & Goals
  async getTasks() {
    return await this.request('/tasks');
  }

  async createTask(taskData) {
    return await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async toggleTask(taskId) {
    return await this.request(`/tasks/${taskId}/toggle`, {
      method: 'PATCH'
    });
  }

  // Booking & Slots
  async getBookingPage() {
    return await this.request('/booking-pages/me');
  }

  async getAvailableSlots() {
    return await this.request('/booking-pages/slots');
  }

  async bookSlot(bookingData) {
    return await this.request('/booking-pages/book', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }

  // AI Operations
  async parseNaturalLanguage(text) {
    return await this.request('/ai/parse-nl', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  async getScheduleHealth() {
    return await this.request('/ai/schedule-health');
  }

  async askAI(query) {
    return await this.request('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // Executive Admin
  async getAdminOverview() {
    return await this.request('/admin/overview');
  }

  async getAdminUsers() {
    return await this.request('/admin/users');
  }

  // Payments
  async triggerMpesaSTKPush(phone, amount) {
    return await this.request('/payments/mpesa/stkpush', {
      method: 'POST',
      body: JSON.stringify({ phone, amount })
    });
  }

  async createStripeCheckout(planId, amount) {
    return await this.request('/payments/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId, amount })
    });
  }
}

export const api = new MasaaApiService();
