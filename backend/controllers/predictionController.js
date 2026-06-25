const Prediction = require('../models/Prediction');
const { uploadFileToDrive } = require('../utils/driveService');

// @desc    Save new prediction
// @route   POST /api/predictions
// @access  Private
const savePrediction = async (req, res) => {
  try {
    const { filename, disease, confidence, inference_time_ms } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Upload to Google Drive
      try {
        imageUrl = await uploadFileToDrive(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadError) {
        console.error('Failed to upload to Google Drive:', uploadError);
        // Continue saving prediction even if image upload fails
      }
    }

    const prediction = new Prediction({
      user: req.user._id,
      filename: filename || req.file?.originalname || 'unknown',
      disease,
      confidence,
      inference_time_ms,
      imageUrl,
    });

    const savedPrediction = await prediction.save();
    res.status(201).json({ success: true, data: savedPrediction });
  } catch (error) {
    console.error('Error saving prediction:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all predictions for the logged-in user
// @route   GET /api/predictions
// @access  Private
const getUserPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: predictions.length, data: predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  savePrediction,
  getUserPredictions,
};
