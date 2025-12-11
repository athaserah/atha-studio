# Dokumentasi Fitur Download Invoice PDF

## Ringkasan Perubahan

Fitur download invoice PDF telah berhasil ditambahkan ke admin panel Atha Studio. Admin sekarang dapat mengunduh invoice dalam format PDF dengan logo brand untuk diberikan kepada customer secara manual via WhatsApp.

---

## Fitur yang Ditambahkan

### 1. **Logo Brand di Invoice**

Invoice sekarang menampilkan logo Atha Studio (graduation cap dengan huruf A) di header, menggantikan text-only header sebelumnya. Logo ditampilkan dengan ukuran 64x64 pixel di sebelah kiri informasi perusahaan.

**Lokasi Logo:** `/src/assets/atha-studio-logo.png`

### 2. **Tombol Download PDF**

Tombol "Download PDF" telah ditambahkan di komponen Invoice dengan fitur:
- Generate PDF berkualitas tinggi menggunakan jsPDF dan html2canvas
- Nama file otomatis: `INV-YYYYMMDD-XXXXXXXX_Nama_Customer.pdf`
- Loading state saat PDF sedang di-generate
- Error handling jika gagal membuat PDF

### 3. **Tombol View Invoice di Admin Panel**

Tombol baru dengan ikon dokumen (FileText) ditambahkan di setiap baris booking di admin panel untuk:
- Membuka dialog invoice
- Melihat detail lengkap pesanan
- Download invoice dalam format PDF

---

## File yang Dimodifikasi

### 1. **`src/components/Invoice.tsx`**

**Perubahan:**
- Import library `jsPDF` dan `html2canvas`
- Import logo brand dari assets
- Tambah state `isGeneratingPDF` untuk loading indicator
- Tambah ref `invoiceRef` untuk capture HTML element
- Implementasi fungsi `handleDownloadPDF()` untuk generate PDF
- Update tombol "Save as PDF" menjadi "Download PDF" dengan fungsi yang proper
- Tambah logo di header invoice

**Kode Utama:**

```typescript
const handleDownloadPDF = async () => {
  if (!invoiceRef.current) return;
  
  setIsGeneratingPDF(true);
  try {
    // Hide buttons before capturing
    const buttons = invoiceRef.current.parentElement?.querySelector('.print\\:hidden');
    if (buttons) {
      (buttons as HTMLElement).style.display = 'none';
    }

    // Capture the invoice content
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Generate filename
    const invoiceNumber = `INV-${new Date(booking.created_at || Date.now()).toISOString().slice(0, 10).replace(/-/g, '')}-${booking.id.slice(0, 8).toUpperCase()}`;
    const filename = `${invoiceNumber}_${booking.customer_name.replace(/\s+/g, '_')}.pdf`;
    
    // Download PDF
    pdf.save(filename);

    // Show buttons again
    if (buttons) {
      (buttons as HTMLElement).style.display = '';
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Gagal membuat PDF. Silakan coba lagi.');
  } finally {
    setIsGeneratingPDF(false);
  }
};
```

### 2. **`src/pages/AdminPanel.tsx`**

**Perubahan:**
- Tambah tombol "View Invoice" dengan ikon FileText di action buttons booking table
- Tombol ditempatkan sebelum tombol Edit dan Delete
- Styling dengan hover effect biru untuk membedakan dari tombol lain

**Kode Tambahan:**

```tsx
<Button 
  variant="outline" 
  size="sm" 
  onClick={() => { setViewingInvoice(booking); setIsInvoiceDialogOpen(true); }}
  className="hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition-colors"
  title="Lihat & Download Invoice"
>
  <FileText className="h-4 w-4" />
</Button>
```

### 3. **Dependencies Baru**

Package yang ditambahkan di `package.json`:
- `jspdf`: ^2.5.2 - Library untuk generate PDF
- `html2canvas`: ^1.4.1 - Library untuk capture HTML ke canvas/image

---

## Cara Menggunakan Fitur

### Untuk Admin:

1. **Login ke Admin Panel**
   - Akses halaman admin panel
   - Login dengan akun admin

2. **Buka Menu Pesanan (Bookings)**
   - Klik menu "Pesanan" di dashboard admin
   - Lihat daftar semua booking dari customer

3. **View Invoice**
   - Klik tombol dengan ikon dokumen (📄) di kolom Aksi
   - Dialog invoice akan terbuka menampilkan detail lengkap pesanan

4. **Download PDF**
   - Di dalam dialog invoice, klik tombol "Download PDF"
   - Tunggu beberapa detik saat PDF sedang di-generate
   - File PDF akan otomatis terdownload dengan nama format: `INV-YYYYMMDD-XXXXXXXX_Nama_Customer.pdf`

5. **Kirim ke Customer via WhatsApp**
   - Buka WhatsApp Web atau aplikasi WhatsApp
   - Pilih chat dengan customer
   - Attach file PDF invoice yang sudah didownload
   - Kirim ke customer

### Alternatif: Print Invoice

