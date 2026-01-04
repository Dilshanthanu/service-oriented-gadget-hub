import React, { useState, useEffect } from 'react';
import { productService, ProductPayload } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { Product } from '../services/api';

const ProductManager: React.FC = () => {
  const { user } = useAuth();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productIdToFetch, setProductIdToFetch] = useState<string>('1'); // Default to ID 1 for demo
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use user.role from context
  const userRole = user?.role || null;
  // No local state for userRole needed

  // New product form state
  const [newProduct, setNewProduct] = useState<ProductPayload>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    // Initial fetch
    fetchProduct(productIdToFetch);
  }, []); // Only fetch on mount, role is reactive via context

  const fetchProduct = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const product = await productService.getProductById(id);
      setCurrentProduct(product);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch product. It may not exist.');
      setCurrentProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    setError(null);
    
    // Frontend Role Check (Double protection)
    if (userRole?.toLowerCase() !== 'admin') {
      setError('Access denied: Admins only');
      return;
    }

    setLoading(true);
    try {
      await productService.createProduct(newProduct);
      alert('Product created successfully!');
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
        imageUrl: ''
      });
    } catch (err: any) {

      console.error("Create Product Failed:", err);
      // Log full response details for debugging
      if (err.response) {
          console.error("Response Data:", err.response.data);
          console.error("Response Status:", err.response.status);
          console.error("Response Headers:", err.response.headers);
      }
      setError(err.response?.data?.message || 'Failed to create product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setError(null);

    // Frontend Role Check
    if (userRole?.toLowerCase() !== 'admin') {
      setError('Access denied: Admins only');
      return;
    }

    setLoading(true);
    try {
      await productService.deleteProduct(id);
      alert('Product deleted successfully');
      setCurrentProduct(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Product Manager</h1>
      
      {userRole && <p className="text-sm text-gray-500">Logged in as: <span className="font-semibold">{userRole}</span></p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* View Section */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">View Product</h2>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={productIdToFetch} 
            onChange={(e) => setProductIdToFetch(e.target.value)} 
            placeholder="Enter Product ID"
            className="border p-2 rounded w-full"
          />
          <button 
            onClick={() => fetchProduct(productIdToFetch)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>

        {currentProduct ? (
          <div className="bg-white p-4 border rounded shadow-sm">
             <h3 className="text-lg font-bold">{currentProduct.name}</h3>
             <p className="text-gray-600">{currentProduct.description}</p>
             <p className="font-semibold mt-2">Price: ${currentProduct.price}</p>
             <p className="text-sm text-gray-500">Stock: {currentProduct.stockQuantity}</p>
             {userRole?.toLowerCase() === 'admin' && (
               <button 
                 onClick={() => handleDeleteProduct(currentProduct.id)}
                 className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
               >
                 Delete Product
               </button>
             )}
          </div>
        ) : (
          !loading && <p className="text-gray-500">No product to display.</p>
        )}
      </div>

      {/* Admin Only Create Section */}
      {userRole?.toLowerCase() === 'admin' && (
        <div className="border p-4 rounded-lg bg-gray-50 mt-6">
          <h2 className="text-xl font-semibold mb-3">Create New Product (Admin)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Name" value={newProduct.name} onChange={handleChange} className="border p-2 rounded" />
            <input name="category" placeholder="Category" value={newProduct.category} onChange={handleChange} className="border p-2 rounded" />
            <input name="price" type="number" placeholder="Price" value={newProduct.price} onChange={handleChange} className="border p-2 rounded" />
            <input name="stockQuantity" type="number" placeholder="Stock" value={newProduct.stockQuantity} onChange={handleChange} className="border p-2 rounded" />
            <input name="imageUrl" placeholder="Image URL" value={newProduct.imageUrl} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
          </div>
          <button 
            onClick={handleCreateProduct}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      )}
      
      {userRole?.toLowerCase() !== 'admin' && userRole && (
         <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded">
            <p>You are logged in as <strong>{userRole}</strong>. Admin actions (Create/Delete) are hidden/disabled.</p>
         </div>
      )}
    </div>
  );
};

export default ProductManager;
