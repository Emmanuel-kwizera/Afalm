const Prediction = require('../models/Prediction');
const SoilPrediction = require('../models/SoilPrediction');

// @desc    Get dashboard stats and recent predictions
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Get totals
    const totalDisease = await Prediction.countDocuments({ user: req.user.id });
    const totalSoil = await SoilPrediction.countDocuments({ user: req.user.id });

    // 2. Get recent disease predictions
    const recentDisease = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    // 3. Get recent soil analyses
    const recentSoil = await SoilPrediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        totalDisease,
        totalSoil,
        recentDisease,
        recentSoil
      }
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching dashboard stats' });
  }
};
