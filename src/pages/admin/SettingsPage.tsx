import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Device } from '../../lib/supabase';

export const SettingsPage: React.FC = () => {
  const [comPort, setComPort] = useState('');
  const [targetDeviceId, setTargetDeviceId] = useState<string | null>(null);

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: devicesData, error: devicesError } = await supabase.from('devices').select('*');
        if (devicesError) throw devicesError;
        setDevices(devicesData || []);

        const { data: settingsData, error: settingsError } = await supabase
          .from('system_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (settingsError) throw settingsError;

        if (settingsData) {
          setComPort(settingsData.com_port);
          setTargetDeviceId(settingsData.target_device_id);

        }
      } catch (err: any) {
        setMessage({ type: 'error', text: `Failed to fetch settings: ${err.message}` });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('system_settings')
      .update({
        com_port: comPort,
        target_device_id: targetDeviceId,

      })
      .eq('id', 1);

    if (error) {
      setMessage({ type: 'error', text: `Failed to save settings: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
      
      <form onSubmit={handleSave} className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Hardware Connection</h2>
            <p className="text-slate-500 mt-1">Configure the connection to the physical device.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="comPort" className="block text-sm font-medium text-slate-700 mb-1">COM Port</label>
                <input id="comPort" type="text" value={comPort || ''} onChange={(e) => setComPort(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., COM3" />
              </div>
              <div>
                <label htmlFor="targetDevice" className="block text-sm font-medium text-slate-700 mb-1">Target Device</label>
                <select id="targetDevice" value={targetDeviceId || ''} onChange={(e) => setTargetDeviceId(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="" disabled>Select a device</option>
                  {devices.map(device => (
                    <option key={device.id} value={device.device_id}>{device.name} ({device.device_id})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>


        </div>

        <div className="border-t border-slate-200 mt-8 pt-6">
          {message && (
            <div className={`mb-4 text-sm p-3 rounded-md ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
