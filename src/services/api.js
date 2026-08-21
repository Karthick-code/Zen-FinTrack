const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('zen_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      errorMsg = `Server responded with ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

// --- Auth API ---
export const authApi = {
  async register(name, email, password, confirmPassword) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    return handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};

// --- Transactions API ---
export const transactionApi = {
  async getTransactions(params) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.type) query.set('type', params.type);
    if (params?.category) query.set('category', params.category);
    if (params?.period) query.set('period', params.period);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);

    const res = await fetch(`${API_BASE}/transactions?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async createTransaction(data) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async reportMistake(data) {
    const res = await fetch(`${API_BASE}/transactions/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateMetadata(id, title, description) {
    const res = await fetch(`${API_BASE}/transactions/${id}/metadata`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ title, description }),
    });
    return handleResponse(res);
  },
};

// --- Reports API ---
export const reportApi = {
  async getFinancialState(period) {
    const query = period ? `?period=${encodeURIComponent(period)}` : '';
    const res = await fetch(`${API_BASE}/reports/state${query}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getCategoryReport(period) {
    const query = period ? `?period=${encodeURIComponent(period)}` : '';
    const res = await fetch(`${API_BASE}/reports/categories${query}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getSavingsReport() {
    const res = await fetch(`${API_BASE}/reports/savings`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};

// --- Support API ---
export const supportApi = {
  async getTickets() {
    const res = await fetch(`${API_BASE}/support/tickets`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getTicketDetails(id) {
    const res = await fetch(`${API_BASE}/support/tickets/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async createTicket(subject, message) {
    const res = await fetch(`${API_BASE}/support/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ subject, message }),
    });
    return handleResponse(res);
  },

  async replyToTicket(id, message) {
    const res = await fetch(`${API_BASE}/support/tickets/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },

  async updateTicketStatus(id, status) {
    const res = await fetch(`${API_BASE}/support/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
};

// --- Admin API ---
export const adminApi = {
  async getStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};
