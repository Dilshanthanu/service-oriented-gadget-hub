import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerCustomer } from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/Card';
import { UserPlus } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_ENDPOINTS } from '../../utils/urls';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fullName = `${firstName} ${lastName}`.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const body = {
        firstName: firstName,
        lastName: lastName,
        fullName: fullName,
        email: email,
        password: password,
      };
      const res = await axiosInstance.post(API_ENDPOINTS.CUSTOMER_REGISTER, body);

      await login({ email, password, role: 'customer' });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[80vh] px-4'>
      <Card className='w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 animate-slide-up'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>Create Customer Account</CardTitle>
          <p className='text-center text-sm text-slate-500 dark:text-slate-400'>
            Join Service Oriented Gadget Hub today
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='First Name'
              placeholder='John'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <Input
              label='Last Name'
              placeholder='Doe'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <Input label='Full Name' placeholder='John Doe' value={fullName} disabled />

            <Input
              label='Email'
              type='email'
              placeholder='name@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label='Password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className='text-sm text-red-500 text-center'>{error}</p>}

            <Button type='submit' className='w-full' isLoading={isLoading}>
              <UserPlus className='w-4 h-4 mr-2' />
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className='justify-center'>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Already have an account?{' '}
            <Link to='/login' className='text-primary-600 hover:underline dark:text-primary-400'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
