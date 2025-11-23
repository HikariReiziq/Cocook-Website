import express from 'express';
import {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getDashboard,
  reduceStock
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Semua routes memerlukan authentication
router.use(protect);

// Dashboard data
router.get('/dashboard', getDashboard);

// Reduce stock (digunakan saat selesai masak)
router.post('/reduce', reduceStock);

// CRUD Inventory
router.route('/')
  .get(getInventory)
  .post(upload.single('photo'), handleMulterError, createInventory);

router.route('/:id')
  .get(getInventoryById)
  .put(upload.single('photo'), handleMulterError, updateInventory)
  .delete(deleteInventory);

export default router;
