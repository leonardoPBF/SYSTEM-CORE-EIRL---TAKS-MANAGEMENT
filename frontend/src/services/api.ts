const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string, role?: string) => {
    return apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  getProfile: async () => {
    return apiRequest<any>('/auth/profile');
  },
};

// Tickets API
export const ticketsAPI = {
  getAll: async (filters?: {
    clientId?: string;
    assignedTo?: string;
    status?: string;
    priority?: string;
    queue?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString();
    return apiRequest<any[]>(`/tickets${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/tickets/${id}`);
  },

  create: async (data: {
    subject: string;
    description: string;
    clientId: string;
    priority?: string;
    type?: string;
    source?: string;
    tags?: string[];
    queue?: string;
  }) => {
    return apiRequest<any>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest<any>(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  assign: async (id: string, assignedTo: string) => {
    return apiRequest<any>(`/tickets/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ assignedTo }),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/tickets/${id}`, {
      method: 'DELETE',
    });
  },

  getUnassigned: async () => {
    return apiRequest<any[]>('/tickets/unassigned');
  },
};

// Clients API
export const clientsAPI = {
  getAll: async (filters?: { status?: string; segment?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString();
    return apiRequest<any[]>(`/clients${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/clients/${id}`);
  },

  create: async (data: any) => {
    return apiRequest<any>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest<any>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Agents API
export const agentsAPI = {
  getAll: async (filters?: { team?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString();
    return apiRequest<any[]>(`/agents${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/agents/${id}`);
  },

  create: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    team?: string;
    status?: string;
    maxTickets?: number;
  }) => {
    return apiRequest<any>('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest<any>(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/agents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: async () => {
    return apiRequest<any>('/dashboard/metrics');
  },
};

// Comments API
export const commentsAPI = {
  getByTicket: async (ticketId: string) => {
    return apiRequest<any[]>(`/comments/ticket/${ticketId}`);
  },

  create: async (data: {
    ticketId: string;
    content: string;
    isInternal?: boolean;
    attachments?: string[];
  }) => {
    return apiRequest<any>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

