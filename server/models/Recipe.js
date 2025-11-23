import mongoose from 'mongoose';

const recipeIngredientSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'Bahan Pokok',
      'Protein',
      'Sayur',
      'Buah',
      'Produk Susu & Olahan',
      'Bumbu & Rempah',
      'Penyedap & Saus',
      'Minuman',
      'Lainnya'
    ]
  },
  ingredientName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'mg', 'liter', 'ml', 'lb', 'ton', 'kwintal', 'lusin', 'pcs', 'pack', 'sdm', 'sdt']
  }
}, { _id: false });

const recipeStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  instruction: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Judul resep harus diisi'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  photo: {
    type: String,
    default: null
  },
  ingredients: [recipeIngredientSchema],
  steps: [recipeStepSchema],
  cookingTime: {
    type: Number,
    default: 0,
    min: 0
  },
  servings: {
    type: Number,
    default: 1,
    min: 1
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
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
recipeSchema.index({ user: 1 });
recipeSchema.index({ isPublic: 1 });
recipeSchema.index({ title: 'text', description: 'text' });

// Update updatedAt sebelum save
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Recipe', recipeSchema);
