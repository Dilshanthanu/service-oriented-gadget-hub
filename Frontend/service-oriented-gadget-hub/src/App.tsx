import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

import { ProductList } from './pages/customer/ProductList';
import { ProductDetails } from './pages/customer/ProductDetails';
import { Cart } from './pages/customer/Cart';
import { QuotationRequest } from './pages/customer/QuotationRequest';
import { QuotationComparison } from './pages/customer/QuotationComparison';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { StaffManagement } from './pages/admin/StaffManagement';
import { Profile } from './pages/common/Profile';
import { Settings } from './pages/common/Settings';
import { DistributorDashboard } from './pages/distributor/DistributorDashboard';
import { DistributorResponse } from './pages/distributor/DistributorResponse';
const NotFound = () => <div className="text-center py-20"><h1 className="text-4xl font-bold">404</h1><p>Page not found</p></div>;
const Unauthorized = () => <div className="text-center py-20"><h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1></div>;

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/request-quote" element={<QuotationRequest />} />
          <Route path="/quotations" element={<QuotationComparison />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
        </Route>

        {/* Protected Distributor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['distributor']} />}>
          <Route path="/distributor" element={<DistributorDashboard />} />
          <Route path="/distributor/respond/:id" element={<DistributorResponse />} />
        </Route>

        {/* Common Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
