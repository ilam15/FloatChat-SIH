import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for stored authentication on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (userData, token) => {
    try {
      setCurrentUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    try {
      const mergedUserData = { ...currentUser, ...updatedUserData };
      setCurrentUser(mergedUserData);
      localStorage.setItem('currentUser', JSON.stringify(mergedUserData));
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  // Mock function to simulate getting user by ID (replace with your actual API call)
  const getUserById = async (userId) => {
    // This is a mock implementation - replace with your actual database call
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.id === userId) {
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  };

  const value = {
    // Primary user reference
    currentUser,
    // Alias for compatibility with components expecting 'user'
    user: currentUser,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUser,
    getUserById,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export mock functions for dbService (you can remove these if you have actual implementations)
export const updateUser = async (userId, userData) => {
  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.id === userId) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    return null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const deleteUser = async (userId) => {
  try {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};