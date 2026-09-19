/**
 * API Service for Smart Water Usage Advisor
 * Communicates with FastAPI backend with comprehensive error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      let errorMessage = `Server error (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(d => `${d.loc ? d.loc.join('.') : ''}: ${d.msg}`).join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        errorMessage = `HTTP error ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the Water Advisor backend. Please make sure the backend server is running.');
    }
    throw err;
  }
}

export const api = {
  // Calculate daily water usage & category breakdown
  calculate: (assessmentData) => {
    return request('/calculate', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  },

  // Analyze top wastage points and potential savings
  analyze: (assessmentData) => {
    return request('/analyze', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  },

  // Chat with Aqua Advisor assistant
  chat: (message, waterProfile = null, conversationHistory = []) => {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        water_profile: waterProfile,
        conversation_history: conversationHistory,
      }),
    });
  },

  // Get benchmark constants and assumptions
  getBenchmarks: () => {
    return request('/benchmarks', {
      method: 'GET',
    });
  },

  // Get backend operational status
  getHealth: () => {
    return request('/health', {
      method: 'GET',
    });
  },

  // Get RAG knowledge base articles
  getKnowledge: () => {
    return request('/knowledge', {
      method: 'GET',
    });
  },
};
