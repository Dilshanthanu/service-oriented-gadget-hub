import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Send } from 'lucide-react';

export const QuotationRequest: React.FC = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      navigate('/quotations');
    }, 1000);
  };

  return (
    <div className='max-w-2xl mx-auto animate-slide-up'>
      <Card>
        <CardHeader>
          <CardTitle>Request a Quotation</CardTitle>
          <p className='text-slate-500'>Get the best prices from our certified distributors.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <Input
              label='Product Name'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder='e.g. iPhone 14 Pro Max'
              required
            />

            <Input
              label='Quantity Required'
              type='number'
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                Additional Notes
              </label>
              <textarea
                className='w-full min-h-[100px] rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white'
                placeholder='Any specific requirements?'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type='submit' className='w-full'>
              <Send className='w-4 h-4 mr-2' /> Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
