import Recipe from '../models/Recipe.js';
import Inventory from '../models/Inventory.js';
import History from '../models/History.js';
import { convertToBaseUnit, CONVERSION_RATES } from '../utils/constants.js';

// @desc    Get all recipes (public + user's own)
// @route   GET /api/recipes
// @access  Private
export const getRecipes = async (req, res) => {
  try {
    const { search, myRecipes } = req.query;

    let filter = {};

    if (myRecipes === 'true') {
      // Hanya resep user sendiri
      filter.user = req.user.id;
    } else {
      // Public recipes + resep user sendiri
      filter.$or = [
        { isPublic: true },
        { user: req.user.id }
      ];
    }

    // Search by title or description
    if (search) {
      filter.$text = { $search: search };
    }

    const recipes = await Recipe.find(filter)
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('GetRecipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data resep',
      error: error.message
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user', 'name profilePhoto');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Cek akses: jika resep private, hanya owner yang bisa akses
    if (!recipe.isPublic && recipe.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('GetRecipeById error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data resep',
      error: error.message
    });
  }
};

// @desc    Create recipe baru
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      cookingTime,
      servings,
      isPublic
    } = req.body;

    // Validasi input
    if (!title || !ingredients || !steps) {
      return res.status(400).json({
        success: false,
        message: 'Judul, bahan, dan langkah memasak harus diisi'
      });
    }

    // Parse ingredients dan steps jika dalam bentuk JSON string
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps;

    // Transform steps jika array of strings jadi array of objects
    const formattedSteps = Array.isArray(parsedSteps) 
      ? parsedSteps.map((step, index) => {
          if (typeof step === 'string') {
            return { stepNumber: index + 1, instruction: step };
          }
          return step;
        })
      : [];

    const recipeData = {
      user: req.user.id,
      title,
      description: description || '',
      ingredients: parsedIngredients,
      steps: formattedSteps,
      cookingTime: cookingTime ? parseInt(cookingTime) : 0,
      servings: servings ? parseInt(servings) : 1,
      isPublic: isPublic !== undefined ? isPublic : true
    };

    if (req.file) {
      recipeData.photo = `/uploads/${req.file.filename}`;
    }

    const recipe = await Recipe.create(recipeData);

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Create',
      category: 'Recipe',
      detail: `Menambahkan resep baru: ${title}`,
      relatedId: recipe._id
    });

    res.status(201).json({
      success: true,
      message: 'Resep berhasil ditambahkan',
      data: recipe
    });
  } catch (error) {
    console.error('CreateRecipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan resep',
      error: error.message
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Pastikan user hanya bisa update resep miliknya
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const {
      title,
      description,
      ingredients,
      steps,
      cookingTime,
      servings,
      isPublic
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (ingredients) updateData.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    if (steps) {
      const parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps;
      updateData.steps = Array.isArray(parsedSteps) 
        ? parsedSteps.map((step, index) => {
            if (typeof step === 'string') {
              return { stepNumber: index + 1, instruction: step };
            }
            return step;
          })
        : [];
    }
    if (cookingTime !== undefined) updateData.cookingTime = parseInt(cookingTime);
    if (servings !== undefined) updateData.servings = parseInt(servings);
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (req.file) updateData.photo = `/uploads/${req.file.filename}`;

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Update',
      category: 'Recipe',
      detail: `Mengubah resep: ${recipe.title}`,
      relatedId: recipe._id
    });

    res.status(200).json({
      success: true,
      message: 'Resep berhasil diupdate',
      data: recipe
    });
  } catch (error) {
    console.error('UpdateRecipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update resep',
      error: error.message
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Pastikan user hanya bisa delete resep miliknya
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const recipeTitle = recipe.title;

    await Recipe.findByIdAndDelete(req.params.id);

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Delete',
      category: 'Recipe',
      detail: `Menghapus resep: ${recipeTitle}`,
      relatedId: null
    });

    res.status(200).json({
      success: true,
      message: 'Resep berhasil dihapus'
    });
  } catch (error) {
    console.error('DeleteRecipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus resep',
      error: error.message
    });
  }
};

// @desc    Finish cooking (Start CoCook - Langkah terakhir)
// @route   POST /api/recipes/:id/finish
// @access  Private
export const finishCooking = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Kurangi stok inventory berdasarkan FIFO dengan konversi
    const reductionResults = [];

    for (const ingredient of recipe.ingredients) {
      const { ingredientName, quantity, unit } = ingredient;

      // Konversi quantity ke base unit (gram/ml)
      const requiredAmount = convertToBaseUnit(parseFloat(quantity), unit);

      // Ambil semua batch bahan ini, sort by FIFO (expired terdekat)
      const batches = await Inventory.find({
        user: req.user.id,
        ingredientName: ingredientName
      }).sort({ expirationDate: 1 });

      let remainingAmount = requiredAmount;
      let reduced = false;

      for (const batch of batches) {
        if (remainingAmount <= 0) {
          reduced = true;
          break;
        }

        // Konversi stok batch ke base unit
        const batchAmount = convertToBaseUnit(batch.quantity, batch.unit);

        if (batchAmount >= remainingAmount) {
          // Batch ini cukup untuk memenuhi kebutuhan
          const conversionRate = CONVERSION_RATES[batch.unit];
          const newQuantity = (batchAmount - remainingAmount) / conversionRate;
          batch.quantity = newQuantity;
          await batch.save();
          await batch.updateStatus();
          remainingAmount = 0;
          reduced = true;
        } else {
          // Batch ini tidak cukup, habiskan dan lanjut ke batch berikutnya
          remainingAmount -= batchAmount;
          await Inventory.findByIdAndDelete(batch._id);
        }
      }

      reductionResults.push({
        ingredientName,
        reduced,
        insufficientStock: remainingAmount > 0
      });
    }

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Cook',
      category: 'Recipe',
      detail: `Selesai memasak: ${recipe.title}`,
      relatedId: recipe._id
    });

    res.status(200).json({
      success: true,
      message: 'Selesai memasak! Stok inventory berhasil dikurangi',
      data: {
        recipe: recipe.title,
        reductionResults
      }
    });
  } catch (error) {
    console.error('FinishCooking error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyelesaikan memasak',
      error: error.message
    });
  }
};
