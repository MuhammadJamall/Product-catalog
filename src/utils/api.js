/**
 * API Utility Functions
 * Wraps fetch() to automatically include JWT token from Redux store
 */

const BASE_URL = 'http://127.0.0.1:8000';

/**
 * Helper function to get current token from localStorage
 * This works even before Redux is initialized
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Generic API request function with automatic auth header injection
 * @param {string} endpoint - API endpoint (e.g., '/products/')
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise<Response>} - Fetch response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Merge headers (allow overriding defaults)
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    // Handle 401 Unauthorized (token expired/invalid)
    if (response.status === 401) {
      // Clear invalid token from storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      
      // Redirect to login page (if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      throw new Error('Session expired. Please login again.');
    }
    
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Convenience methods for common HTTP operations
 */
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
};

export default api;