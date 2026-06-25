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

export const predictDisease = async (imageFiles) => {
  const formData = new FormData();
  // Append multiple files using the same 'files' key as expected by FastAPI List[UploadFile]
  imageFiles.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await pythonApi.post('/predict-batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const savePredictionToHistory = async (predictionData) => {
  const response = await api.post('/predictions', predictionData);
  return response.data;
};

export const getPredictionHistory = async () => {
  const response = await api.get('/predictions');
  return response.data;
};

export default api;
