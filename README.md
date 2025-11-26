# 🍳 Cocook — Smart Kitchen Management System

| Nama                         | NRP        |
| ---------------------------- | ---------- |
| M. Hikari Reiziq Rakhmadinta | 5027241079 |


![Banner](/Assets/Home.png)

**Cocook** adalah aplikasi berbasis web yang dirancang untuk membantu manajemen dapur rumah tangga dan anak kos. Aplikasi ini berfokus pada penyelesaian masalah nyata (*problem solving*) seperti pemborosan makanan (*food waste*), manajemen stok bahan, dan kebingungan dalam menentukan menu masakan.

---

## 📖 Latar Belakang

Di tengah kesibukan harian, banyak orang—terutama mahasiswa dan ibu rumah tangga—sering melupakan bahan makanan yang tersimpan di kulkas hingga membusuk. Masalah ini diperparah dengan kebiasaan belanja impulsif tanpa mengetahui stok yang sebenarnya, serta dilema klasik *"Hari ini masak apa?"* padahal bahan tersedia.

Berdasarkan riset, jutaan ton sampah rumah tangga dihasilkan setiap tahunnya, sebagian besar berasal dari sisa makanan. **Cocook** hadir sebagai solusi digital untuk mencatat inventaris, memberikan peringatan dini kadaluarsa, dan mengintegrasikan stok bahan dengan rekomendasi resep.

## 🎯 Tujuan

1.  **Mengurangi Food Waste:** Mencegah bahan makanan terbuang sia-sia dengan sistem pelacakan kadaluarsa (FIFO/Batch System).
2.  **Efisiensi Ekonomi:** Membantu pengguna berbelanja dengan bijak dengan memantau stok yang menipis.
3.  **Manajemen Dapur Terpusat:** Menggabungkan pencatatan inventaris dan panduan memasak dalam satu platform.
4.  **Edukasi & Komunitas:** Menyediakan wadah berbagi resep yang terhubung langsung dengan ketersediaan bahan pengguna.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan **MERN Stack** dengan pendekatan *Vibe Coding* (modern, cepat, dan efisien):

### Frontend
-   **React.js (Vite):** Framework UI yang cepat dan reaktif.
-   **Tailwind CSS:** Styling utility-first untuk desain yang responsif (*Mobile First*).
-   **React Context API:** Manajemen state global (Auth & Theme).
-   **Axios:** HTTP Client untuk komunikasi dengan API.
-   **Lucide React:** Ikon antarmuka yang modern.

### Backend
-   **Node.js & Express.js:** Server-side runtime dan framework REST API.
-   **MongoDB Atlas & Mongoose:** Database NoSQL untuk penyimpanan data yang fleksibel.
-   **JWT (JSON Web Token):** Autentikasi pengguna yang aman.
-   **BcryptJS:** Hashing password.
-   **Multer:** Middleware untuk menangani upload file gambar.

---

## 📸 Dokumentasi & Fitur Aplikasi

Berikut adalah penjelasan alur dan fitur utama aplikasi Cocook:

### 1. Autentikasi Pengguna
![Halaman Login](/Assets/Login.png)
Halaman masuk yang aman. Pengguna baru dapat mendaftar akun untuk mulai mengelola dapur mereka sendiri. Data pengguna dilindungi dengan enkripsi password standar industri.

### 2. Dashboard Utama
![Dashboard](/Assets/Home.png)
Pusat informasi dapur Anda.
* **Alert Cards:** Menampilkan jumlah bahan yang *Akan Kadaluarsa*, *Stok Menipis*, dan *Sudah Kadaluarsa*.
* **Segera Kadaluarsa:** List prioritas bahan yang harus segera diolah (H-7).
* **Aktivitas Terbaru:** Log singkat kegiatan terakhir pengguna.

### 3. Manajemen Inventaris (Inventory)
![Inventory](/Assets/Inventory.png)
Fitur inti aplikasi untuk mencatat bahan makanan.
* **Kartu Bahan:** Menampilkan foto, nama, varian, sisa stok, dan status kadaluarsa (indikator warna).
* **Filtering:** Filter berdasarkan kategori (Sayur, Protein, Bumbu, dll) dan urutan kadaluarsa terdekat.
* **Sistem Batch:** Input bahan yang sama dengan tanggal beli berbeda akan dicatat terpisah untuk akurasi *First-In-First-Out* (FIFO).

### 4. Katalog Resep
![Recipe](/Assets/Recipe.png)
Kumpulan inspirasi masakan.
* **Daftar Resep:** Menampilkan resep pribadi dan komunitas lengkap dengan estimasi waktu masak dan jumlah bahan.
* **Detail Resep:** Informasi langkah memasak dan bahan yang dibutuhkan.

### 5. Menambahkan Resep Baru
![Tambah Resep](/Assets/Tambahkan%20resep%20ke%20komunitas.png)
Pengguna dapat berkontribusi dengan menambahkan resep mereka sendiri.
* **Form Dinamis:** Input judul, deskripsi, foto, bahan-bahan, dan langkah memasak.
* **Integrasi Unit:** Satuan bahan disesuaikan dengan standar sistem (gram, sdm, pcs, dll).

### 6. Mode Memasak (Cooking Mode)
![Start Cook](/Assets/Start%20Cook.png)
Fitur unggulan **"Start CoCook"**.
* **Panduan Langkah:** Menampilkan instruksi memasak langkah demi langkah agar pengguna fokus.
* **Otomatisasi Stok:** Saat tombol "Selesai" ditekan, sistem secara cerdas mengurangi stok di inventaris berdasarkan bahan yang digunakan dalam resep tersebut.

### 7. Riwayat Aktivitas (History)
![History](/Assets/History.png)
Audit trail untuk memantau kegiatan dapur.
* Mencatat setiap aksi: *Create* (Tambah bahan), *Update* (Edit stok), *Delete* (Buang bahan), dan *Cook* (Masak).
* Membantu pengguna mengevaluasi pola konsumsi dan pemborosan mereka.

### 8. Profil Pengguna
![Profile](/Assets/Profile.png)
Pengaturan personalisasi akun, termasuk mengubah foto profil dan informasi pekerjaan.

---

## 💾 Database Structure

Aplikasi menggunakan MongoDB dengan skema relasional yang terstruktur:

* **Users:** Menyimpan data akun.
![MongoDB User](/Assets/MongoDB_User.png)

* **Inventories:** Menyimpan data stok bahan per user.
![MongoDB Inventory](/Assets/MongoDB_Inventory.png)

---

## 🚀 Harapan Pengembangan (Future Work)

Untuk pengembangan selanjutnya, aplikasi ini diharapkan dapat memiliki fitur:
1.  **AI Integration:** Menggunakan Gemini/OpenAI untuk menyarankan resep unik berdasarkan sisa bahan yang "tanggung".
2.  **Barcode Scanner:** Memindai barcode produk kemasan untuk input inventaris otomatis.
3.  **Push Notification:** Notifikasi *real-time* ke HP pengguna saat bahan H-1 kadaluarsa.
4.  **Shopping List Generator:** Otomatis membuat daftar belanja saat stok menyentuh batas minimum.

---

## 💻 Cara Menjalankan (Local Setup)

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/cocook-website.git](https://github.com/username/cocook-website.git)
    cd cocook-website
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Buat file .env dan isi: PORT, MONGODB_URI, JWT_SECRET
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Akses Aplikasi**
    Buka browser dan kunjungi `http://localhost:5173`.

---

**Dibuat oleh:** Hikari Reiziq (Mahasiswa IT)
*Project Vibe Coding Week - Pemrograman Web*