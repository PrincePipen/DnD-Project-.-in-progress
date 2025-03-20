import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext(null);

/**
 * Authentication provider component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // In a real app, you would validate the token with your backend
      try {
        // For simplicity, we'll just extract user info from token
        // In a real app, you should decode and verify JWT properly
        const userData = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(userData);
      } catch (err) {
        // If token is invalid, clear it
        localStorage.removeItem('authToken');
        setError('Invalid auth token');
      }
    }
    
    setIsLoading(false);
  }, []);

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise} - Auth result
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, make API request to login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      setCurrentUser(data.user);
      
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   * @param {String} email - User email
   * @param {String} password - User password
   * @param {String} username - User's username
   * @returns {Promise} - Auth result
   */
  const register = async (email, password, username) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, make API request to register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      setCurrentUser(data.user);
      
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  // Auth context value
  const value = {
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;