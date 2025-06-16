import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    // While the session is loading, don't render anything.
    // You could render a loading spinner here for better UX.
    return null; 
  }

  if (!session) {
    // If authentication is finished and there's no session, redirect to login.
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, we need to check it.
  if (requiredRole) {
    // If the profile is still loading, wait.
    if (!profile) {
      return null; // Or a loading spinner
    }
    // If the profile is loaded and the role does not match, redirect.
    if (profile.role !== requiredRole) {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  // If all checks pass, render the requested component.
  return <>{children}</>;
};