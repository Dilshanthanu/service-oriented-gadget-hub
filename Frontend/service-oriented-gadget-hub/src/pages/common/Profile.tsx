import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { User as UserIcon, Mail, Shield, Save } from 'lucide-react';
import { updateUser } from '../../services/api';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await updateUser(user.id, formData);
        alert('Profile updated successfully (Mock)');
        setIsEditing(false);
      } catch (error) {
        alert('Failed to update profile');
      }
    }
  };

  if (!user) return null;

  return (
    <div className='max-w-2xl mx-auto space-y-6 animate-fade-in'>
      <h1 className='text-3xl font-bold'>My Profile</h1>

      <Card>
        <CardHeader className='flex flex-row items-center gap-4 border-b border-slate-200 dark:border-slate-800'>
          <div className='w-20 h-20 rounded-full bg-slate-200 overflow-hidden'>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
            ) : null}
          </div>
          <div>
            <h2 className='text-2xl font-bold'>{user.name}</h2>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 capitalize'>
              {user.role}
            </span>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-slate-500'>Full Name</label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <div className='flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
                    <UserIcon className='w-4 h-4 text-slate-400' />
                    <span className='font-medium'>{user.name}</span>
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-slate-500'>Email Address</label>
                <div className='flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg opacity-75'>
                  <Mail className='w-4 h-4 text-slate-400' />
                  <span className='font-medium'>{user.email}</span>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-slate-500'>Username</label>
                <div className='flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg opacity-75'>
                  <Shield className='w-4 h-4 text-slate-400' />
                  <span className='font-medium'>{user.username || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className='pt-4 flex justify-end'>
              {isEditing ? (
                <div className='flex gap-2'>
                  <Button type='button' variant='ghost' onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>
                    <Save className='w-4 h-4 mr-2' /> Save Changes
                  </Button>
                </div>
              ) : (
                <Button type='button' onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
