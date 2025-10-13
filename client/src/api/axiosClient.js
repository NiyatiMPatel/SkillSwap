import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Centralized Axios client with interceptors
 * - Automatically attaches auth token to requests
 * - Handles global error responses
 * - Provides uniform error shape for Redux thunks
 */

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attach JWT token from localStorage to Authorization header
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handle 401 errors (unauthorized) globally
 * - Standardize error messages
 * - Show toast notifications for errors
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject({
        message: 'Network error. Please check your connection.',
      });
    }

    const { status, data } = error.response;

    // Extract error message first
    const errorMessage = data?.message || 'Something went wrong';

    // Handle 401 - Unauthorized (token expired or invalid)
    if (status === 401) {
      // Only handle token expiration, not sign-in failures
      const isSignInOrSignUpPage = window.location.pathname === '/signin' || window.location.pathname === '/signup';
      
      // If user is trying to sign in/up, let the form handle the error
      if (isSignInOrSignUpPage) {
        return Promise.reject({
          message: errorMessage,
          status,
          data,
        });
      }
      
      // For authenticated routes, clear auth data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show error message
      toast.error('Session expired. Please sign in again.');
      
      // Redirect to sign in page
      window.location.href = '/signin';
      
      return Promise.reject({
        message: 'Session expired. Please sign in again.',
      });
    }
    
    // Show error toast (can be disabled if needed)
    // toast.error(errorMessage);

    return Promise.reject({
      message: errorMessage,
      status,
      data,
    });
  }
);

export default axiosClient;
