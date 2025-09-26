// dbService.js
// Database operations using backend API

const API_BASE_URL = 'http://localhost:5002/api'; // Adjust if backend port changes

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Get all users
export const getUsers = () => {
  return apiCall('/users');
};

// Get user by email
export const getUserByEmail = async (email) => {
  const result = await apiCall('/users/search', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return result;
};

// Get user by ID
export const getUserById = async (id) => {
  return apiCall(`/users/${id}`);
};

// Create a new user
export const createUser = async (userData) => {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Update user
export const updateUser = async (id, userData) => {
  return apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Delete user
export const deleteUser = async (id) => {
  return apiCall(`/users/${id}`, {
    method: 'DELETE',
  });
};

// Login user
export const loginUser = async (email, password) => {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};
