# 🍳 Cocook - Aplikasi Manajemen Dapur Cerdas

Aplikasi web manajemen dapur untuk mengurangi food waste dengan sistem inventaris, notifikasi kadaluarsa, dan rekomendasi resep.

## 🎯 Problem & Solution
- **Masalah**: Banyak makanan terbuang karena lupa expired dan bingung masak apa
- **Solusi**: Aplikasi web untuk mencatat stok, alert kadaluarsa, dan rekomendasi resep
- **Target**: Mahasiswa (anak kos) dan Ibu Rumah Tangga

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + Bcrypt
- Multer (file upload)

### Frontend  
- React.js (Vite)
- Tailwind CSS (Mobile First)
- React Context API
- Axios
- Lucide Icons

## 🚀 Quick Start

### Backend Setup
\`\`\`bash
cd server
npm install
# Edit .env dengan MongoDB connection string Anda
npm start
# Server running di http://localhost:5000
\`\`\`

### Frontend Setup
\`\`\`bash
cd client
npm install
npm run dev
# Frontend running di http://localhost:5173
\`\`\`

## 📝 Environment Variables

### Server (.env)
\`\`\`
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
\`\`\`

### Client (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🎯 Fitur Utama

### ✅ Sudah Selesai
- Authentication (Register/Login dengan JWT)
- Backend API lengkap (Auth, Inventory, Recipe, History)
- Frontend Setup (React + Vite + Tailwind)
- Layout & Navigation (Responsive)
- Dashboard dengan alert expired & low stock

### 🚧 In Progress
- Inventory CRUD Pages
- Recipe CRUD Pages
- Cooking Mode (Start CoCook)
- History Page

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile (Protected)

### Inventory
- `GET /api/inventory` - Get all items (Protected)
- `POST /api/inventory` - Create item (Protected)
- `PUT /api/inventory/:id` - Update item (Protected)
- `DELETE /api/inventory/:id` - Delete item (Protected)

### Recipe
- `GET /api/recipes` - Get all recipes (Protected)
- `POST /api/recipes` - Create recipe (Protected)
- `POST /api/recipes/:id/finish` - Finish cooking & reduce stock (Protected)

### History
- `GET /api/history` - Get activity logs (Protected)

## 🔑 Key Features

### Sistem Batch (FIFO)
Setiap input bahan = batch baru. Pengurangan stok prioritas expired terdekat.

### Konversi Satuan
- 1 sdm = 15 ml/gram
- 1 sdt = 5 ml/gram
- Auto convert saat "Selesai Masak"

### Pengurangan Stok
Stok berkurang HANYA saat klik "Selesai Masak" di akhir Cooking Mode.

## 📱 Responsive
- Mobile: Bottom navigation
- Desktop: Sidebar navigation
- Dark/Light mode

## 👤 Author
**HikariReiziq**
- GitHub: [@HikariReiziq](https://github.com/HikariReiziq)

## 📄 License
MIT

---

**Status Backend**: ✅ Running di http://localhost:5000  
**Status Frontend**: ✅ Running di http://localhost:5173
