const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getApiUrl = (path: string) => {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  return `${API_URL.replace(/\/$/, '')}${path}`;
};

const getHeaders = (extraHeaders?: HeadersInit) => {
  const headers = new Headers(extraHeaders);
  headers.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
};

async function handleResponse(response: Response) {
  let data;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return null;
  }

  if (!response.ok) {
    if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorMsg = data.errors.map((e: any) => e.message || `${e.field || 'field'} is invalid`).join(', ');
      throw new Error(errorMsg);
    }
    throw new Error(data?.message || 'Something went wrong');
  }
  return data;
}

async function apiRequest(path: string, init: RequestInit = {}) {
  try {
    const response = await fetch(getApiUrl(path), {
      ...init,
      headers: getHeaders(init.headers),
    });

    return handleResponse(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new Error(message);
  }
}

export const api = {
  // Auth
  register: async (payload: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: any) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe: async () => {
    try {
      return await apiRequest('/auth/me', {
        method: 'GET',
      });
    } catch (e) {
      return null;
    }
  },

  // Colleges
  getColleges: async (filters: {
    search?: string;
    location?: string;
    minFees?: number;
    maxFees?: number;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.minFees !== undefined) params.append('minFees', String(filters.minFees));
    if (filters.maxFees !== undefined) params.append('maxFees', String(filters.maxFees));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    return apiRequest(`/colleges?${params.toString()}`, {
      method: 'GET',
    });
  },

  getCollegeById: async (id: string) => {
    return apiRequest(`/colleges/${id}`, {
      method: 'GET',
    });
  },

  submitReview: async (id: string, payload: { rating: number; comment: string; userName: string }) => {
    return apiRequest(`/colleges/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Saved Colleges
  getSavedColleges: async () => {
    return apiRequest('/saved', {
      method: 'GET',
    });
  },

  saveCollege: async (id: string) => {
    return apiRequest(`/saved/${id}`, {
      method: 'POST',
    });
  },

  unsaveCollege: async (id: string) => {
    return apiRequest(`/saved/${id}`, {
      method: 'DELETE',
    });
  },

  // Q&A Discussion
  getQuestions: async (collegeId: string) => {
    return apiRequest(`/qa/${collegeId}/questions`, {
      method: 'GET',
    });
  },

  askQuestion: async (collegeId: string, payload: { content: string; userName?: string }) => {
    return apiRequest(`/qa/${collegeId}/questions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  answerQuestion: async (questionId: string, payload: { content: string; userName?: string }) => {
    return apiRequest(`/qa/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
