/**
 * Centralized API client for Smart Campus Assistant
 */

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('campus_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getDemoAccounts() {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return res.json();
  },

  // AI Assistant
  async askAI(query) {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async classifyQuery(query) {
    const res = await fetch(`${API_BASE}/ai/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async getKnowledgeBase() {
    const res = await fetch(`${API_BASE}/ai/knowledge`);
    return res.json();
  },

  // Requests / Tickets
  async createRequest(ticketData) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(ticketData)
    });
    return res.json();
  },

  async getMyRequests(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/requests/my-requests?${params}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAllRequests(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/requests?${params}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getRequestDetails(ticketId) {
    const res = await fetch(`${API_BASE}/requests/${ticketId}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateRequestStatus(ticketId, updateData) {
    const res = await fetch(`${API_BASE}/requests/${ticketId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updateData)
    });
    return res.json();
  },

  // Analytics & Insights
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/insights`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAnnouncements() {
    const res = await fetch(`${API_BASE}/analytics/announcements`);
    return res.json();
  },

  // System
  async resetDemo() {
    const res = await fetch(`${API_BASE}/system/reset-demo`, {
      method: 'POST'
    });
    return res.json();
  }
};
