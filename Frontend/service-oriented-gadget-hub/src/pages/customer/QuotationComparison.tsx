import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Table } from 'lucide-react';

// Mock data integration
import quotationData from '../../data/quotationSample.json';

interface QuotationResponse {
  distributor: string;
  unitPrice: number;
  stock: number;
  delivery: number;
}

interface Quotation {
  requestId: number;
  productName: string;
  quantity: number;
  responses: QuotationResponse[];
}

export const QuotationComparison: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuotations(quotationData as Quotation[]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className='p-8 text-center'>Loading quotations...</div>;

  return (
    <div className='max-w-6xl mx-auto space-y-8 animate-fade-in'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Quotation Requests</h1>
        <Button variant='outline'>
          <Table className='w-4 h-4 mr-2' /> Export PDF
        </Button>
      </div>

      {quotations.map((quote) => {
        // Find best price logic
        const bestPrice =
          quote.responses.length > 0 ? Math.min(...quote.responses.map((r) => r.unitPrice)) : 0;

        return (
          <Card key={quote.requestId} className='overflow-hidden'>
            <CardHeader className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
              <div className='flex justify-between items-center'>
                <div>
                  <CardTitle>{quote.productName}</CardTitle>
                  <p className='text-sm text-slate-500'>Requested Quantity: {quote.quantity}</p>
                </div>
                <div className='text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300'>
                  {quote.responses.length} Responses
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              {quote.responses.length === 0 ? (
                <div className='p-8 text-center text-slate-500'>No responses yet.</div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-sm'>
                    <thead>
                      <tr className='bg-slate-50 dark:bg-slate-800/30 text-slate-500 border-b border-slate-200 dark:border-slate-800'>
                        <th className='px-6 py-3 font-medium'>Distributor</th>
                        <th className='px-6 py-3 font-medium'>Unit Price</th>
                        <th className='px-6 py-3 font-medium'>Total Cost</th>
                        <th className='px-6 py-3 font-medium'>Stock</th>
                        <th className='px-6 py-3 font-medium'>Delivery (Days)</th>
                        <th className='px-6 py-3 font-medium'>Action</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                      {quote.responses.map((response, idx) => {
                        const isBestPrice = response.unitPrice === bestPrice;
                        return (
                          <tr
                            key={idx}
                            className={isBestPrice ? 'bg-green-50/50 dark:bg-green-900/10' : ''}
                          >
                            <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                              {response.distributor}
                              {isBestPrice && (
                                <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                                  Best Price
                                </span>
                              )}
                            </td>
                            <td
                              className={`px-6 py-4 ${isBestPrice ? 'font-bold text-green-600 dark:text-green-400' : ''}`}
                            >
                              ${response.unitPrice.toLocaleString()}
                            </td>
                            <td className='px-6 py-4 font-medium'>
                              ${(response.unitPrice * quote.quantity).toLocaleString()}
                            </td>
                            <td className='px-6 py-4'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  response.stock >= quote.quantity
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                }`}
                              >
                                {response.stock} Available
                              </span>
                            </td>
                            <td className='px-6 py-4'>{response.delivery} Days</td>
                            <td className='px-6 py-4'>
                              <Button size='sm' variant={isBestPrice ? 'primary' : 'secondary'}>
                                Accept
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
