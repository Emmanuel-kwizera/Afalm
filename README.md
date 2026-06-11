# AFALM: Agricultural Forecasting & Land Management

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Emmanuel-kwizera/Afalm.git)
[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-green?logo=python)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)](https://tensorflow.org)
[![XGBoost](https://img.shields.io/badge/Models-XGBoost%20%7C%20LightGBM-ff69b4)](https://xgboost.readthedocs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An AI-powered smart agriculture platform designed to assist farmers, agronomists, and autonomous drone agents in crop disease diagnostics and multi-task soil health prediction. **AFALM** integrates advanced Computer Vision (Deep Learning) with robust predictive modeling (tabular Machine Learning) to drive sustainable, high-yield agriculture.

[GitHub Repo Link](https://github.com/Emmanuel-kwizera/Afalm)
[Figma Design](https://www.figma.com/design/b2satlhwSIA8AKPkESd5tQ/Afalm?node-id=0-1&t=fMkEVXBjUiuHN157-1)

---

##  Table of Contents
- [Description](#-description)
- [How to Set Up the Project](#-how-to-set-up-the-project)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Notebooks](#running-the-notebooks)
- [Machine Learning & Deep Learning Models](#-machine-learning--deep-learning-models)
  - [1. Plant Disease Classification](#1-plant-disease-classification)
  - [2. Soil Nutrient & Health Prediction](#2-soil-nutrient--health-prediction)
- [Deployment Plan (Web App)](#-deployment-plan-web-app)

---

## Description

**AFALM** (Agricultural Forecasting & Land Management) is an end-to-end intelligence system for modern farms. It solves two critical challenges in agriculture:
1. **Crop Health Monitoring**: Instant leaf-based disease diagnosis using a 44-class deep convolutional network.
2. **Soil Health & Land Management**: Tabular predictive modeling across 5 key soil tasks using multi-class classifiers and regression networks (predicting soil risk, crop suitability, fertilizer prescriptions, required NPK values, and salinity/moisture stress).

---

## How to Set Up the Project

### Prerequisites
- **Python**: 3.9, 3.10, or 3.11
- **C/C++ Compiler & Build Tools** (needed for tree boosting packages)
- **Homebrew** (macOS only, to resolve native dependencies)
- **Kaggle API Credentials** (to download the raw soil dataset in the notebook)

#### Note on macOS (Apple Silicon / Intel)
XGBoost requires the OpenMP library to run multi-threaded calculations. If you encounter a `libomp.dylib` error, run:
```bash
brew install libomp
```

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Emmanuel-kwizera/Afalm.git
   cd Afalm
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install the required packages**:
   ```bash
   pip install --upgrade pip
   pip install tensorflow numpy pandas matplotlib seaborn scikit-learn xgboost lightgbm joblib kagglehub
   ```

---

### Running the Notebooks

Start your Jupyter notebook server:
```bash
jupyter notebook
```

- Run **`notebooks/plant_disease_training.ipynb`** to train the EfficientNetB0 image classification model.
- Run **`notebooks/soil_nutrient_prediction.ipynb`** to execute the exploratory data analysis (EDA) and train the multi-task soil classifiers/regressors.

---

## Machine Learning & Deep Learning Models

### 1. Plant Disease Classification
- **Base Architecture**: `EfficientNetB0` (Pre-trained on ImageNet).
- **Training Strategy**: 
  - **Phase 1**: Frozen base model, training only custom dense output layers (Learning Rate: 1e-3, 25 Epochs).
  - **Phase 2**: Fine-tuning by unfreezing the last 20% of layers (Learning Rate: 1e-5, 10 Epochs).
- **Outputs**: 44 target plant categories representing healthy and diseased leaves for Apple, Banana, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato.

### 2. Soil Nutrient & Health Prediction
Using the crop and soil dataset, the notebook trains pipelines (preprocessing scaler + estimator) for five distinct tasks:
- **Task 1: Soil Health & Degradation Risk**: Multi-class classification (Low, Medium, High Risk) based on NPK, temperature, and moisture ratios.
- **Task 2: Optimal Crop Recommendation**: Predicting crop suitability for 11 crop types.
- **Task 3a: Fertilizer Prescription**: Prescribing 7 classes of fertilizers based on current soil parameters.
- **Task 3b: Nutrient Regression**: Predicting optimal target Nitrogen (N), Phosphorus (P), and Potassium (K) levels using regression algorithms.
- **Task 4: Soil Salinity & Stress Index**: Binary classification predicting stress probability.

---

## Deployment Plan (Web App)

We deploy **AFALM** as a Dockerized web application composed of a FastAPI back-end API and frontend dashboard.

```
                  +-----------------------+
                  |  Web Application UI   |    
                  +-----------+-----------+
                              | 
                              v
                  +-----------+-----------+
                  |  FastAPI Gateway API  |
                  +-----------+-----------+
                              |
               +--------------+--------------+
               |                             |
               v                             v
  +------------+------------+   +------------+------------+
  |  Image Diagnostic Unit  |   |  Soil Predictive Unit   |
  |  (TensorFlow / Keras)   |   | (XGBoost / LightGBM)    |
  +-------------------------+   +-------------------------+
```

### 1. Containerization (Docker)
A multi-stage `Dockerfile` separates model weight storage and inference execution to keep container sizes small:
- **FastAPI API Container**: Exposes endpoint `/api/v1/predict/disease` (accepting multipart image uploads) and `/api/v1/predict/soil` (accepting tabular sensor values).
- **Frontend Nginx Container**: Serves static HTML dashboard files pointing to the FastAPI gateway.

### 2. Pipeline Configuration
- Heavy TensorFlow and XGBoost models are saved in the `models/` folder as `.keras` and `.pkl` files.
- During container startup, these models are cached in RAM to guarantee low-latency API responses (typically under 100ms for soil tabular predictions, and under 250ms for image inference on standard CPU environments).

### 3. Production Hosting Platforms
- **API Service**: Deployed on **Render** (using Docker runtime) or **AWS ECS (Fargate)** for scalable CPU-based serverless containers.
- **Database**: **Supabase (PostgreSQL)** for logging sensor time-series values, crop records, and diagnostic histories.
- **Frontend Dashboard**: Deployed on **Vercel** or **GitHub Pages** as a fast static single-page application.

---
