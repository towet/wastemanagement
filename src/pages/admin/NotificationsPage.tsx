import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  created_at: string;
  title: string;
  description: string;
  type: 'alert' | 'warning' | 'info';
  read: boolean;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <Info className="w-5 h-5 text-amber-500" />;
    case 'info':
    default:
      return <Bell className="w-5 h-5 text-blue-500" />;
  }
};

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err: any) {
      setError('Failed to fetch notifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      // Refresh list to show updated status
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">System Notifications</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {notifications.length === 0 ? (
          <div className="text-center p-12">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
            <h3 className="mt-4 text-lg font-medium text-slate-800">All Clear!</h3>
            <p className="mt-1 text-slate-500">You have no new notifications.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <li key={notification.id} className={`p-4 flex items-start gap-4 ${notification.read ? 'opacity-60' : ''}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                   <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-slate-800">{notification.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{notification.description}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
