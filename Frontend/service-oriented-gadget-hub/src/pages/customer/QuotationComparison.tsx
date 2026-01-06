import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/Card';
import {
  Table,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { quotationService, Quotation } from '../../services/quotationService';
import { orderService } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* =========================
   STATUS NORMALIZATION
   ========================= */
const normalizeQuotationStatus = (
  status: unknown
): 'Pending' | 'Approved' | 'Rejected' | 'ConvertedToOrder' => {
  if (typeof status === 'string') return status as any;

  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'Approved';
    case 2:
      return 'Rejected';
    case 3:
      return 'ConvertedToOrder';
    default:
      return 'Pending';
  }
};

const getStatusColor = (status: unknown) => {
  const normalized = normalizeQuotationStatus(status).toLowerCase();

  switch (normalized) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'convertedtoorder':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
  }
};

const getStatusIcon = (status: unknown) => {
  const normalized = normalizeQuotationStatus(status);

  switch (normalized) {
    case 'Approved':
      return <CheckCircle className="w-4 h-4 mr-1" />;
    case 'Rejected':
      return <XCircle className="w-4 h-4 mr-1" />;
    case 'ConvertedToOrder':
      return <FileText className="w-4 h-4 mr-1" />;
    default:
      return <Clock className="w-4 h-4 mr-1" />;
  }
};

/* =========================
   PDF EXPORT
   ========================= */
const exportQuotationsToPDF = (quotations: Quotation[]) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('My Quotations Report', 14, 15);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

  const tableData = quotations.map((q, index) => {
    const status = normalizeQuotationStatus(q.status);

    return [
      index + 1,
      q.id || q.quotationId,
      q.distributorName || 'Pending',
      status,
      q.totalAmount
        ? `$${q.totalAmount.toLocaleString()}`
        : q.finalPrice
        ? `$${q.finalPrice.toLocaleString()}`
        : '-',
      new Date(q.requestedDate).toLocaleDateString(),
    ];
  });

  autoTable(doc, {
    startY: 28,
    head: [
      [
        '#',
        'Quotation ID',
        'Distributor',
        'Status',
        'Total Amount',
        'Requested Date',
      ],
    ],
    body: tableData.map(row => row.map(cell => cell ?? '')),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  doc.save(`my-quotations-${Date.now()}.pdf`);
};

/* =========================
   COMPONENT
   ========================= */
export const QuotationComparison: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const data = await quotationService.getMyQuotations();
      setQuotations(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (quotationId: number) => {
    if (!window.confirm('Proceed to place order for this quotation?')) return;

    try {
      await orderService.checkoutOrder(quotationId);
      showAlert('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error: any) {
      console.error('Checkout failed', error);
      showAlert(error.response?.data?.message || 'Checkout failed', 'error');
    }
  };
const formatDate = (dateValue?: string) => {
  if (!dateValue) return '-';

  const date = new Date(dateValue);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString();
};

  if (loading) return <div className="p-8 text-center">Loading quotations...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Quotations</h1>
        <Button
          variant="outline"
          onClick={() => exportQuotationsToPDF(quotations)}
        >
          <Table className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {quotations.length === 0 && (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="text-slate-500">No quotation requests found.</p>
        </div>
      )}

      {quotations.map((quote) => {
        const statusText = normalizeQuotationStatus(quote.status);

        return (
          <Card key={quote.id || quote.quotationId} className="overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle>
                      Quotation #{quote.id || quote.quotationId}
                    </CardTitle>
                    
                  </div>
                </div>

                <div
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    quote.status
                  )}`}
                >
                  {getStatusIcon(quote.status)}
                  {statusText}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">
                    Distributor
                  </h4>
                  <p className="font-medium">
                    {quote.distributorName || 'Pending Assignment'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">
                    Total Amount
                  </h4>
                  <p className="font-medium text-lg">
                    {quote.totalAmount
                      ? `$${quote.totalAmount.toLocaleString()}`
                      : quote.finalPrice
                      ? `$${quote.finalPrice.toLocaleString()}`
                      : '-'}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  {statusText === 'Approved' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleCheckout(
                          (quote.id || quote.quotationId)!
                        )
                      }
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  )}

                  {statusText === 'ConvertedToOrder' && (
                    <span className="text-sm text-green-600 font-medium">
                      Order placed successfully
                    </span>
                  )}

                  {statusText === 'Pending' && (
                    <span className="text-sm text-slate-400 italic">
                      Waiting for distributor response...
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
