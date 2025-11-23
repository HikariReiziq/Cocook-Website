import express from 'express';
import {
  getHistory,
  getHistoryStats,
  deleteHistory,
  clearHistory
} from '../controllers/historyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Semua routes memerlukan authentication
router.use(protect);

// Get history stats untuk dashboard
router.get('/stats', getHistoryStats);

// CRUD History
router.route('/')
  .get(getHistory)
  .delete(clearHistory);

router.delete('/:id', deleteHistory);

export default router;
