import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Device } from '../lib/supabase';

export type DustbinStatus = 'empty' | 'half' | 'full' | 'overflow';

interface BluetoothContextType {
  isConnected: boolean;
  dustbinStatus: DustbinStatus;
  dustbinLevel: number;
  connectedDevice: Device | null;
  devices: Device[];
  connectDevice: (deviceId?: string) => Promise<void>;
  disconnectDevice: () => void;
  refreshDevices: () => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

interface BluetoothProviderProps {
  children: ReactNode;
}

export const BluetoothProvider: React.FC<BluetoothProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [dustbinLevel, setDustbinLevel] = useState(25);
  const [dustbinStatus, setDustbinStatus] = useState<DustbinStatus>('empty');
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    // Simulate real-time device updates when connected
    if (isConnected && connectedDevice) {
      const interval = setInterval(async () => {
        // Simulate random level changes
        const newLevel = Math.max(0, Math.min(100, dustbinLevel + (Math.random() - 0.5) * 10));
        setDustbinLevel(newLevel);
        
        let newStatus: DustbinStatus;
        if (newLevel < 25) {
          newStatus = 'empty';
        } else if (newLevel < 50) {
          newStatus = 'half';
        } else if (newLevel < 85) {
          newStatus = 'full';
        } else {
          newStatus = 'overflow';
        }
        
        setDustbinStatus(newStatus);

        // Update device in database
        try {
          await supabase
            .from('devices')
            .update({ 
              fill_level: Math.round(newLevel),
              status: 'online',
              updated_at: new Date().toISOString()
            })
            .eq('id', connectedDevice.id);
        } catch (error) {
          console.error('Error updating device:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isConnected, connectedDevice, dustbinLevel]);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching devices:', error);
        return;
      }

      setDevices(data || []);
    } catch (error) {
      console.error('Error in fetchDevices:', error);
    }
  };

  const connectDevice = async (deviceId?: string) => {
    try {
      let targetDevice: Device | null = null;

      if (deviceId) {
        // Connect to specific device
        const device = devices.find(d => d.id === deviceId);
        if (device) {
          targetDevice = device;
        }
      } else {
        // Connect to first available online device
        targetDevice = devices.find(d => d.status === 'online') || devices[0] || null;
      }

      if (!targetDevice) {
        console.error('No device available to connect');
        return;
      }

      // Update device status to online
      const { error } = await supabase
        .from('devices')
        .update({ 
          status: 'online',
          updated_at: new Date().toISOString()
        })
        .eq('id', targetDevice.id);

      if (error) {
        console.error('Error updating device status:', error);
        return;
      }

      setConnectedDevice(targetDevice);
      setDustbinLevel(targetDevice.fill_level);
      
      // Set initial status based on fill level
      if (targetDevice.fill_level < 25) {
        setDustbinStatus('empty');
      } else if (targetDevice.fill_level < 50) {
        setDustbinStatus('half');
      } else if (targetDevice.fill_level < 85) {
        setDustbinStatus('full');
      } else {
        setDustbinStatus('overflow');
      }

      setIsConnected(true);
      
      // Refresh devices list
      await fetchDevices();
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    setConnectedDevice(null);
    setDustbinLevel(0);
    setDustbinStatus('empty');
  };

  const refreshDevices = async () => {
    await fetchDevices();
  };

  const value = {
    isConnected,
    dustbinStatus,
    dustbinLevel,
    connectedDevice,
    devices,
    connectDevice,
    disconnectDevice,
    refreshDevices
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};