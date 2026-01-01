import React, { useEffect, useState } from 'react';
import { getProducts, Product } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';
import { Input } from '../../components/Input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../../components/Button';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='relative rounded-3xl overflow-hidden bg-primary-900 text-white shadow-2xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-600'></div>
        <div className='relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='space-y-4 max-w-lg'>
            <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
              Next Gen <span className='text-primary-300'>Gadgets</span> <br /> Available Now
            </h1>
            <p className='text-primary-100 text-lg'>
              Upgrade your life with the latest tech from top brands. Lowest prices guaranteed.
            </p>
            <Button size='lg' className='bg-white text-primary-900 hover:bg-primary-50'>
              Shop Now
            </Button>
          </div>
          {/* Decorative Circle */}
          <div className='hidden md:block w-64 h-64 bg-primary-500/20 rounded-full blur-3xl absolute -right-12 -bottom-12'></div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className='flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-30 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800'>
        <div className='relative w-full md:w-96'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
          <Input
            placeholder='Search gadgets...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse'
            ></div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className='text-center py-20'>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-white'>
            No products found
          </h3>
          <p className='text-slate-500'>Try adjusting your search or category.</p>
        </div>
      )}
    </div>
  );
};
