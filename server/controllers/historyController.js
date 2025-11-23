import History from '../models/History.js';

// @desc    Get all history logs untuk user
// @route   GET /api/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const { action, category, limit } = req.query;

    const filter = { user: req.user.id };
    
    if (action) {
      filter.action = action;
    }
    
    if (category) {
      filter.category = category;
    }

    let query = History.find(filter).sort({ timestamp: -1 });

    // Limit hasil (default 50)
    const limitNum = limit ? parseInt(limit) : 50;
    query = query.limit(limitNum);

    const history = await query;

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('GetHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data history',
      error: error.message
    });
  }
};

// @desc    Get history stats untuk dashboard
// @route   GET /api/history/stats
// @access  Private
export const getHistoryStats = async (req, res) => {
  try {
    // Recent history (10 terakhir)
    const recentHistory = await History.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);

    // Count by action
    const actionStats = await History.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    // Count by category
    const categoryStats = await History.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentHistory,
        actionStats,
        categoryStats
      }
    });
  } catch (error) {
    console.error('GetHistoryStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik history',
      error: error.message
    });
  }
};

// @desc    Delete history log (opsional - untuk cleanup)
// @route   DELETE /api/history/:id
// @access  Private
export const deleteHistory = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History tidak ditemukan'
      });
    }

    // Pastikan user hanya bisa delete history miliknya
    if (history.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    await History.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'History berhasil dihapus'
    });
  } catch (error) {
    console.error('DeleteHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus history',
      error: error.message
    });
  }
};

// @desc    Clear all history untuk user
// @route   DELETE /api/history
// @access  Private
export const clearHistory = async (req, res) => {
  try {
    await History.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Semua history berhasil dihapus'
    });
  } catch (error) {
    console.error('ClearHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus history',
      error: error.message
    });
  }
};
