import axios from 'axios';

// The base URL of your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
});

// IMPORTANT: Interceptor to add the auth token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Public Endpoints ---
export const getPortfolioData = () => api.get('/'); // New backend route we will create

// --- Auth Endpoints ---
export const login = (credentials) => api.post('/auth/login', credentials);

// --- Admin Endpoints ---
export const getAdminData = () => api.get('/admin/data'); // New backend route

export const updateAbout = (content) => api.put('/about', content);

export const createProject = (projectData) => api.post('/projects', projectData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const updateProject = (id, projectData) => api.put(`/projects/${id}`, projectData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const createBlog = (blogData) => api.post('/blogs', blogData);
export const updateBlog = (id, blogData) => api.put(`/blogs/${id}`, blogData);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

export default api;