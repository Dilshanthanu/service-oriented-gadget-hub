import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Send, ArrowLeft } from 'lucide-react';
import { quotationService, Quotation } from '../../services/quotationService';

export const DistributorResponse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  // productId -> negotiated price
  const [prices, setPrices] = useState<Record<number, number>>({});

  useEffect(() => {
    if (location.state?.quotation) {
      const q: Quotation = location.state.quotation;
      setQuotation(q);

      // Pre-fill prices using offeredUnitPrice
      const initialPrices: Record<number, number> = {};
      q.items.forEach(item => {
        initialPrices[item.productId] = item.offeredUnitPrice ?? 0;
      });
      setPrices(initialPrices);
    } else {
      showAlert('Quotation data missing. Redirecting...', 'warning');
      navigate('/distributor');
    }
  }, [location.state, navigate]);

  const handlePriceChange = (productId: number, value: string) => {
    setPrices(prev => ({
      ...prev,
      [productId]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotation || !id) return;

    setLoading(true);
    try {
      const negotiatedItems = quotation.items.map(item => ({
        productId: item.productId,
        negotiatedPrice: prices[item.productId],
      }));

      await quotationService.approveQuotation(id, negotiatedItems);

      showAlert('Quotation approved successfully!', 'success');
      navigate('/distributor');
    } catch (error: any) {
      console.error('Failed to approve quotation', error);
      showAlert(error.response?.data?.message || 'Failed to approve quotation', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!quotation) return <div>Loading...</div>;

  // Calculate total
  const totalValue = quotation.items.reduce((sum, item) => {
    const price = prices[item.productId] || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className='max-w-3xl mx-auto space-y-6 animate-slide-up'>
      <Button variant='ghost' className='pl-0' onClick={() => navigate(-1)}>
        <ArrowLeft className='w-4 h-4 mr-2' /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>Submit Quotation Response</CardTitle>
              <p className='text-slate-500'>Request #{quotation.id}</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-slate-500'>
                Expiry Date:{' '}
                {new Date(quotation.expiryDate || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Products */}
            <div className='space-y-4'>
              <h3 className='font-semibold border-b pb-2'>Quotation Items</h3>

              {quotation.items.map(item => (
                <div
                  key={item.productId}
                  className='flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg'
                >
                  <div className='flex-1'>
                    <p className='font-medium'>
                      Product ID: {item.productId}
                    </p>
                    <p className='text-sm text-slate-500'>
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className='w-40'>
                    <Input
                      label='Unit Price'
                      type='number'
                      min='0'
                      step='0.01'
                      value={prices[item.productId] ?? ''}
                      onChange={e =>
                        handlePriceChange(item.productId, e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
              <div className='flex justify-between text-lg'>
                <span>Total Quotation Value:</span>
                <span className='font-bold text-blue-700 dark:text-blue-300'>
                  LKR {totalValue.toFixed(2)}
                </span>
              </div>
            </div>

            <Button type='submit' className='w-full' isLoading={loading}>
              <Send className='w-4 h-4 mr-2' />
              Approve & Send Quotation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
