import React, { useState, useEffect } from 'react';
import { supabase, type Device } from '../../lib/supabase';
import { Trash2, Wifi, WifiOff } from 'lucide-react';

const DustbinItem: React.FC<{ device: Device }> = ({ device }) => {
  const fillLevel = device.fill_level || 0;
  const isOnline = device.status === 'online';

  const getBarColor = () => {
    if (!isOnline) return 'bg-slate-300';
    if (fillLevel >= 90) return 'bg-red-500';
    if (fillLevel >= 60) return 'bg-orange-500';
    if (fillLevel >= 30) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
        {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-slate-800 text-sm truncate pr-2" title={device.name}>{device.name}</span>
          <span className={`font-semibold text-sm ${isOnline ? 'text-slate-800' : 'text-slate-500'}`}>
            {isOnline ? `${fillLevel}%` : 'Offline'}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${getBarColor()}`} style={{ width: `${isOnline ? fillLevel : 100}%` }} />
        </div>
      </div>
    </div>
  );
};

export const DustbinStatus: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching devices:', error);
        setError('Could not load device data.');
      } else {
        setDevices(data || []);
      }
      setLoading(false);
    };

    fetchDevices();

    const subscription = supabase
      .channel('devices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, (payload) => {
        console.log('Device change received!', payload);
        fetchDevices(); // Refetch all devices on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">All Dustbins Status</h3>
      {loading ? (
        <div className="text-center text-slate-500">Loading devices...</div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
      ) : devices.length === 0 ? (
        <div className="text-center text-slate-500 bg-slate-50 p-4 rounded-lg">No devices found. Add one from the admin dashboard.</div>
      ) : (
        <div className="space-y-2">
          {devices.map(device => (
            <DustbinItem key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
};