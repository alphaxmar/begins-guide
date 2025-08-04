import apiService from './api';

export const userService = {
  // Get all users
  async getUsers() {
    try {
      return await apiService.get('/users');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id) {
    try {
      return await apiService.get(`/users/${id}`);
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      return await apiService.post('/users', userData);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      return await apiService.put(`/users/${id}`, userData);
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      return await apiService.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      // Store token if login successful
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
  },

  // Get current user's token
  getAuthToken() {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }
};

export default userService;