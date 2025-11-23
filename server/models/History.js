import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['Create', 'Update', 'Delete', 'Cook']
  },
  category: {
    type: String,
    required: true,
    enum: ['Inventory', 'Recipe', 'Profile']
  },
  detail: {
    type: String,
    required: true,
    trim: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index untuk query performance
historySchema.index({ user: 1, timestamp: -1 });
historySchema.index({ user: 1, action: 1 });
historySchema.index({ user: 1, category: 1 });

export default mongoose.model('History', historySchema);
