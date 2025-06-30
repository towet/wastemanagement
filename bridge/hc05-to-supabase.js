const SerialPort = require('serialport');
const { createClient } = require('@supabase/supabase-js');

// --- Pre-filled Supabase Credentials (DO NOT CHANGE) ---
const SUPABASE_URL = 'https://bvjdvbnmxbgsnuzksfft.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2amR2Ym5teGJnc251emtzZmZ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTcxMDk3OSwiZXhwIjoyMDY1Mjg2OTc5fQ.qm0YCDlGtJrvjl_MqMQLEDAl1w82wB8cLNzUlwsBbA0';
// ===========================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let port;
let lastNotifiedFillLevel = {}; // Tracks the last notified fill level for each device to prevent spam

async function getSettingsAndConnect() {
  console.log('Fetching settings from Supabase...');
  
  // Close any existing port connection before fetching new settings
  if (port && port.isOpen) {
    port.close();
  }

  const { data, error } = await supabase
    .from('system_settings')
    .select('com_port, target_device_id')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.error('Error fetching settings:', error ? error.message : 'No settings found.');
    console.log('Please configure settings in the admin dashboard. Retrying in 10 seconds...');
    setTimeout(getSettingsAndConnect, 10000);
    return;
  }

  const { com_port: portName, target_device_id: deviceId } = data;

  if (!portName || !deviceId) {
    console.error('COM Port or Target Device ID is not set. Please configure them in the admin dashboard. Retrying in 10 seconds...');
    setTimeout(getSettingsAndConnect, 10000);
    return;
  }

  console.log(`Settings loaded: Port=${portName}, DeviceID=${deviceId}. Attempting to connect...`);
  
  port = new SerialPort(portName, { baudRate: 9600 }, (err) => {
    if (err) {
      console.error(`Error: Failed to open port ${portName}.`, err.message);
      console.log('Is the device connected? Retrying in 10 seconds...');
      setTimeout(getSettingsAndConnect, 10000);
      return;
    }
    console.log(`Successfully connected to ${portName}. Listening for sensor data...`);
  });

  const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }));

  parser.on('data', async (line) => {
    const sensorValue = line.trim();
    if (!/^[0-9]+$/.test(sensorValue)) return; // Ignore non-numeric data

    console.log(`Received fill level: ${sensorValue}%`);

    const { error: updateError } = await supabase
      .from('devices')
      .update({ 
        fill_level: Number(sensorValue), 
        status: 'online',
        updated_at: new Date().toISOString() 
      })
      .eq('device_id', deviceId); // Use device_id (UUID) for matching

    if (updateError) {
      console.error('Supabase update error:', updateError.message);
    } else {
      console.log(`Successfully updated device ${deviceId}.`);
      // Check if a notification should be sent
      checkAndSendNotification(deviceId, Number(sensorValue));
    }
  });

  port.on('error', (err) => {
    console.error('Serial port error:', err.message);
    if (port && port.isOpen) port.close();
    setTimeout(getSettingsAndConnect, 5000);
  });

  port.on('close', () => {
    console.log('Serial port disconnected. Attempting to reconnect...');
    port = null;
    setTimeout(getSettingsAndConnect, 5000);
  });
}

async function checkAndSendNotification(deviceId, currentFillLevel) {
  const NOTIFICATION_THRESHOLD = 90;

  // Initialize tracker for the device if it doesn't exist
  if (lastNotifiedFillLevel[deviceId] === undefined) {
    lastNotifiedFillLevel[deviceId] = 0;
  }

  // Condition to send notification: fill level crosses threshold upwards
  if (currentFillLevel >= NOTIFICATION_THRESHOLD && lastNotifiedFillLevel[deviceId] < NOTIFICATION_THRESHOLD) {
    console.log(`Device ${deviceId} crossed threshold. Sending notification...`);

    // 1. Get device details
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('name')
      .eq('device_id', deviceId)
      .single();

    if (deviceError || !device) {
      console.error('Could not fetch device details for notification.');
      return;
    }

    // 2. Get all users
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id');

    if (userError || !users || users.length === 0) {
      console.error('Could not fetch users or no users found.');
      return;
    }

    // 3. Create a notification for each user
    const notifications = users.map(user => ({
      user_id: user.id,
      device_id: deviceId,
      type: 'alert',
      title: 'Dustbin Almost Full',
      message: `Device "${device.name}" has reached ${currentFillLevel}% capacity. Please schedule a pickup.`,
    }));

    const { error: insertError } = await supabase.from('notifications').insert(notifications);

    if (insertError) {
      console.error('Failed to create notifications:', insertError.message);
    } else {
      console.log(`Successfully created ${notifications.length} notifications for all users.`);
    }
  }

  // Update the last known fill level for this device
  lastNotifiedFillLevel[deviceId] = currentFillLevel;
}

// Start the application
getSettingsAndConnect();
