import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const resetPassword = async (userData) => {
  const response = await api.post('/auth/reset-password', userData);
  return response.data;
};

const PYTHON_API_URL = 'http://localhost:8000';

const pythonApi = axios.create({
  baseURL: PYTHON_API_URL,
});

export const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  const response = await pythonApi.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export default api;
