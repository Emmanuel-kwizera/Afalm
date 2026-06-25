const SoilPrediction = require('../models/SoilPrediction');

// @desc    Save new soil prediction
// @route   POST /api/soil-predictions
// @access  Private
const saveSoilPrediction = async (req, res) => {
  try {
    const {
      nitrogen, phosphorous, potassium, temperature, humidity, moisture, ph, rainfall, soil_type, crop_type,
      crop_recommendation, soil_risk, fertilizer_prescription, target_n, target_p, target_k, salinity_stress
    } = req.body;

    const prediction = new SoilPrediction({
      user: req.user._id,
      nitrogen, phosphorous, potassium, temperature, humidity, moisture, ph, rainfall, soil_type, crop_type,
      crop_recommendation, soil_risk, fertilizer_prescription, target_n, target_p, target_k, salinity_stress
    });

    const savedPrediction = await prediction.save();
    res.status(201).json({ success: true, data: savedPrediction });
  } catch (error) {
    console.error('Error saving soil prediction:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all soil predictions for the logged-in user
// @route   GET /api/soil-predictions
// @access  Private
const getUserSoilPredictions = async (req, res) => {
  try {
    const predictions = await SoilPrediction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: predictions.length, data: predictions });
  } catch (error) {
    console.error('Error fetching soil predictions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  saveSoilPrediction,
  getUserSoilPredictions,
};
