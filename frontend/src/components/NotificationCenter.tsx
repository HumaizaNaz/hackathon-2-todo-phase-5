import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Notification } from '../../../backend/src/models/notification'; // Adjust path as needed

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface APIResponse<T> {
  data: T;
  message?: string;
}

// Placeholder for notification API calls
const fetchNotifications = async (): Promise<APIResponse<Notification[]>> => {
  try {
    const response = await axios.get<Notification[]>(`${API_BASE_URL}/notifications`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to fetch notifications');
    }
    throw new Error('An unexpected error occurred while fetching notifications');
  }
};

const markNotificationAsRead = async (notificationId: string): Promise<APIResponse<Notification>> => {
  try {
    const response = await axios.put<Notification>(`${API_BASE_URL}/notifications/${notificationId}/read`);
    return { data: response.data, message: "Notification marked as read!" };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to mark notification as read');
    }
    throw new Error('An unexpected error occurred while marking notification as read');
  }
};


const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotifications();
        setNotifications(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    getNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  if (loading) return <div className="p-4">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Notification Center</h2>
      {unreadNotifications.length === 0 && !loading && (
        <p className="text-gray-600">No new notifications.</p>
      )}
      <div className="space-y-3">
        {unreadNotifications.map((notification) => (
          <div key={notification.id} className="p-3 border rounded-md bg-blue-50">
            <p className="text-sm font-medium text-gray-800">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">Type: {notification.type} | {new Date(notification.createdAt).toLocaleString()}</p>
            <button 
              onClick={() => handleMarkAsRead(notification.id as string)}
              className="mt-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Mark as Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
