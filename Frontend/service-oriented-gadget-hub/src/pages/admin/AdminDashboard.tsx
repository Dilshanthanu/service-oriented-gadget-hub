import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Package, ShoppingBag, Users, TrendingUp, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Total Orders',
      value: '356',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Products',
      value: '45',
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Customers',
      value: '1,200',
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className='space-y-8 animate-fade-in'>
      <h1 className='text-3xl font-bold'>Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className='p-6 flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-500'>{stat.title}</p>
                <h3 className='text-2xl font-bold mt-1'>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Mockup */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold'>
                      JD
                    </div>
                    <div>
                      <p className='font-semibold'>John Doe</p>
                      <p className='text-xs text-slate-500'>iPhone 14 Pro Max</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold'>$1,200</p>
                    <span className='text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full'>
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='flex items-center gap-4 p-4 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg'
                >
                  <AlertCircle className='w-5 h-5 text-red-500' />
                  <div>
                    <p className='font-semibold text-red-700 dark:text-red-400'>MacBook Air M2</p>
                    <p className='text-xs text-red-600/80'>Only 2 items remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
