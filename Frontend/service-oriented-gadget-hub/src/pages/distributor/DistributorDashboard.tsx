import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockRequests = [
  {
    id: 1,
    product: 'iPhone 14 Pro Max',
    quantity: 50,
    requester: 'GadgetHub Stock',
    status: 'Pending',
    date: '2023-10-05',
  },
  {
    id: 2,
    product: 'MacBook Air M2',
    quantity: 10,
    requester: 'GadgetHub Stock',
    status: 'Responded',
    date: '2023-10-04',
  },
];

export const DistributorDashboard: React.FC = () => {
  return (
    <div className='space-y-8 animate-fade-in'>
      <h1 className='text-3xl font-bold'>Distributor Portal</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Pending Requests</p>
              <h3 className='text-2xl font-bold mt-1'>12</h3>
            </div>
            <div className='p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30'>
              <Clock className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Responded</p>
              <h3 className='text-2xl font-bold mt-1'>45</h3>
            </div>
            <div className='p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30'>
              <MessageSquare className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Accepted Quotes</p>
              <h3 className='text-2xl font-bold mt-1'>8</h3>
            </div>
            <div className='p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30'>
              <CheckCircle className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-800'>
                  <th className='px-6 py-3 font-medium'>Request ID</th>
                  <th className='px-6 py-3 font-medium'>Product</th>
                  <th className='px-6 py-3 font-medium'>Quantity</th>
                  <th className='px-6 py-3 font-medium'>Date</th>
                  <th className='px-6 py-3 font-medium'>Status</th>
                  <th className='px-6 py-3 font-medium'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                {mockRequests.map((req) => (
                  <tr key={req.id} className='hover:bg-slate-50 dark:hover:bg-slate-800/50'>
                    <td className='px-6 py-4 font-medium'>#{req.id}</td>
                    <td className='px-6 py-4'>{req.product}</td>
                    <td className='px-6 py-4'>{req.quantity}</td>
                    <td className='px-6 py-4'>{req.date}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === 'Pending'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      {req.status === 'Pending' && (
                        <Link to={`/distributor/respond/${req.id}`}>
                          <Button size='sm'>Respond</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
