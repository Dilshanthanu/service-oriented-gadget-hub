import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { orderService, Order } from '../../services/orderService';
import { useAlert } from '../../context/AlertContext';
import { Trash2, Edit2 } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, currentStatus: string) => {
    const newStatus = prompt(
      'Update Status (Pending, Processing, Shipped, Delivered)',
      currentStatus
    );
    if (!newStatus || newStatus === currentStatus) return;

    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      showAlert('Failed to update status', 'error');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderService.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      showAlert('Failed to delete order', 'error');
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Order Management</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <Card
            key={order.id}
            className="flex flex-col md:flex-row gap-4 p-6 items-start md:items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg">#{order.id}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-slate-500">
                Order Date:{' '}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>

              {order.fromQuotationId && (
                <p className="text-xs text-slate-400">
                  From Quotation #{order.fromQuotationId}
                </p>
              )}
            </div>

            <div className="text-right flex items-center gap-4">
              <p className="text-xl font-bold">
                ${order.totalAmount.toLocaleString()}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleStatusUpdate(order.id, order.status)
                  }
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(order.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {orders.length === 0 && (
          <p className="text-slate-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};
