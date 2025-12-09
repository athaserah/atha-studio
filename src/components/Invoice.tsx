import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface InvoiceProps {
  booking: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_type: string;
    package_type: string;
    event_date?: string | null;
    event_location?: string | null;
    invoice_number?: string | null;
    total_price?: number | null;
    deposit_amount?: number | null;
    deposit_paid?: boolean;
    full_payment_paid?: boolean;
    payment_method?: string | null;
    invoice_date?: string | null;
    due_date?: string | null;
    admin_notes?: string | null;
  };
}

export const Invoice: React.FC<InvoiceProps> = ({ booking }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const remainingPayment = (booking.total_price || 0) - (booking.deposit_amount || 0);

  return (
    <div className="space-y-6">
      {/* Print Buttons - Hidden when printing */}
      <div className="flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="flex-1">
          <Printer className="h-4 w-4 mr-2" /> Print Invoice
        </Button>
        <Button variant="outline" onClick={handlePrint} className="flex-1">
          <Download className="h-4 w-4 mr-2" /> Save as PDF
        </Button>
      </div>

      {/* Invoice Content - Optimized for printing */}
      <div className="bg-white text-black p-8 rounded-lg border-2 border-gray-300 print:border-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ATHA STUDIO</h1>
            <p className="text-sm text-gray-600 mt-1">Photography & Web Development</p>
            <p className="text-sm text-gray-600">Yogyakarta, Indonesia</p>
            <p className="text-sm text-gray-600">Email: contact@athastudio.com</p>
            <p className="text-sm text-gray-600">Phone: +62 123 4567 890</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Invoice #:</span> {booking.invoice_number || '-'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date:</span> {formatDate(booking.invoice_date)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Due Date:</span> {formatDate(booking.due_date)}
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Bill To:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold text-gray-900">{booking.customer_name}</p>
            <p className="text-sm text-gray-600">{booking.customer_email}</p>
            <p className="text-sm text-gray-600">{booking.customer_phone}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Service Details:</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold text-gray-900">Description</th>
                <th className="text-right p-3 font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3">
                  <p className="font-semibold text-gray-900">{booking.service_type}</p>
                  <p className="text-sm text-gray-600">Package: {booking.package_type}</p>
                  {booking.event_date && (
                    <p className="text-sm text-gray-600">Event Date: {formatDate(booking.event_date)}</p>
                  )}
                  {booking.event_location && (
                    <p className="text-sm text-gray-600">Location: {booking.event_location}</p>
                  )}
                </td>
                <td className="p-3 text-right font-semibold text-gray-900">
                  {formatCurrency(booking.total_price)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Summary */}
        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(booking.total_price)}</span>
              </div>
              
              {booking.deposit_amount && booking.deposit_amount > 0 && (
                <>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Deposit Paid {booking.deposit_paid && '✓'}:</span>
                    <span className="font-semibold">- {formatCurrency(booking.deposit_amount)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Remaining Balance:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(remainingPayment)}</span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(booking.total_price)}</span>
                </div>
              </div>

              {booking.full_payment_paid && (
                <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded text-center">
                  <p className="text-green-800 font-bold text-lg">✓ PAID IN FULL</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {booking.payment_method && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Information:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Payment Method:</span> {booking.payment_method}
              </p>
            </div>
          </div>
        )}

        {/* Bank Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Bank Details:</h3>
          <div className="bg-gray-50 p-4 rounded space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Bank:</span> Bank BCA
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Account Name:</span> Atha Studio
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Account Number:</span> 1234567890
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Terms & Conditions:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>1. Payment must be made before the due date mentioned above.</p>
            <p>2. Deposit is non-refundable.</p>
            <p>3. Full payment must be completed before final delivery.</p>
            <p>4. Late payment may incur additional charges.</p>
            <p>5. Please include invoice number in payment reference.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 text-center">
          <p className="text-sm text-gray-600">Thank you for your business!</p>
          <p className="text-xs text-gray-500 mt-2">
            This is a computer-generated invoice and does not require a signature.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};
