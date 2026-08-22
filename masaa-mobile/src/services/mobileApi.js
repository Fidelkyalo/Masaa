// MASAA Mobile REST API Client
const API_BASE = 'http://localhost:5000/api/v1';

export class MobileApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
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
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[Mobile API] Fallback for ${endpoint}:`, err.message);
      return { success: false, fallback: true };
    }
  }

  async login(email, password) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getEvents() {
    return await this.request('/events');
  }

  async createEvent(eventData) {
    return await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async getTasks() {
    return await this.request('/tasks');
  }

  async toggleTask(taskId) {
    return await this.request(`/tasks/${taskId}/toggle`, { method: 'PATCH' });
  }

  async getBookingSlots() {
    return await this.request('/booking-pages/slots');
  }

  async parseNaturalLanguage(text) {
    return await this.request('/ai/parse-nl', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  async triggerMpesaSTKPush(phone, amount) {
    return await this.request('/payments/mpesa/stkpush', {
      method: 'POST',
      body: JSON.stringify({ phone, amount })
    });
  }
}

export const mobileApi = new MobileApiService();
