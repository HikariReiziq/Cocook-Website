import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Kategori harus diisi'],
    enum: [
      'UTILITAS & DASAR',
      'BUMBU & REMPAH',
      'SAYURAN SEGAR',
      'BUAH-BUAHAN',
      'PROTEIN HEWANI',
      'BAHAN KERING (PANTRY)',
      'SAUS MINYAK & PENYEDAP',
      'DAIRY & OLAHAN',
      'BAHAN BAKING',
      'MINUMAN',
      'CONSUMABLES (NON-FOOD)'
    ]
  },
  ingredientName: {
    type: String,
    required: [true, 'Nama bahan harus diisi'],
    trim: true
  },
  variant: {
    type: String,
    default: null,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Kuantitas harus diisi'],
    min: [0, 'Kuantitas tidak boleh negatif']
  },
  unit: {
    type: String,
    required: [true, 'Satuan harus diisi'],
    enum: ['kg', 'gram', 'mg', 'liter', 'ml', 'lb', 'ton', 'kwintal', 'lusin', 'pcs', 'pack', 'sdm', 'sdt', 'siung', 'batang', 'ikat']
  },
  expirationDate: {
    type: Date,
    required: [true, 'Tanggal kadaluarsa harus diisi']
  },
  minimumStock: {
    type: Number,
    default: 0,
    min: [0, 'Stok minimum tidak boleh negatif']
  },
  photo: {
    type: String,
    default: null
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  isLowStock: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index untuk query performance
inventorySchema.index({ user: 1, category: 1 });
inventorySchema.index({ user: 1, expirationDate: 1 });
inventorySchema.index({ user: 1, isLowStock: 1 });

// Update updatedAt sebelum save
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual untuk cek apakah mendekati expired (7 hari)
inventorySchema.virtual('isNearExpiry').get(function() {
  const today = new Date();
  const diffTime = this.expirationDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays > 0;
});

// Method untuk update status expired dan low stock
inventorySchema.methods.updateStatus = function() {
  const today = new Date();
  this.isExpired = this.expirationDate < today;
  this.isLowStock = this.quantity <= this.minimumStock;
  return this.save();
};

export default mongoose.model('Inventory', inventorySchema);
