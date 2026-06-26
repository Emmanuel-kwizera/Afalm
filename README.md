# AFALM: Agricultural Forecasting & Land Management

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Emmanuel-kwizera/Afalm.git)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/ML%20API-Python%20%7C%20FastAPI-green?logo=python)](https://fastapi.tiangolo.com/)

An AI-powered smart agriculture platform designed to assist farmers, agronomists, and autonomous drone agents in crop disease diagnostics and multi-task soil health prediction. **AFALM** integrates advanced Computer Vision (Deep Learning) with robust predictive modeling (tabular Machine Learning) within a modern, user-friendly full-stack web application to drive sustainable, high-yield agriculture.

- [Figma Design](https://www.figma.com/design/b2satlhwSIA8AKPkESd5tQ/Afalm?node-id=0-1&t=fMkEVXBjUiuHN157-1)
- [Final version Demo Video]([https://youtu.be/A4Ms3E2iEcY](https://drive.google.com/file/d/1T-EpHwAHOto_1C178Cgiok6_P-90lKng/view?usp=sharing))

---

## Live Demo Links

- **Main Application (React Full-Stack):** [https://afalm-app.onrender.com](https://afalm-app.onrender.com)
- **Alternative Static HTML Version:** [https://afalm-1.onrender.com](https://afalm-1.onrender.com)
- **Machine Learning API:** [https://afalm.onrender.com](https://afalm.onrender.com/docs)
- **Node.js API:** [https://afalm-backend.onrender.com](https://afalm-backend.onrender.com/api-docs)

---

## Table of Contents
- [Description](#description)
- [System Architecture & Stack](#system-architecture--stack)
- [How to Set Up the Web Application](#how-to-set-up-the-web-application)
- [How to Set Up the Machine Learning Environment](#how-to-set-up-the-machine-learning-environment)
- [Machine Learning & Deep Learning Models](#machine-learning--deep-learning-models)

---

## Description

**AFALM** (Agricultural Forecasting & Land Management) is an end-to-end intelligence system for modern farms. It solves two critical challenges in agriculture:
1. **Crop Health Monitoring**: Instant leaf-based disease diagnosis using a 44-class deep convolutional network. Users can upload images of their crops and instantly receive a health diagnostic report.
2. **Soil Health & Land Management**: Tabular predictive modeling across 5 key soil tasks using multi-class classifiers and regression networks (predicting soil risk, crop suitability, fertilizer prescriptions, required NPK values, and salinity/moisture stress).

The application features a fully authenticated user dashboard where farmers can review their diagnostic history, track soil health trends, manage their farm settings, and view automated platform-wide analytics via a dedicated Admin Dashboard.

---

## System Architecture & Stack

The AFALM platform is built using a modern microservice-inspired architecture:

- **Frontend (UI)**: Built with **React.js** and **Vite**. Provides a responsive, beautiful dashboard interface featuring real-time data visualization and secure JWT-based authentication flows.
- **Main Backend (API Gateway)**: Built with **Node.js** and **Express**. Handles user authentication, database read/writes, route protection, and Google Drive API integrations for image storage.
- **Machine Learning API (Inference)**: Built with **Python** and **FastAPI**. Exposes endpoints for executing TensorFlow image classification and XGBoost/LightGBM tabular predictions.
- **Database**: **MongoDB**, serving as the persistent storage layer for user profiles, encrypted credentials, and historical scan records.

---

## How to Set Up the Web Application

To run the full AFALM application locally, you will need to start three separate servers (Database, Node.js Backend, and React Frontend).

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Running locally on port `27017` or via MongoDB Atlas)
- **Python 3.9+** (For the ML backend)

### 2. Backend Setup (Node.js)
The Node backend handles user authentication and database operations.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/afalm
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The Node.js server will start on `http://localhost:5000`.*

### 3. Frontend Setup (React)
The React frontend is the user-facing dashboard.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React app will be accessible at `http://localhost:5173`.*

### 4. Admin Access Setup (Optional)
To test the secure Admin Dashboard:
1. Register a standard user account via the React frontend (`http://localhost:5173/register`).
2. Open a terminal in the `backend` directory and run the upgrade script to grant yourself admin privileges:
   ```bash
   node -e "require('mongoose').connect('mongodb://localhost:27017/afalm').then(async () => { await require('./models/User').updateMany({}, {role: 'admin'}); console.log('Upgraded to admin!'); process.exit(0); })"
   ```
3. Log out and log back in to access the Admin Panel.

---

## How to Set Up the Machine Learning Environment

If you want to train the models from scratch, run the Jupyter notebooks, or boot up the Python FastAPI server for local predictions, follow these steps:

### Prerequisites
- **C/C++ Compiler & Build Tools** (needed for tree boosting packages)
- **Homebrew** (macOS only, to resolve native dependencies)
  *Note on macOS (Apple Silicon / Intel): XGBoost requires the OpenMP library to run multi-threaded calculations. If you encounter a `libomp.dylib` error, run `brew install libomp`.*

### Installation
1. Navigate to the root repository folder.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install --upgrade pip
   pip install tensorflow numpy pandas matplotlib seaborn scikit-learn xgboost lightgbm joblib kagglehub fastapi uvicorn
   ```

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
