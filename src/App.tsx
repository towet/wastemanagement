import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BluetoothProvider } from './contexts/BluetoothContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { Notifications } from './pages/Notifications';
import { About } from './pages/About';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SettingsPage } from './pages/admin/SettingsPage';
import { NotificationsPage } from './pages/admin/NotificationsPage';

function App() {
  return (
    <AuthProvider>
      <BluetoothProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="about" element={<About />} />
              
              {/* Admin Routes */}
              <Route path="admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="admin/notifications" element={
                <ProtectedRoute requiredRole="admin">
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="admin/about" element={
                <ProtectedRoute requiredRole="admin">
                  <About />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </BluetoothProvider>
    </AuthProvider>
  );
}

export default App;