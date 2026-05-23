const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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

export const api = {
  // Auth
  register: async (payload: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  login: async (payload: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        return null;
      }
      return await res.json();
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

    const res = await fetch(`${API_URL}/colleges?${params.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
      next: { revalidate: 0 } // Disable fetch caching for dynamic values
    });
    return handleResponse(res);
  },

  getCollegeById: async (id: string) => {
    const res = await fetch(`${API_URL}/colleges/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      next: { revalidate: 0 }
    });
    return handleResponse(res);
  },

  submitReview: async (id: string, payload: { rating: number; comment: string; userName: string }) => {
    const res = await fetch(`${API_URL}/colleges/${id}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Saved Colleges
  getSavedColleges: async () => {
    const res = await fetch(`${API_URL}/saved`, {
      method: 'GET',
      headers: getHeaders(),
      next: { revalidate: 0 }
    });
    return handleResponse(res);
  },

  saveCollege: async (id: string) => {
    const res = await fetch(`${API_URL}/saved/${id}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  unsaveCollege: async (id: string) => {
    const res = await fetch(`${API_URL}/saved/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Q&A Discussion
  getQuestions: async (collegeId: string) => {
    const res = await fetch(`${API_URL}/qa/${collegeId}/questions`, {
      method: 'GET',
      headers: getHeaders(),
      next: { revalidate: 0 },
    });
    return handleResponse(res);
  },

  askQuestion: async (collegeId: string, payload: { content: string; userName?: string }) => {
    const res = await fetch(`${API_URL}/qa/${collegeId}/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  answerQuestion: async (questionId: string, payload: { content: string; userName?: string }) => {
    const res = await fetch(`${API_URL}/qa/questions/${questionId}/answers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

