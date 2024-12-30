import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import StoreLayout from './components/store/StoreLayout';

// Lazy load routes
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Store = React.lazy(() => import('./pages/Store'));
const Account = React.lazy(() => import('./pages/Account'));
const Themes = React.lazy(() => import('./pages/admin/Themes'));

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Store Routes */}
                  <Route element={<StoreLayout />}>
                    <Route path="/" element={<Store />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/themes" element={<Themes />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
            <Toaster position="top-right" />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}