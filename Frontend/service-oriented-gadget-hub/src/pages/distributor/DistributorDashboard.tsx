import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quotationService, Quotation } from '../../services/quotationService';

/* ===========================
   Status enum (FE only)
=========================== */
enum QuotationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  ConvertedToOrder = 3,
}


const getStatusLabel = (status: number) => {
  switch (status) {
    case QuotationStatus.Pending:
      return 'Pending';
    case QuotationStatus.Approved:
      return 'Approved';
    case QuotationStatus.Rejected:
      return 'Rejected';
    case QuotationStatus.ConvertedToOrder:
      return 'Converted To Order';
    default:
      return 'Unknown';
  }
};



export const DistributorDashboard: React.FC = () => {
  const [requests, setRequests] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await quotationService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load pending requests', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-8 animate-fade-in'>
      <h1 className='text-3xl font-bold'>Distributor Portal</h1>

      {/* ===========================
          Stats Cards
      ============================ */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Pending Requests</p>
              <h3 className='text-2xl font-bold mt-1'>
                {requests.filter(r => r.status === 'Pending').length}
              </h3>
            </div>
            <div className='p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30'>
              <Clock className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Responded</p>
              <h3 className='text-2xl font-bold mt-1'>
                {requests.filter(r => r.status === 'Responded').length}
              </h3>
            </div>
            <div className='p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30'>
              <MessageSquare className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Accepted</p>
              <h3 className='text-2xl font-bold mt-1'>
                {requests.filter(r => r.status === 'Accepted').length}
              </h3>
            </div>
            <div className='p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30'>
              <CheckCircle className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===========================
          FULL DETAILS TABLE
      ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Requests (Full Details)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='bg-slate-50 dark:bg-slate-800 text-slate-500 border-b'>
                    <th className='px-4 py-3'>ID</th>
                    <th className='px-4 py-3'>Customer ID</th>
                    <th className='px-4 py-3'>Distributor ID</th>
                    <th className='px-4 py-3'>Expiry Date</th>
                    <th className='px-4 py-3'>Status</th>
                    <th className='px-4 py-3'>Grand Total</th>
                    <th className='px-4 py-3'>Items</th>
                    <th className='px-4 py-3'>Action</th>
                  </tr>
                </thead>

                <tbody className='divide-y'>
                  {requests.map(req => (
                    <tr key={req.id} className='align-top'>
                      <td className='px-4 py-3 font-medium'>#{req.id}</td>
                      <td className='px-4 py-3'>{req.customerId}</td>
                      <td className='px-4 py-3'>{req.distributorId}</td>
                      <td className='px-4 py-3'>
                        {new Date(req.expiryDate || Date.now()).toLocaleString()}
                      </td>
                      <td className='px-4 py-3'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === 'Pending'
                              ? 'bg-orange-100 text-orange-700'
                              : req.status === 'Responded'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {getStatusLabel(req.status as any)}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        LKR {(req.grandTotal ?? 0).toFixed(2)}
                      </td>

                      {/* Items */}
                      <td className='px-4 py-3'>
                        <div className='space-y-1'>
                          {req.items.map(item => (
                            <div
                              key={item.id}
                              className='text-xs border rounded p-2 bg-slate-50'
                            >
                              <div>Product ID: {item.productId}</div>
                              <div>Qty: {item.quantity}</div>
                              <div>
                                Unit Price: LKR {item.offeredUnitPrice}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className='px-4 py-3'>
                        {req.status === 'Pending' && (
                          <Link
                            to={`/distributor/respond/${req.id}`}
                            state={{ quotation: req }}
                          >
                            <Button size='sm'>Respond</Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}

                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={8} className='text-center py-6 text-gray-500'>
                        No quotation requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
