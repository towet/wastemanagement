import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { useAuth } from '../../contexts/AuthContext';
import { useBluetooth } from '../../contexts/BluetoothContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../lib/supabase';
import type { UserProfile, Device } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { devices, refreshDevices } = useBluetooth();
  const { notifications } = useNotifications();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal and form state
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceLocation, setNewDeviceLocation] = useState('');
  const [addDeviceLoading, setAddDeviceLoading] = useState(false);
  const [addDeviceError, setAddDeviceError] = useState<string | null>(null);

  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), refreshDevices()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddDeviceLoading(true);
    setAddDeviceError(null);
    try {
      const { error } = await supabase.from('devices').insert([
        {
          name: newDeviceName,
          device_id: `DEV-${Date.now().toString().slice(-6)}`,
          location: newDeviceLocation,
          status: 'offline',
          battery_level: 100,
          fill_level: 0,
        },
      ]);
      if (error) throw error;
      setNewDeviceName('');
      setNewDeviceLocation('');
      await refreshDevices();
      setShowAddDeviceModal(false);
    } catch (err: any) {
      setAddDeviceError(`Failed to add device: ${err.message}`);
    } finally {
      setAddDeviceLoading(false);
    }
  };

  const openDeleteModal = (device: Device) => {
    setDeviceToDelete(device);
    setDeleteError(null);
  };

  const closeDeleteModal = () => setDeviceToDelete(null);

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceToDelete.id);
      if (error) throw error;
      await refreshDevices();
      closeDeleteModal();
    } catch (err: any) {
      setDeleteError(`Failed to delete device: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeDevices = devices.filter(d => d.status === 'online').length;
  const criticalAlerts = notifications.filter(n => n.type === 'alert' && !n.read).length;
  const systemHealth = devices.length > 0 ? (activeDevices / devices.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-300 text-lg">
          Welcome back, {user?.user_metadata?.full_name || 'Admin'}. Here's your system overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Users" value={users.length.toString()} icon={Users} />
        <StatsCard title="Active Devices" value={`${activeDevices}/${devices.length}`} icon={Trash2} />
        <StatsCard title="System Health" value={`${systemHealth.toFixed(0)}%`} icon={TrendingUp} />
        <Link to="/app/admin/notifications">
          <StatsCard title="Critical Alerts" value={criticalAlerts.toString()} icon={AlertTriangle} changeType={criticalAlerts > 0 ? 'negative' : 'positive'} />
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Device Management</h2>
          <button onClick={() => setShowAddDeviceModal(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Add Device
          </button>
        </div>

        {devices.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-800">No Devices Found</h3>
            <p className="text-slate-500 mt-1 mb-4">Get started by adding your first hardware device.</p>
            <button onClick={() => setShowAddDeviceModal(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Device
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Device ID</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Location</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600">Level</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 font-semibold text-slate-900">{device.name}</td>
                    <td className="py-3 px-2 font-mono text-xs text-slate-500">{device.device_id}</td>
                    <td className="py-3 px-2 text-slate-600">{device.location}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        device.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${
                            device.fill_level < 80 ? 'bg-emerald-500' : 'bg-red-500'
                          }`} style={{ width: `${device.fill_level}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{device.fill_level}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => openDeleteModal(device)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setShowAddDeviceModal(false)} className="absolute top-3 right-3 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Add New Device</h3>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Device Name</label>
                <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2" value={newDeviceLocation} onChange={(e) => setNewDeviceLocation(e.target.value)} required />
              </div>
              {addDeviceError && <div className="text-red-600 text-sm">{addDeviceError}</div>}
              <div className="flex justify-end">
                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-700 disabled:bg-slate-300" disabled={addDeviceLoading}>
                  {addDeviceLoading ? 'Adding...' : 'Add Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-slate-600 mt-2">
              Are you sure you want to remove the device "{deviceToDelete.name}"? This action cannot be undone.
            </p>
            {deleteError && <p className="text-red-600 text-sm mt-3">{deleteError}</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md font-medium hover:bg-slate-300">
                Cancel
              </button>
              <button onClick={handleDeleteDevice} disabled={deleteLoading} className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:bg-red-300">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};