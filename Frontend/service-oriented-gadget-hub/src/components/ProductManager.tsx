import React, { useState, useEffect } from 'react';
import { productService, ProductPayload } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Product } from '../services/api';

const ProductManager: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const userRole = user?.role || null;

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productIdToFetch, setProductIdToFetch] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<ProductPayload, 'distributorId'>>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProduct(productIdToFetch);
  }, []);

  const fetchProduct = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const product = await productService.getProductById(id);
      setCurrentProduct(product);
    } catch {
      setError('Failed to fetch product');
      setCurrentProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!user || userRole?.toLowerCase() !== 'admin') {
      setError('Access denied: Admins only');
      return;
    }

    setLoading(true);
    try {
      const payload: ProductPayload = {
        ...newProduct,
        distributorId: user.id, // ✅ PASS LOGGED IN USER ID
      };

      await productService.createProduct(payload);
      showAlert('Product created successfully', 'success');

      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
        imageUrl: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value,
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Product Manager</h1>

      {error && <div className="bg-red-100 p-3 text-red-700">{error}</div>}

      {userRole === 'admin' && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Create Product</h2>

          <div className="grid grid-cols-2 gap-4">
            <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" />
            <input name="category" placeholder="Category" onChange={handleChange} className="border p-2" />
            <input name="price" type="number" placeholder="Price" onChange={handleChange} className="border p-2" />
            <input name="stockQuantity" type="number" placeholder="Stock" onChange={handleChange} className="border p-2" />
            <input name="imageUrl" placeholder="Image URL" onChange={handleChange} className="border p-2 col-span-2" />
            <input name="description" placeholder="Description" onChange={handleChange} className="border p-2 col-span-2" />
          </div>

          <button
            onClick={handleCreateProduct}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
          >
            Create Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
