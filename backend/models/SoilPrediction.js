const mongoose = require('mongoose');

const soilPredictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Inputs
    nitrogen: { type: Number, required: true },
    phosphorous: { type: Number, required: true },
    potassium: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    moisture: { type: Number, required: true },
    ph: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    soil_type: { type: String, required: true },
    crop_type: { type: String, required: true },
    // Outputs
    crop_recommendation: { type: String },
    soil_risk: { type: String },
    fertilizer_prescription: { type: String },
    target_n: { type: Number },
    target_p: { type: Number },
    target_k: { type: Number },
    salinity_stress: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SoilPrediction', soilPredictionSchema);
