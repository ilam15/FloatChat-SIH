// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
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

  const updateUser = (newDetails) => {
    const updatedUser = { ...user, ...newDetails };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update the user details in localStorage
    if (user && user.id) {
      const userDetails = localStorage.getItem(`userDetails_${user.id}`);
      if (userDetails) {
        const parsedDetails = JSON.parse(userDetails);
        const updatedDetails = { ...parsedDetails, ...newDetails };
        localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(updatedDetails));
      }
    }
  };

  const value = {
    user,
    isLoggedIn,
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