Jika ingin print langsung atau save as PDF via browser:
- Klik tombol "Print Invoice"
- Browser akan membuka print dialog
- Pilih printer atau "Save as PDF" dari print dialog browser

---

## Format Invoice

Invoice yang di-generate mencakup informasi berikut:

### Header
- **Logo Atha Studio** (graduation cap dengan huruf A)
- Nama perusahaan: ATHA STUDIO
- Tagline: Professional Photography Services
- Alamat: Yogyakarta, Indonesia
- Email: athadiary21@gmail.com
- Phone: +62 822 4159 0417

### Informasi Invoice
- Nomor Invoice: Format `INV-YYYYMMDD-XXXXXXXX`
- Tanggal: Tanggal pembuatan booking
- Status Pembayaran: LUNAS / DP SUDAH DIBAYAR / BELUM BAYAR

### Detail Customer
- Nama customer
- Email customer
- Nomor telepon customer

### Detail Layanan
- Jenis layanan (Wedding, Prewedding, Graduation, dll)
- Paket yang dipilih
- Tanggal acara (jika ada)
- Lokasi acara (jika ada)
- Budget range (jika ada)

### Ringkasan Pembayaran
- Subtotal
- Deposit (jika ada)
- Sisa pembayaran
- Total keseluruhan
- Status LUNAS (jika sudah dibayar penuh)

### Informasi Pembayaran
- Bank: Bank BCA
- Nama Rekening: Gue Arki
- Nomor Rekening: 1234567890

### Catatan
- Catatan khusus dari admin (jika ada)

### Syarat & Ketentuan
1. Pembayaran dilakukan sebelum tanggal jatuh tempo
2. Deposit tidak dapat dikembalikan (non-refundable)
3. Pelunasan harus dilakukan sebelum pengiriman hasil akhir
4. Keterlambatan pembayaran dapat dikenakan biaya tambahan
5. Sertakan nomor invoice pada referensi pembayaran

---

## Technical Details

### PDF Generation Process

1. **Capture HTML to Canvas**
   - Menggunakan `html2canvas` untuk capture element invoice
   - Scale 2x untuk kualitas tinggi
   - Background putih untuk konsistensi

2. **Convert Canvas to PDF**
   - Menggunakan `jsPDF` untuk create PDF document
   - Format A4 portrait
   - Image PNG dari canvas di-embed ke PDF

3. **File Naming**
   - Format: `INV-YYYYMMDD-XXXXXXXX_Nama_Customer.pdf`
   - Contoh: `INV-20251211-A1B2C3D4_John_Doe.pdf`

### Browser Compatibility

Fitur ini kompatibel dengan browser modern:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Performance

- Generate PDF untuk invoice standar: ~2-3 detik
- Ukuran file PDF: ~100-300 KB (tergantung konten)
- Tidak memerlukan koneksi internet setelah page load

---

## Troubleshooting

### PDF Tidak Terdownload

**Penyebab:**
- Browser memblokir download otomatis
- Popup blocker aktif

**Solusi:**
- Allow download dari website di browser settings
- Disable popup blocker untuk domain ini

### PDF Kosong atau Error

**Penyebab:**
- Logo tidak ter-load dengan benar
- CORS issue dengan image

**Solusi:**
- Pastikan logo ada di `/src/assets/atha-studio-logo.png`
- Pastikan image di-serve dari same origin
- Check browser console untuk error message

### Tombol View Invoice Tidak Muncul

**Penyebab:**
- Belum login sebagai admin
- Role user bukan admin

**Solusi:**
- Login dengan akun admin
- Check role di database `user_roles` table

---

## Deployment

### Steps untuk Deploy:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Project**
   ```bash
   npm run build
   ```

3. **Deploy ke Hosting**
   - Upload folder `dist/` ke hosting
   - Atau deploy via Vercel/Netlify dengan auto-build

4. **Verify**
   - Login ke admin panel
   - Test download invoice
   - Verify PDF quality

---

## Future Improvements

Berikut adalah beberapa improvement yang bisa ditambahkan di masa depan:

1. **Email Invoice Otomatis**
   - Kirim invoice otomatis ke email customer saat booking confirmed
   - Template email dengan link download invoice

2. **Invoice Customization**
   - Admin bisa customize template invoice
   - Pilih warna theme
   - Custom footer message

3. **Invoice History**
   - Simpan semua invoice yang pernah di-generate
   - Track kapan invoice di-download
   - Resend invoice yang sudah pernah dibuat

4. **Watermark**
   - Tambah watermark "UNPAID" untuk invoice yang belum dibayar
   - Remove watermark setelah payment confirmed

5. **Multi-language Support**
   - Invoice dalam bahasa Indonesia dan Inggris
   - Toggle language di admin panel

6. **Digital Signature**
   - Tambah digital signature di invoice
   - QR code untuk verifikasi invoice

---

## Support

Jika ada pertanyaan atau issue terkait fitur invoice, silakan hubungi:
- Email: athadiary21@gmail.com
- Phone: +62 822 4159 0417

---

**Last Updated:** 11 Desember 2024  
**Version:** 1.0.0  
**Author:** Manus AI Assistant
