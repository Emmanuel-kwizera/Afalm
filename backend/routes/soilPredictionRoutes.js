const express = require('express');
const router = express.Router();
const { saveSoilPrediction, getUserSoilPredictions } = require('../controllers/soilPredictionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, saveSoilPrediction)
  .get(protect, getUserSoilPredictions);

module.exports = router;
