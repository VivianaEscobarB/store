import axios from 'axios';
import { API_URLS } from '../config/apiConfig';

// API principal para las rutas de negocio
export const api = axios.create({
  baseURL: API_URLS.main,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agregar interceptor de respuesta para mejor manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response);
    if (error.response?.status === 404) {
      console.error('Recurso no encontrado:', error.config.url);
    }
    return Promise.reject(error);
  }
);

// API para rutas de usuario/autenticación
export const userApi = axios.create({
  baseURL: API_URLS.user,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
