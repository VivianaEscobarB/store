import api from './api';

export const subscribeToNotifications = (userId, callback) => {
  // Aquí podrías implementar WebSocket o polling para notificaciones en tiempo real
  const checkNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${userId}`);
      callback(response.data);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  // Revisar notificaciones cada 30 segundos
  const interval = setInterval(checkNotifications, 30000);

  return () => clearInterval(interval);
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
  }
};
