import React, { useState, useEffect } from 'react';
import { getProducts, Product } from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent } from '../../components/Card';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
  });

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)),
      );
    } else {
      // Add
      const newProduct = {
        id: Date.now(),
        ...formData,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: 0, stock: 0, category: '', image: '' });
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Product Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className='w-4 h-4 mr-2' /> Add Product
        </Button>
      </div>

      <div className='bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-slate-50 dark:bg-slate-800 text-slate-500'>
            <tr>
              <th className='px-6 py-4 font-medium'>Product</th>
              <th className='px-6 py-4 font-medium'>Category</th>
              <th className='px-6 py-4 font-medium'>Price</th>
              <th className='px-6 py-4 font-medium'>Stock</th>
              <th className='px-6 py-4 font-medium text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
            {products.map((product) => (
              <tr key={product.id} className='hover:bg-slate-50 dark:hover:bg-slate-800/50'>
                <td className='px-6 py-4 flex items-center gap-3'>
                  <img src={product.image} alt='' className='w-10 h-10 rounded-lg object-cover' />
                  <span className='font-medium'>{product.name}</span>
                </td>
                <td className='px-6 py-4 text-slate-500'>{product.category}</td>
                <td className='px-6 py-4 font-medium'>${product.price}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className='px-6 py-4 text-right space-x-2'>
                  <Button size='sm' variant='ghost' onClick={() => handleEdit(product)}>
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-red-500 hover:bg-red-50'
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <Card className='w-full max-w-lg animate-slide-up'>
            <div className='p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center'>
              <h2 className='text-xl font-bold'>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal}>
                <X className='w-5 h-5' />
              </button>
            </div>
            <CardContent className='p-6'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <Input
                  label='Name'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Price'
                    type='number'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                  <Input
                    label='Stock'
                    type='number'
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    required
                  />
                </div>
                <Input
                  label='Category'
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
                <Input
                  label='Image URL'
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder='https://...'
                  required
                />
                <div className='pt-4 flex justify-end gap-2'>
                  <Button type='button' variant='ghost' onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type='submit'>{editingProduct ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
