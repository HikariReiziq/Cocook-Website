# 🍳 Cocook — Smart Kitchen Management App
> **Vibe Coding Week Project** — Solving Real Problems with MERN Stack.

![Cocook Banner](https://via.placeholder.com/1000x300?text=Cocook:+Manage+Kitchen,+Reduce+Waste,+Cook+Better)
*(Ganti link gambar di atas dengan screenshot aplikasi kamu nanti)*

---

## 📖 Tentang Project (Assignment Breakdown)
Project ini dikerjakan untuk memenuhi tugas **Vibe Coding Week** mata kuliah Pemrograman Web. Fokus utama dari tugas ini adalah **"Solve a Real Problem"**, di mana aplikasi tidak hanya sekadar latihan CRUD, tetapi memberikan solusi nyata bagi pengguna.

### 📋 Syarat & Ketentuan Tugas:
Sesuai dengan panduan Vibe Coding Week, aplikasi ini memenuhi kriteria berikut:
- **Tema:** *Problem Solving* di lingkungan sekitar (Rumah Tangga & Mahasiswa).
- **Tech Stack Wajib:** MERN (MongoDB, Express.js, React.js, Node.js).
- **Fitur Minimum MVP:**
  - ✅ **Authentication:** Register & Login menggunakan JWT & Bcrypt.
  - ✅ **CRUD Data Utama:** Manajemen Inventaris Bahan Makanan.
  - ✅ **Upload File:** Upload foto bahan makanan/struk belanja.
  - ✅ **Frontend:** Minimal 3 halaman (Login, Dashboard, Form).
  - ✅ **Responsif:** Mobile & Desktop Friendly.

---

## 💡 Inovasi: Cocook (Dapur Pintar)
**Cocook** adalah adaptasi web dari konsep aplikasi manajemen dapur untuk membantu mahasiswa (anak kos) dan ibu rumah tangga dalam mengelola stok dapur mereka.

### 1. Latar Belakang Masalah (Problem Statement)
- **Food Waste:** Banyak bahan makanan terbuang sia-sia karena pemilik lupa tanggal kadaluarsa atau tertimbun di belakang kulkas. Data menunjukkan timbulan sampah rumah tangga bisa mencapai jutaan ton per tahun.
- **Kebingungan Masak:** Masalah klasik *"Hari ini masak apa?"* sering terjadi padahal stok bahan tersedia, namun pengguna bingung mengombinasikannya.
- **Inefisiensi Belanja:** Belanja impulsif sering terjadi karena tidak adanya pencatatan stok yang akurat, merugikan secara finansial terutama bagi mahasiswa.

### 2. Solusi yang Ditawarkan
Cocook hadir sebagai **Asisten Dapur Digital** berbasis web yang memiliki fitur:
- **Inventory Tracker:** Mencatat stok bahan masuk, jumlah, dan tanggal kadaluarsa.
- **Expiration Alert:** Indikator visual (warna) untuk bahan yang hampir busuk.
- **Smart Recipe Ideas:** (Fitur pengembangan) Memberikan saran masakan berdasarkan bahan yang *available* di inventaris.

### 3. Target Pengguna
- **Mahasiswa/Anak Kos (e.g., Raka):** Sering lupa stok, budget terbatas, butuh manajemen simpel.
- **Ibu Rumah Tangga (e.g., Ibu Lestari):** Mengelola stok dapur keluarga besar, butuh efisiensi agar tidak ada bahan terbuang.

---

## 🛠️ Tech Stack & Tools
Aplikasi ini dibangun menggunakan **MERN Stack** modern dengan styling menggunakan **Tailwind CSS** untuk mempercepat pengembangan (Vibe Coding style).

### **Frontend (Client-Side)**
- **Framework:** React.js (Vite) — *Cepat dan ringan.*
- **Styling:** Tailwind CSS + DaisyUI — *Untuk UI modern dan responsif tanpa coding CSS manual yang lama.*
- **State Management:** React Context API — *Untuk manajemen state user (Login/Logout).*
- **Routing:** React Router DOM — *Navigasi antar halaman.*
- **HTTP Client:** Axios — *Fetch data ke backend.*
- **Icons:** Lucide React / React Icons.
- **Notifications:** React Hot Toast / SweetAlert2.

### **Backend (Server-Side)**
- **Runtime:** Node.js.
- **Framework:** Express.js — *REST API Architecture.*
- **Database:** MongoDB Atlas (Cloud).
- **ODM:** Mongoose — *Schema modeling.*
- **Authentication:**
  - `jsonwebtoken` (JWT) — *Session token.*
  - `bcryptjs` — *Password hashing.*
- **File Handling:** Multer — *Upload gambar ke server.*
- **Security:** CORS.

### **Tools Lainnya**
- **Package Manager:** NPM / PNPM.
- **Version Control:** Git & Github.
- **API Testing:** Postman / Thunder Client.

---

## 🚀 Fitur Utama (MVP)
Aplikasi ini memiliki fitur-fitur "Minimum Viable Product" sebagai berikut:

1.  **Sistem Autentikasi**
    - User dapat mendaftar (Register) dan Masuk (Login).
    - Password dienkripsi demi keamanan.
    - Akses halaman diproteksi (Hanya user login yang bisa lihat dashboard).

2.  **Manajemen Inventaris (CRUD)**
    - **Create:** Input bahan makanan baru (Nama, Kategori, Jumlah, Expired Date, Foto).
    - **Read:** Melihat daftar bahan makanan dengan indikator warna (Merah = Segera Habiskan, Hijau = Aman).
    - **Update:** Mengedit jumlah stok atau detail bahan.
    - **Delete:** Menghapus bahan yang sudah habis atau busuk.

3.  **Upload Gambar**
    - Pengguna dapat mengunggah foto nota saat input data agar lebih mudah dikenali visualnya.

---

## 💻 Cara Menjalankan Project (Setup Instructions)

Ikuti langkah ini untuk menjalankan project di komputer lokal:

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/vibe-coding-pweb.git](https://github.com/username-kamu/vibe-coding-pweb.git)
cd vibe-coding-pweb