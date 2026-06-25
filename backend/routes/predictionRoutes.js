const express = require('express');
const router = express.Router();
const { savePrediction, getUserPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, savePrediction)
  .get(protect, getUserPredictions);

module.exports = router;
