import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, DistributorRegisterPayload, AdminRegisterPayload } from '../services/authService';

const AdminUserManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'distributor' | 'admin'>('distributor');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [distributorForm, setDistributorForm] = useState<DistributorRegisterPayload>({
    fullName: '',
    email: '',
    password: '',
    companyName: ''
  });

  const [adminForm, setAdminForm] = useState<AdminRegisterPayload>({
    userName: '',
    email: '',
    password: ''
  });

  // Role Protection
  if (!user || user.role?.toLowerCase() !== 'admin') {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to view this page. Admins only.</p>
      </div>
    );
  }

  const handleDistributorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.registerDistributor(distributorForm);
      setSuccess(`Distributor ${distributorForm.companyName} registered successfully!`);
      setDistributorForm({ fullName: '', email: '', password: '', companyName: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register distributor.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.registerAdmin(adminForm);
      setSuccess(`Admin ${adminForm.userName} created successfully!`);
      setAdminForm({ userName: '', email: '', password: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDistributorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistributorForm({ ...distributorForm, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'distributor' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('distributor'); setSuccess(null); setError(null); }}
        >
          Register Distributor
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'admin' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('admin'); setSuccess(null); setError(null); }}
        >
          Create Admin
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Distributor Form */}
      {activeTab === 'distributor' && (
        <form onSubmit={handleDistributorSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                name="companyName"
                value={distributorForm.companyName}
                onChange={handleDistributorChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Gadgets Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person (Full Name)</label>
              <input
                name="fullName"
                value={distributorForm.fullName}
                onChange={handleDistributorChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={distributorForm.email}
                onChange={handleDistributorChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={distributorForm.password}
                onChange={handleDistributorChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
          >
            {loading ? 'Registering...' : 'Register Distributor'}
          </button>
        </form>
      )}

      {/* Admin Form */}
      {activeTab === 'admin' && (
        <form onSubmit={handleAdminSubmit} className="space-y-4">
           <div className="alert alert-warning bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-sm text-yellow-800">
              <span className="font-bold">Warning:</span> You are creating a user with full administrative privileges.
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                name="userName"
                value={adminForm.userName}
                onChange={handleAdminChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="admin_user"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={adminForm.email}
                onChange={handleAdminChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={adminForm.password}
                onChange={handleAdminChange}
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminUserManagement;
