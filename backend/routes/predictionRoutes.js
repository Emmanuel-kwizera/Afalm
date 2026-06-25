const express = require('express');
const router = express.Router();
const multer = require('multer');
const { savePrediction, getUserPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .post(protect, upload.single('image'), savePrediction)
  .get(protect, getUserPredictions);

module.exports = router;
