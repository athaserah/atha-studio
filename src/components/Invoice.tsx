import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImage from '@/assets/atha-studio-logo.png';
import { toast } from 'sonner';

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
    budget_range?: string;
    message?: string | null;
    status?: string;
    total_amount?: number | null;
    deposit_amount?: number | null;
    payment_status?: string | null;
    notes?: string | null;
    created_at?: string;
  };
}

export const Invoice: React.FC<InvoiceProps> = ({ booking }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    setIsGeneratingPDF(true);
    toast.loading('Membuat PDF...', { id: 'pdf-generation' });
    
    try {
      // Hide buttons before capturing
      const buttons = invoiceRef.current.parentElement?.querySelector('.print\\:hidden');
      if (buttons) {
        (buttons as HTMLElement).style.display = 'none';
      }

      // Scroll to top of invoice to ensure full capture
      const dialogContent = invoiceRef.current.closest('.overflow-y-auto');
      if (dialogContent) {
        dialogContent.scrollTop = 0;
      }

      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // Adjust scale based on device
      const scale = isMobile() ? 1.5 : 2;
      
      // Capture the invoice content
      const canvas = await html2canvas(invoiceRef.current, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: invoiceRef.current.scrollWidth,
        windowHeight: invoiceRef.current.scrollHeight,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      // Handle multi-page if content is too long
      const pageHeight = 297; // A4 height in mm
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Generate filename
      const invoiceNumber = `INV-${new Date(booking.created_at || Date.now()).toISOString().slice(0, 10).replace(/-/g, '')}-${booking.id.slice(0, 8).toUpperCase()}`;
      const filename = `${invoiceNumber}_${booking.customer_name.replace(/\s+/g, '_')}.pdf`;
      
      // For mobile, try to use share API if available
      if (isMobile() && navigator.share && navigator.canShare) {
        try {
          const pdfBlob = pdf.output('blob');
          const file = new File([pdfBlob], filename, { type: 'application/pdf' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Invoice',
              text: `Invoice untuk ${booking.customer_name}`
            });
            toast.success('PDF berhasil dibuat!', { id: 'pdf-generation' });
          } else {
            // Fallback to download
            pdf.save(filename);
            toast.success('PDF berhasil didownload!', { id: 'pdf-generation' });
          }
        } catch (shareError) {
          console.log('Share failed, falling back to download:', shareError);
          pdf.save(filename);
          toast.success('PDF berhasil didownload!', { id: 'pdf-generation' });
        }
      } else {
        // Download PDF for desktop
        pdf.save(filename);
        toast.success('PDF berhasil didownload!', { id: 'pdf-generation' });
      }

      // Show buttons again
      if (buttons) {
        (buttons as HTMLElement).style.display = '';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF. Silakan coba lagi.', { id: 'pdf-generation' });
    } finally {
      setIsGeneratingPDF(false);
    }
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

  // Generate invoice number from booking ID and date
  const invoiceNumber = `INV-${new Date(booking.created_at || Date.now()).toISOString().slice(0, 10).replace(/-/g, '')}-${booking.id.slice(0, 8).toUpperCase()}`;
  
  const remainingPayment = (booking.total_amount || 0) - (booking.deposit_amount || 0);
  const isDepositPaid = booking.payment_status === 'dp_paid' || booking.payment_status === 'paid';
  const isFullyPaid = booking.payment_status === 'paid';

  return (
    <div className="space-y-6">
      {/* Print Buttons - Hidden when printing */}
      <div className="flex flex-col sm:flex-row gap-2 print:hidden">
        <Button 
          onClick={handleDownloadPDF} 
          className="flex-1 w-full"
          disabled={isGeneratingPDF}
        >
          {isMobile() && navigator.share ? (
            <Share2 className="h-4 w-4 mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isGeneratingPDF ? 'Membuat PDF...' : isMobile() && navigator.share ? 'Share PDF' : 'Download PDF'}
        </Button>
        <Button 
          onClick={handlePrint} 
          variant="outline"
          className="flex-1 w-full" 
          disabled={isGeneratingPDF}
        >
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
      </div>

      {/* Invoice Content - Optimized for printing */}
      <div ref={invoiceRef} className="bg-white text-black p-8 rounded-lg border-2 border-gray-300 print:border-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
          <div className="flex items-start gap-4">
            <img src={logoImage} alt="Atha Studio Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ATHA STUDIO</h1>
              <p className="text-sm text-gray-600 mt-1">Professional Photography Services</p>
              <p className="text-sm text-gray-600">Email: athadiary21@gmail.com</p>
              <p className="text-sm text-gray-600">Phone: +62 822 4159 0417</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Invoice #:</span> {invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date:</span> {formatDate(booking.created_at)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Status:</span>{' '}
              <span className={`font-semibold ${isFullyPaid ? 'text-green-600' : isDepositPaid ? 'text-blue-600' : 'text-yellow-600'}`}>
                {isFullyPaid ? 'LUNAS' : isDepositPaid ? 'DP SUDAH DIBAYAR' : 'BELUM BAYAR'}
              </span>
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Kepada:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold text-gray-900">{booking.customer_name}</p>
            <p className="text-sm text-gray-600">{booking.customer_email}</p>
            <p className="text-sm text-gray-600">{booking.customer_phone}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Detail Layanan:</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold text-gray-900">Deskripsi</th>
                <th className="text-right p-3 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3">
                  <p className="font-semibold text-gray-900">{booking.service_type}</p>
                  <p className="text-sm text-gray-600">Paket: {booking.package_type}</p>
                  {booking.event_date && (
                    <p className="text-sm text-gray-600">Tanggal Acara: {formatDate(booking.event_date)}</p>
                  )}
                  {booking.event_location && (
                    <p className="text-sm text-gray-600">Lokasi: {booking.event_location}</p>
                  )}
                  {booking.budget_range && (
                    <p className="text-sm text-gray-600">Budget: {booking.budget_range}</p>
                  )}
                </td>
                <td className="p-3 text-right font-semibold text-gray-900">
                  {formatCurrency(booking.total_amount)}
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
                <span className="font-semibold text-gray-900">{formatCurrency(booking.total_amount)}</span>
              </div>
              
              {booking.deposit_amount && booking.deposit_amount > 0 && (
                <>
                  <div className={`flex justify-between items-center ${isDepositPaid ? 'text-green-600' : 'text-gray-600'}`}>
                    <span>Deposit {isDepositPaid && '✓'}:</span>
                    <span className="font-semibold">- {formatCurrency(booking.deposit_amount)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Sisa Pembayaran:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(remainingPayment)}</span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(booking.total_amount)}</span>
                </div>
              </div>

              {isFullyPaid && (
                <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded text-center">
                  <p className="text-green-800 font-bold text-lg">✓ LUNAS</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Informasi Pembayaran:</h3>
          <div className="bg-gray-50 p-4 rounded space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Bank:</span> Bank BCA
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Nama Rekening:</span> Atha Rasyid Risqi
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Nomor Rekening:</span> 1880678805
            </p>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Catatan:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">{booking.notes}</p>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Syarat & Ketentuan:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>1. Pembayaran dilakukan sebelum tanggal jatuh tempo.</p>
            <p>2. Deposit tidak dapat dikembalikan (non-refundable).</p>
            <p>3. Pelunasan harus dilakukan sebelum pengiriman hasil akhir.</p>
            <p>4. Keterlambatan pembayaran dapat dikenakan biaya tambahan.</p>
            <p>5. Sertakan bukti transfer sebagai bukti pembayaran.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 text-center">
          <p className="text-sm text-gray-600">Terima kasih atas kepercayaan Anda!</p>
          <p className="text-xs text-gray-500 mt-2">
            Invoice ini dihasilkan secara otomatis oleh Atha Studio dan tidak memerlukan tanda tangan.
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
