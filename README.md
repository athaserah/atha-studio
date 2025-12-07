# Atha Studio

![Version](https://img.shields.io/badge/version-1.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Status](https://img.shields.io/badge/status-active-success.svg)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Atha Studio adalah aplikasi web modern untuk studio fotografi yang dibangun menggunakan React, TypeScript, dan Vite. Aplikasi ini menyediakan fitur lengkap mulai dari portofolio galeri, pemesanan paket (Wisuda, Pernikahan), kalkulator harga, blog, hingga panel administrasi untuk pengelolaan konten.

## 🚀 Fitur Utama

* **Galeri Foto:** Tampilan portofolio yang responsif dan interaktif.
* **Pemesanan & Paket:** Halaman khusus untuk berbagai paket layanan (Wedding, Wisuda).
* **Kalkulator Harga:** Fitur estimasi harga untuk layanan kustom.
* **Blog:** Bagian artikel dan berita terbaru.
* **Admin Panel:** Dashboard terproteksi untuk mengelola konten website.
* **Otentikasi:** Sistem login aman menggunakan Supabase Auth.
* **PWA Support:** Dapat diinstal sebagai Progressive Web App.
* **Desain Responsif:** Tampilan optimal di desktop dan mobile.

## 🛠 Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi terkini (Modern Stack):

* **Core:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
* **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) (berbasis Radix UI), [Lucide React](https://lucide.dev/) (Ikon)
* **State Management & Data Fetching:** [TanStack Query](https://tanstack.com/query)
* **Backend & Database:** [Supabase](https://supabase.com/)
* **Form & Validasi:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Charts:** [Recharts](https://recharts.org/)
* **Utilities:** `date-fns`, `sonner` (Toast notifications), `react-easy-crop`.

## ⚙️ Persyaratan Sistem

Sebelum memulai, pastikan Anda telah menginstal:

* [Node.js](https://nodejs.org/) (Versi LTS disarankan)
* npm (biasanya terinstal bersama Node.js) atau bun/yarn

## 📦 Cara Instalasi

1.  **Clone repositori ini**
    ```bash
    git clone [https://github.com/username-anda/atha-studio.git](https://github.com/username-anda/atha-studio.git)
    cd atha-studio
    ```

2.  **Instal dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables**
    Buat file `.env` di root proyek dan tambahkan konfigurasi Supabase Anda (lihat panduan di bawah).

4.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:8080` (atau port yang tersedia).

## 🔐 Konfigurasi Lingkungan (.env)

Aplikasi ini memerlukan koneksi ke Supabase. Buat file bernama `.env` di direktori root proyek dan isi dengan kredensial berikut:

```env
VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
VITE_SUPABASE_URL="[https://your-project-id.supabase.co](https://your-project-id.supabase.co)"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
````

> **Catatan:** Pastikan untuk tidak mengunggah file `.env` yang berisi kunci rahasia ke repositori publik. Gunakan `.env.example` sebagai referensi jika berkolaborasi dalam tim.

## 📜 Skrip Tersedia

Dalam direktori proyek, Anda dapat menjalankan perintah berikut:

  * `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
  * `npm run build`: Membangun aplikasi untuk produksi ke folder `dist`.
  * `npm run preview`: Meninjau hasil build produksi secara lokal.
  * `npm run lint`: Menjalankan ESLint untuk memeriksa masalah kode.

## 📱 Struktur Proyek

Struktur folder utama proyek:

```
src/
├── components/     # Komponen UI yang dapat digunakan kembali (Shadcn, dll)
├── hooks/          # Custom React Hooks (useAuth, usePhotos, dll)
├── integrations/   # Konfigurasi layanan pihak ketiga (Supabase)
├── pages/          # Halaman-halaman aplikasi (Home, Gallery, Admin, dll)
├── types/          # Definisi tipe TypeScript
├── utils/          # Fungsi utilitas
└── App.tsx         # Komponen utama dan konfigurasi Routing
```

## 📄 Lisensi

![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🧑‍💻 Creator

#### Atha Diary
#### My Portfolio : https://athadiary.my.id
