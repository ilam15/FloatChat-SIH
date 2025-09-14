// dbService.js
// Simulates database operations using localStorage as a mock database

// Simulate API calls with timeouts
const simulateApiCall = (data, success = true, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(new Error("Database operation failed"));
      }
    }, delay);
  });
};

// Get all users from localStorage (simulating database)
export const getUsers = () => {
  return simulateApiCall(JSON.parse(localStorage.getItem('users') || '[]'));
};

// Get user by email
export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return simulateApiCall(users.find(user => user.email === email));
};

// Get user by ID
export const getUserById = async (id) => {
  const users = await getUsers();
  return simulateApiCall(users.find(user => user.id === id));
};

// Create a new user
export const createUser = async (userData) => {
  const users = await getUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    return simulateApiCall(null, false, 500);
  }
  
  // Add new user
  const newUser = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...userData
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return simulateApiCall(newUser);
};

// Update user
export const updateUser = async (id, userData) => {
  const users = await getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return simulateApiCall(null, false, 500);
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  return simulateApiCall(users[userIndex]);
};

// Delete user
export const deleteUser = async (id) => {
  const users = await getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  localStorage.setItem('users', JSON.stringify(filteredUsers));
  return simulateApiCall({ success: true });
};