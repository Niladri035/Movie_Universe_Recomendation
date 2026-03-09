import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return null; // Or a loading spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  return isAuthenticated && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};
