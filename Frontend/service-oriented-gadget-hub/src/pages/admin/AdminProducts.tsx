import React, { useEffect, useState } from 'react';
import { getProducts, Product } from '../../services/api';
import { productService } from '../../services/productService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent } from '../../components/Card';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // ✅ Form state matches Product interface exactly
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Failed to delete product", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // ✅ Update
        const updated = await productService.updateProduct(editingProduct.id, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p)),
        );
      } else {
        // ✅ Add (FULL Product shape)
        const created = await productService.createProduct(formData);
        console.log("Product created", created);
        setProducts((prev) => [...prev, created]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: '',
      imageUrl: '',
    });
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Product Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className='w-4 h-4 mr-2' /> Add Product
        </Button>
      </div>

      {/* Product Table */}
      <div className='bg-white dark:bg-slate-900 rounded-xl shadow border overflow-hidden'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-slate-50 dark:bg-slate-800 text-slate-500'>
            <tr>
              <th className='px-6 py-4'>Product</th>
              <th className='px-6 py-4'>Category</th>
              <th className='px-6 py-4'>Price</th>
              <th className='px-6 py-4'>Stock</th>
              <th className='px-6 py-4 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {products.map((product) => (
              <tr key={product.id} className='hover:bg-slate-50'>
                <td className='px-6 py-4 flex items-center gap-3'>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className='w-10 h-10 rounded-lg object-cover'
                  />
                  <span className='font-medium'>{product.name}</span>
                </td>
                <td className='px-6 py-4'>{product.category}</td>
                <td className='px-6 py-4 font-medium'>${product.price}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stockQuantity > 5
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stockQuantity}
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <Card className='w-full max-w-lg'>
            <div className='p-6 border-b flex justify-between items-center'>
              <h2 className='text-xl font-bold'>
                {editingProduct ? 'Edit Product' : 'Add Product'}
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

                <Input
                  label='Description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Price'
                    type='number'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                  <Input
                    label='Stock'
                    type='number'
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: Number(e.target.value),
                      })
                    }
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
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
