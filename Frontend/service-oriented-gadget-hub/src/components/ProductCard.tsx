import React from 'react';
import { Product } from '../services/api';
import { Card, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className='overflow-hidden group flex flex-col h-full hover:shadow-xl transition-shadow duration-300'>
      <div className='relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img
          src={product.image}
          alt={product.name}
          className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2'>
          <Link to={`/products/${product.id}`}>
            <Button size='sm' variant='secondary' className='rounded-full'>
              <Eye className='w-4 h-4 mr-1' /> View
            </Button>
          </Link>
          <Button
            size='sm'
            variant='primary'
            className='rounded-full'
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className='w-4 h-4 mr-1' /> Add
          </Button>
        </div>
      </div>
      <CardContent className='p-4 flex-1'>
        <div className='text-xs text-slate-500 mb-1'>{product.category}</div>
        <Link to={`/products/${product.id}`}>
          <h3 className='font-semibold text-lg text-slate-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'>
            {product.name}
          </h3>
        </Link>
        <div className='mt-2 flex items-center justify-between'>
          <p className='text-xl font-bold text-primary-600'>${product.price.toLocaleString()}</p>
          <p className='text-sm text-slate-500'>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
