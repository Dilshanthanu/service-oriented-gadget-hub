import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, User, Role } from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent } from '../../components/Card';
import { UserPlus, Shield, Trash2, RefreshCw, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StaffManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // In real app, might auto-generate or send invite
        role: 'distributor' as Role
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newUser = await createUser({
                ...formData,
                username: formData.email.split('@')[0],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
            });
            setUsers(prev => [...prev, newUser]);
            closeModal();
        } catch (error) {
            alert('Failed to create user');
        }
    };

    const handleDelete = async (userId: string) => {
        if (userId === currentUser?.id) {
            alert("You cannot delete yourself.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'distributor' });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Staff Management</h1>
                    <p className="text-slate-500">Manage system administrators and distributors.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Add Staff
                </Button>
            </div>

            <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input
                    className="bg-transparent border-none focus:outline-none w-full text-sm"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                                    <span className="font-medium">{u.name}</span>
                                    {u.id === currentUser?.id && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 capitalize">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30'
                                            : u.role === 'distributor'
                                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button size="sm" variant="ghost" title="Reset Password" onClick={() => alert('Password reset link sent (Mock)')}>
                                        <RefreshCw className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDelete(u.id)}
                                        disabled={u.id === currentUser?.id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-slide-up">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add New Staff</h2>
                            <button onClick={closeModal}><X className="w-5 h-5" /></button>
                        </div>
                        <CardContent className="p-6">
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Role Assignment</label>
                                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                                            className={`flex-1 text-sm py-1.5 rounded-md transition-all ${formData.role === 'admin'
                                                    ? 'bg-white dark:bg-slate-700 shadow font-semibold'
                                                    : 'text-slate-500'
                                                }`}
                                        >
                                            Admin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'distributor' })}
                                            className={`flex-1 text-sm py-1.5 rounded-md transition-all ${formData.role === 'distributor'
                                                    ? 'bg-white dark:bg-slate-700 shadow font-semibold'
                                                    : 'text-slate-500'
                                                }`}
                                        >
                                            Distributor
                                        </button>
                                    </div>
                                </div>

                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Initial Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                                    <Button type="submit">Create Account</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
