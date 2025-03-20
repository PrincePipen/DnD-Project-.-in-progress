import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for making API requests with authentication
 * @param {String} endpoint - API endpoint without leading slash
 * @returns {Object} API methods and state
 */
const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
  const url = `${API_BASE_URL}/${endpoint}`;

  /**
   * Get auth headers if user is logged in
   * @returns {Object} Headers object
   */
  const getHeaders = useCallback(() => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (currentUser) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }, [currentUser]);

  /**
   * Make GET request
   * @param {Object} queryParams - Query parameters
   * @returns {Promise} API response
   */
  const get = useCallback(async (queryParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query string
      const queryString = Object.keys(queryParams).length 
        ? `?${new URLSearchParams(queryParams).toString()}`
        : '';
      
      const response = await fetch(`${url}${queryString}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Request failed');
      }
      
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, getHeaders]);

  /**
   * Make POST request
   * @param {Object} body - Request body
   * @returns {Promise} API response
   */
  const post = useCallback(async (body = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Request failed');
      }
      
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, getHeaders]);

  /**
   * Make PUT request
   * @param {Object} body - Request body
   * @returns {Promise} API response
   */
  const put = useCallback(async (body = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Request failed');
      }
      
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, getHeaders]);

  /**
   * Make DELETE request
   * @returns {Promise} API response
   */
  const del = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Request failed');
      }
      
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, getHeaders]);

  return {
    data,
    error,
    isLoading,
    get,
    post,
    put,
    del
  };
};

export default useApi;