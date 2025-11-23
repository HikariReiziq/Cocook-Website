import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  finishCooking
} from '../controllers/recipeController.js';
import { protect } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Semua routes memerlukan authentication
router.use(protect);

// Finish cooking (Start CoCook - Langkah terakhir)
router.post('/:id/finish', finishCooking);

// CRUD Recipe
router.route('/')
  .get(getRecipes)
  .post(upload.single('photo'), handleMulterError, createRecipe);

router.route('/:id')
  .get(getRecipeById)
  .put(upload.single('photo'), handleMulterError, updateRecipe)
  .delete(deleteRecipe);

export default router;
