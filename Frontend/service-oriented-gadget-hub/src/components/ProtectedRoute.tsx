import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../services/api';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role') as Role | null;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <div className='w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const effectiveRole = user?.role ?? storedRole;

  if (!effectiveRole) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};
