import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, Product } from '../../services/api';
import { Button } from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, Zap } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProductById(Number(id));
        setProduct(data || null);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className='p-10 text-center'>Loading...</div>;
  if (!product) return <div className='p-10 text-center'>Product not found</div>;

  return (
    <div className='max-w-6xl mx-auto animate-fade-in'>
      <Button
        variant='ghost'
        className='mb-6 pl-0 hover:bg-transparent hover:text-primary-600'
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className='w-4 h-4 mr-2' /> Back to Products
      </Button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Image Section */}
        <div className='aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl'>
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
          />
        </div>

        {/* Info Section */}
        <div className='space-y-8'>
          <div>
            <span className='text-sm font-semibold text-primary-600 tracking-wider uppercase'>
              {product.category}
            </span>
            <h1 className='text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4'>
              {product.name}
            </h1>
            <p className='text-3xl font-bold text-primary-600'>${product.price.toLocaleString()}</p>
          </div>

          <div className='prose dark:prose-invert text-slate-600 dark:text-slate-300'>
            <p>
              Experience the future with the {product.name}. Featuring state-of-the-art technology,
              premium build quality, and exceptional performance. Limited stock available.
            </p>
          </div>

          <div className='flex gap-4'>
            <Button size='lg' className='flex-1 text-lg' onClick={() => addToCart(product)}>
              <ShoppingCart className='w-5 h-5 mr-2' /> Add to Cart
            </Button>
            <Link to='/request-quote' className='flex-1'>
              <Button size='lg' variant='secondary' className='w-full'>
                Request Quotation
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-2 gap-4 pt-8 border-t border-slate-200 dark:border-slate-800'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400'>
                <Truck className='w-5 h-5' />
              </div>
              <div>
                <h4 className='font-semibold text-sm'>Free Delivery</h4>
                <p className='text-xs text-slate-500'>On orders over $500</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400'>
                <ShieldCheck className='w-5 h-5' />
              </div>
              <div>
                <h4 className='font-semibold text-sm'>2 Year Warranty</h4>
                <p className='text-xs text-slate-500'>Full coverage</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400'>
                <Zap className='w-5 h-5' />
              </div>
              <div>
                <h4 className='font-semibold text-sm'>Fast Dispatch</h4>
                <p className='text-xs text-slate-500'>Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
