import React, { useState, useEffect } from 'react';
import { FaBell, FaBox, FaFileContract, FaStore, FaCheck } from 'react-icons/fa';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'movimiento': return <FaStore className="text-blue-500" />;
      case 'contrato': return <FaFileContract className="text-green-500" />;
      case 'inventario': return <FaBox className="text-orange-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
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
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        {notifications.length > 0 && (
          <button 
            className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
            onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
          >
            Marcar todas como leídas
          </button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg">
            <FaBell className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500 text-lg">No tienes notificaciones nuevas</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                !notification.read ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
