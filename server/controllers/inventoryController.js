import Inventory from '../models/Inventory.js';
import History from '../models/History.js';
import { convertToBaseUnit, CONVERSION_RATES } from '../utils/constants.js';

// @desc    Get all inventory items untuk user
// @route   GET /api/inventory
// @access  Private
export const getInventory = async (req, res) => {
  try {
    const { category, sortBy } = req.query;
    
    const filter = { user: req.user.id };
    if (category && category !== 'all') {
      filter.category = category;
    }

    let query = Inventory.find(filter);

    // Sort berdasarkan tanggal expired (FIFO)
    if (sortBy === 'expiry') {
      query = query.sort({ expirationDate: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const inventory = await query;

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    console.error('GetInventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data inventaris',
      error: error.message
    });
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Bahan tidak ditemukan'
      });
    }

    // Pastikan user hanya bisa akses inventory miliknya
    if (inventory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('GetInventoryById error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data bahan',
      error: error.message
    });
  }
};

// @desc    Create inventory item baru
// @route   POST /api/inventory
// @access  Private
export const createInventory = async (req, res) => {
  try {
    const {
      category,
      ingredientName,
      variant,
      quantity,
      unit,
      expirationDate,
      minimumStock
    } = req.body;

    // Validasi input
    if (!category || !ingredientName || !quantity || !unit || !expirationDate) {
      return res.status(400).json({
        success: false,
        message: 'Data belum lengkap. Harap isi semua field yang diperlukan'
      });
    }

    const inventoryData = {
      user: req.user.id,
      category,
      ingredientName,
      variant: variant || null,
      quantity: parseFloat(quantity),
      unit,
      expirationDate: new Date(expirationDate),
      minimumStock: minimumStock ? parseFloat(minimumStock) : 0
    };

    if (req.file) {
      inventoryData.photo = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl) {
      inventoryData.photo = req.body.photoUrl;
    }

    const inventory = await Inventory.create(inventoryData);

    // Update status (expired & low stock)
    await inventory.updateStatus();

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Create',
      category: 'Inventory',
      detail: `Menambahkan bahan baru: ${ingredientName}${variant ? ` - ${variant}` : ''}`,
      relatedId: inventory._id
    });

    res.status(201).json({
      success: true,
      message: 'Bahan berhasil ditambahkan',
      data: inventory
    });
  } catch (error) {
    console.error('CreateInventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan bahan',
      error: error.message
    });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
export const updateInventory = async (req, res) => {
  try {
    let inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Bahan tidak ditemukan'
      });
    }

    // Pastikan user hanya bisa update inventory miliknya
    if (inventory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const {
      category,
      ingredientName,
      variant,
      quantity,
      unit,
      expirationDate,
      minimumStock
    } = req.body;

    const updateData = {};
    if (category) updateData.category = category;
    if (ingredientName) updateData.ingredientName = ingredientName;
    if (variant !== undefined) updateData.variant = variant;
    if (quantity !== undefined) updateData.quantity = parseFloat(quantity);
    if (unit) updateData.unit = unit;
    if (expirationDate) updateData.expirationDate = new Date(expirationDate);
    if (minimumStock !== undefined) updateData.minimumStock = parseFloat(minimumStock);
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl) {
      updateData.photo = req.body.photoUrl;
    }

    inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update status
    await inventory.updateStatus();

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Update',
      category: 'Inventory',
      detail: `Mengubah bahan: ${inventory.ingredientName}${inventory.variant ? ` - ${inventory.variant}` : ''}`,
      relatedId: inventory._id
    });

    res.status(200).json({
      success: true,
      message: 'Bahan berhasil diupdate',
      data: inventory
    });
  } catch (error) {
    console.error('UpdateInventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update bahan',
      error: error.message
    });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Bahan tidak ditemukan'
      });
    }

    // Pastikan user hanya bisa delete inventory miliknya
    if (inventory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const ingredientInfo = `${inventory.ingredientName}${inventory.variant ? ` - ${inventory.variant}` : ''}`;

    await Inventory.findByIdAndDelete(req.params.id);

    // Log history
    await History.create({
      user: req.user.id,
      action: 'Delete',
      category: 'Inventory',
      detail: `Menghapus bahan: ${ingredientInfo}`,
      relatedId: null
    });

    res.status(200).json({
      success: true,
      message: 'Bahan berhasil dihapus'
    });
  } catch (error) {
    console.error('DeleteInventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus bahan',
      error: error.message
    });
  }
};

// @desc    Get dashboard data (expired alerts, low stock, waste report)
// @route   GET /api/inventory/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Bahan yang hampir expired (dalam 7 hari)
    const nearExpiry = await Inventory.find({
      user: req.user.id,
      expirationDate: {
        $gte: today,
        $lte: sevenDaysLater
      }
    }).sort({ expirationDate: 1 }).limit(5);

    // Bahan low stock
    const lowStock = await Inventory.find({
      user: req.user.id,
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    }).limit(5);

    // Bahan expired (waste report)
    const expired = await Inventory.find({
      user: req.user.id,
      expirationDate: { $lt: today }
    }).sort({ expirationDate: -1 }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        nearExpiry,
        lowStock,
        expired
      }
    });
  } catch (error) {
    console.error('GetDashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data dashboard',
      error: error.message
    });
  }
};

// @desc    Reduce inventory stock (digunakan saat "Selesai Masak")
// @route   POST /api/inventory/reduce
// @access  Private
export const reduceStock = async (req, res) => {
  try {
    const { ingredients } = req.body; // Array of { ingredientName, quantity, unit }

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: 'Format data tidak valid'
      });
    }

    const results = [];

    for (const ingredient of ingredients) {
      const { ingredientName, quantity, unit } = ingredient;

      // Konversi quantity ke base unit
      const requiredAmount = convertToBaseUnit(parseFloat(quantity), unit);

      // Ambil semua batch bahan ini, sort by FIFO (expired terdekat)
      const batches = await Inventory.find({
        user: req.user.id,
        ingredientName: ingredientName
      }).sort({ expirationDate: 1 });

      let remainingAmount = requiredAmount;

      for (const batch of batches) {
        if (remainingAmount <= 0) break;

        // Konversi stok batch ke base unit
        const batchAmount = convertToBaseUnit(batch.quantity, batch.unit);

        if (batchAmount >= remainingAmount) {
          // Batch ini cukup untuk memenuhi kebutuhan
          const newQuantity = (batchAmount - remainingAmount) / CONVERSION_RATES[batch.unit];
          batch.quantity = newQuantity;
          await batch.save();
          await batch.updateStatus();
          remainingAmount = 0;
        } else {
          // Batch ini tidak cukup, habiskan dan lanjut ke batch berikutnya
          remainingAmount -= batchAmount;
          await Inventory.findByIdAndDelete(batch._id);
        }
      }

      results.push({
        ingredientName,
        reduced: remainingAmount === 0,
        remaining: remainingAmount
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stok berhasil dikurangi',
      data: results
    });
  } catch (error) {
    console.error('ReduceStock error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengurangi stok',
      error: error.message
    });
  }
};
