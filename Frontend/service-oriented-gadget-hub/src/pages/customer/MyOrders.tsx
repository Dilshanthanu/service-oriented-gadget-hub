import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Card, CardContent } from '../../components/Card';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { orderService, Order } from '../../services/orderService';
import { Link } from 'react-router-dom';

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
      case 'Processing': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30';
      default: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'Shipped': return <Truck className="w-4 h-4 mr-1" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 mr-1" />;
      default: return <Clock className="w-4 h-4 mr-1" />;
    }
  };

  if (loading) return <div className='p-8 text-center'>Loading orders...</div>;

  return (
    <div className='max-w-6xl mx-auto space-y-8 animate-fade-in'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>My Orders</h1>
        <Link to="/products"><Button variant='outline'>Continue Shopping</Button></Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <Package className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold">No orders yet</h3>
          <p className="text-slate-500">Orders created from approved quotations will appear here.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <Card key={order.id} className='overflow-hidden'>
              <CardContent className='p-6'>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-slate-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Total Amount</p>
                      <p className="font-bold text-lg">${order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
