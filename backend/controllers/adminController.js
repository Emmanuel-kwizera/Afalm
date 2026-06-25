const User = require('../models/User');
const Prediction = require('../models/Prediction');
const SoilPrediction = require('../models/SoilPrediction');

// @desc    Get system-wide stats for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDiseaseScans = await Prediction.countDocuments();
    const totalSoilScans = await SoilPrediction.countDocuments();

    // Get the 5 most recently registered users
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get the 5 most recent disease scans
    const recentDiseaseScans = await Prediction.find({})
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          diseaseScans: totalDiseaseScans,
          soilScans: totalSoilScans
        },
        recentUsers,
        recentDiseaseScans
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getSystemStats,
};
