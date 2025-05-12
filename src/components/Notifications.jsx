import React, { useState, useEffect } from 'react';
import { FaBell, FaBox, FaFileContract, FaStore, FaCheck, FaClock } from 'react-icons/fa';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');

        console.log('Fetching notifications for user:', userId);

        if (!token || !userId) {
          console.error('No token or userId available');
          return;
        }

        const response = await api.get(`/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Notifications received:', response.data);
        setNotifications(response.data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return <FaBell className="text-blue-500" />;
      case 'request':
        return <FaBox className="text-orange-500" />;
      case 'approval':
        return <FaFileContract className="text-green-500" />;
      case 'reminder':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const formatNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'welcome':
        return {
          title: '¡Bienvenido!',
          message: notification.message
        };
      case 'request':
        return {
          title: 'Solicitud en Proceso',
          message: notification.message
        };
      case 'approval':
        return {
          title: 'Solicitud Aprobada',
          message: notification.message
        };
      default:
        return {
          title: notification.title,
          message: notification.message
        };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(notif => 
        notif.id === id ? {...notif, read: true} : notif
      ));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  return (
    <div className="w-full"> {/* Cambiado de max-w-2xl mx-auto a w-full */}
      <div className="flex justify-between items-center mb-4">
        {notifications.length > 0 && (
          <button 
            className="text-blue-500 hover:text-blue-700 text-sm font-semibold cursor-pointer"
            onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
          >
            Marcar todas como leídas
          </button>
        )}
      </div>
      <div className="space-y-2 w-full"> {/* Añadido w-full */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg w-full"> {/* Añadido w-full */}
            <FaBell className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500 text-lg">No tienes notificaciones nuevas</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const formattedMessage = formatNotificationMessage(notification);
            return (
              <div 
                key={notification.id} 
                className={`flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full ${
                  !notification.read ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{formattedMessage.title}</h3>
                      <p className="text-gray-600 text-sm">{formattedMessage.message}</p>
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)} {/* Cambiar timestamp por createdAt */}
                      </span>
                    </div>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
