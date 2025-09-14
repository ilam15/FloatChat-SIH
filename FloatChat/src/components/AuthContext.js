// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById } from './dbService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Verify user still exists in database
          const dbUser = await getUserById(userData.id);
          if (dbUser) {
            setUser(dbUser);
            setIsLoggedIn(true);
          } else {
            // User no longer exists in database
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};