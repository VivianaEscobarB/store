import axios from 'axios';
import { API_URLS } from '../config/apiConfig';

const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Interceptor para añadir el token
    instance.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores
    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                sessionStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const api = createAxiosInstance(API_URLS.main);
export const userApi = createAxiosInstance(API_URLS.user);
export const authApi = createAxiosInstance(API_URLS.auth);

export default api; // Mantener exportación por defecto para compatibilidad
