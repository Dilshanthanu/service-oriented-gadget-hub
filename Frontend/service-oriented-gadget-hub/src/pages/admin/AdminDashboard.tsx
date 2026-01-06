import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Package, ShoppingBag, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { orderService, Order } from '../../services/orderService';
import { getProducts, getUsers, Product, User } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersData, productsData, usersData] = await Promise.all([
        orderService.getAllOrders(),
        getProducts(),
        getUsers()
      ]);

      // Calculate Stats
      const totalRevenue = ordersData
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      
      const customerCount = usersData.filter(u => u.role === 'customer').length;

      setStats({
        revenue: totalRevenue,
        orders: ordersData.length,
        products: productsData.length,
        customers: customerCount
      });

      // Recent Orders (sort by date desc, take 5)
      const sortedOrders = [...ordersData].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 5);
      setRecentOrders(sortedOrders);

      // Low Stock (stock < 5)
      const lowStock = productsData.filter(p => p.stockQuantity < 5);
      setLowStockProducts(lowStock);

    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Total Orders',
      value: stats.orders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Products',
      value: stats.products.toString(),
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Customers',
      value: stats.customers.toString(),
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className='space-y-8 animate-fade-in'>
      <h1 className='text-3xl font-bold'>Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((stat) => (
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

      {/* Recent Activity & Alerts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentOrders.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No orders found.</p>
              ) : (
                recentOrders.map((order) => (
                    <div
                    key={order.orderId}
                    className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'
                    >
                    <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold'>
  #{order.id}
</div>

                        <div>
                        <p className='font-semibold'>{order.customerName}</p>
                        <p className='text-xs text-slate-500'>Order #{order.orderId}</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='font-bold'>${order.totalAmount.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                             order.status === 'Confirmed' || order.status === 'Delivered' 
                             ? 'text-green-600 bg-green-100' 
                             : 'text-blue-600 bg-blue-100'
                        }`}>
                        {order.status}
                        </span>
                    </div>
                    </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {lowStockProducts.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">All stock levels are healthy.</p>
              ) : (
                  lowStockProducts.map((product) => (
                    <div
                    key={product.id}
                    className='flex items-center gap-4 p-4 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg'
                    >
                    <AlertCircle className='w-5 h-5 text-red-500' />
                    <div>
                        <p className='font-semibold text-red-700 dark:text-red-400'>{product.name}</p>
                        <p className='text-xs text-red-600/80'>Only {product.stockQuantity} items remaining</p>
                    </div>
                    </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
