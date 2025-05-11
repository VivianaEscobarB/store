import { userApi } from './api';
import Swal from 'sweetalert2';

export const authService = {
    logout: async () => {
        try {
            const token = sessionStorage.getItem('token');
            
            // No esperamos respuesta del servidor, simplemente limpiamos
            // el almacenamiento local y redirigimos
            sessionStorage.clear();
            localStorage.clear();

            // Opcional: Notificar al servidor (sin esperar respuesta)
            if (token) {
                userApi.post('/logout', null, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).catch(() => {
                    // Ignoramos errores del servidor al cerrar sesión
                    console.log('Logout local completado');
                });
            }

            window.location.href = '/login';
        } catch (error) {
            // Aseguramos que siempre se limpie la sesión
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '/login';
        }
    },

    isAuthenticated: () => {
        return !!sessionStorage.getItem('token');
    }
};
