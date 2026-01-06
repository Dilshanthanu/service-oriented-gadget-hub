import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Send } from 'lucide-react';
import { quotationService } from '../../services/quotationService';
import { productService } from '../../services/productService';
import { Product } from '../../services/api';

export const QuotationRequest: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      productService.getProductById(productId).then(setProduct);
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      await quotationService.createQuotation({
        productId: product.id,
        quantity,
        notes
      });

      showAlert('Quotation requested successfully!', 'success');
      navigate('/quotations');
    } catch (error: any) {
      console.error(error);
      showAlert(error.response?.data?.message || 'Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-10 text-center">Loading product...</div>;

  return (
    <div className='max-w-2xl mx-auto animate-slide-up'>
      <Card>
        <CardHeader>
          <CardTitle>Request a Quotation</CardTitle>
          <p className='text-slate-500'>Get the best prices from distributors.</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <Input label='Product' value={product.name} disabled />

            <Input
              label='Quantity Required'
              type='number'
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Additional Notes</label>
              <textarea
                className='w-full min-h-[100px] rounded-xl border p-3'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              <Send className='w-4 h-4 mr-2' />
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
