import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/api';
import { Card, CardContent } from '../../components/Card';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div className='space-y-6 animate-fade-in'>
      <h1 className='text-3xl font-bold'>All Orders</h1>

      <div className='space-y-4'>
        {orders.map((order) => (
          <Card
            key={order.orderId}
            className='flex flex-col md:flex-row gap-4 p-6 items-start md:items-center justify-between'
          >
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <span className='font-bold text-lg'>#{order.orderId}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    order.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className='text-sm text-slate-500'>Customer: {order.customerName}</p>
              <p className='text-sm text-slate-500'>Date: {order.date}</p>
            </div>

            <div className='flex-1 md:px-8'>
              <p className='font-semibold'>{order.product}</p>
              <p className='text-sm text-slate-500'>Quantity: {order.quantity}</p>
            </div>

            <div className='text-right'>
              <p className='text-xl font-bold'>${order.price * order.quantity}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
