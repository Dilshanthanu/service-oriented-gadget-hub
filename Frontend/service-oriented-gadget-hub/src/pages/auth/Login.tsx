import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/Card';
import { LogIn } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const body = {
        email: email,
        password: password,
      };
      const res = await axiosInstance.post('/login', body);

      redirectUser(res.data.role);
      setRole(res.data.role as Role);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      redirectUser('customer');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (userRole: Role) => {
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'distributor') navigate('/distributor');
    else navigate('/');
  };

  return (
    <div className='flex items-center justify-center min-h-[80vh] px-4'>
      <Card className='w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 animate-slide-up'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Welcome back</CardTitle>
          <p className='text-center text-sm text-slate-500 dark:text-slate-400'>
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Email or Username'
              type='text'
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
              <LogIn className='w-4 h-4 mr-2' />
              Sign In
            </Button>

            {role === 'customer' && (
              <>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t border-slate-200 dark:border-slate-700' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white dark:bg-slate-900 px-2 text-slate-500'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className='w-4 h-4 mr-2' viewBox='0 0 24 24'>
                    <path
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      fill='#4285F4'
                    />
                    <path
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      fill='#34A853'
                    />
                    <path
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      fill='#FBBC05'
                    />
                    <path
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      fill='#EA4335'
                    />
                  </svg>
                  Google
                </Button>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className='justify-center'>
          {role === 'customer' ? (
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              Don't have an account?{' '}
              <Link
                to='/register'
                className='text-primary-600 hover:underline dark:text-primary-400'
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              Staff accounts are managed by Admin.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
