import os
import joblib
import pandas as pd

# Load models and encoders lazily
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'soil_prediction')

# Hardcoded encoders based on typical dataset alphabetic sorting
SOIL_TYPES = ['Black', 'Clayey', 'Loamy', 'Red', 'Sandy']
CROP_TYPES = ['Barley', 'Cotton', 'Ground Nuts', 'Maize', 'Millets', 'Oil seeds', 'Paddy', 'Pulses', 'Sugarcane', 'Tobacco', 'Wheat']

soil_encoder = {k: i for i, k in enumerate(SOIL_TYPES)}
crop_encoder = {k: i for i, k in enumerate(CROP_TYPES)}

def safe_load(filename):
    path = os.path.join(MODELS_DIR, filename)
    if os.path.exists(path):
        return joblib.load(path)
    return None

# Load models
task1_model = safe_load('task1_soil_risk_best.pkl')
task1_encoder = safe_load('task1_label_encoder_risk.pkl')

task2_model = safe_load('task2_crop_recommendation_best.pkl')
task2_encoder = safe_load('task2_label_encoder_crop.pkl')

task3_model = safe_load('task3_fertilizer_prescription_best.pkl')
task3_encoder = safe_load('task3_label_encoder_fert.pkl')

task3b_n_model = safe_load('task3b_nitrogen_regression_best.pkl')
task3b_p_model = safe_load('task3b_phosphorous_regression_best.pkl')
task3b_k_model = safe_load('task3b_potassium_regression_best.pkl')

task4_model = safe_load('task4_salinity_stress_best.pkl')

def predict_soil_metrics(data: dict):
    """
    Receives raw inputs: nitrogen, phosphorous, potassium, temperature, humidity, moisture, ph, rainfall, soil_type, crop_type
    Returns all predictions.
    """
    try:
        # 1. Feature Engineering
        N = float(data.get('nitrogen', 0))
        P = float(data.get('phosphorous', 0))
        K = float(data.get('potassium', 0))
        Temp = float(data.get('temperature', 0))
        Hum = float(data.get('humidity', 0))
        Moist = float(data.get('moisture', 0))
        pH = float(data.get('ph', 0))
        Rain = float(data.get('rainfall', 0))
        
        soil_type_str = data.get('soil_type', 'Loamy')
        crop_type_str = data.get('crop_type', 'Wheat')
        
        Soil_Type_enc = soil_encoder.get(soil_type_str, 2)
        Crop_Type_enc = crop_encoder.get(crop_type_str, 10)
        
        NPK_sum = N + P + K
        N_P_ratio = N / P if P != 0 else 0
        N_K_ratio = N / K if K != 0 else 0
        P_K_ratio = P / K if K != 0 else 0
        temp_hum = Temp * Hum
        ph_sq = pH ** 2
        
        # Responses
        responses = {}
        
        # --- Task 1: Soil Risk ---
        if task1_model and task1_encoder:
            df1 = pd.DataFrame([{
                'Nitrogen': N, 'Potassium': K, 'Phosphorous': P,
                'Temparature': Temp, 'Humidity': Hum, 'Moisture': Moist,
                'NPK_sum': NPK_sum, 'N_P_ratio': N_P_ratio, 'N_K_ratio': N_K_ratio,
                'Soil_Type_enc': Soil_Type_enc
            }])
            pred = task1_model.predict(df1)
            responses['soil_risk'] = task1_encoder.inverse_transform(pred)[0]
            
        # --- Task 2: Crop Recommendation ---
        if task2_model and task2_encoder:
            df2 = pd.DataFrame([{
                'N': N, 'P': P, 'K': K, 'temperature': Temp, 'humidity': Hum,
                'ph': pH, 'rainfall': Rain, 'NPK_sum': NPK_sum,
                'N_P_ratio': N_P_ratio, 'N_K_ratio': N_K_ratio, 'P_K_ratio': P_K_ratio,
                'temp_hum': temp_hum, 'ph_sq': ph_sq
            }])
            pred = task2_model.predict(df2)
            responses['crop_recommendation'] = str(task2_encoder.inverse_transform(pred)[0]).title()
            
        # --- Task 3: Fertilizer Prescription ---
        if task3_model and task3_encoder:
            df3 = pd.DataFrame([{
                'Nitrogen': N, 'Potassium': K, 'Phosphorous': P,
                'Temparature': Temp, 'Humidity': Hum, 'Moisture': Moist,
                'NPK_sum': NPK_sum, 'N_P_ratio': N_P_ratio, 'N_K_ratio': N_K_ratio,
                'Soil_Type_enc': Soil_Type_enc, 'Crop_Type_enc': Crop_Type_enc
            }])
            pred = task3_model.predict(df3)
            responses['fertilizer_prescription'] = task3_encoder.inverse_transform(pred)[0]
            
        # --- Task 3b: NPK Regression ---
        if task3b_n_model and task3b_p_model and task3b_k_model:
            df3b = pd.DataFrame([{
                'Temparature': Temp, 'Humidity': Hum, 'Moisture': Moist,
                'Soil_Type_enc': Soil_Type_enc, 'Crop_Type_enc': Crop_Type_enc
            }])
            responses['target_n'] = round(float(task3b_n_model.predict(df3b)[0]), 1)
            responses['target_p'] = round(float(task3b_p_model.predict(df3b)[0]), 1)
            responses['target_k'] = round(float(task3b_k_model.predict(df3b)[0]), 1)
            
        # --- Task 4: Salinity Stress ---
        if task4_model:
            df4 = pd.DataFrame([{
                'Nitrogen': N, 'Potassium': K, 'Phosphorous': P,
                'Temparature': Temp, 'Humidity': Hum, 'Moisture': Moist,
                'NPK_sum': NPK_sum, 'Soil_Type_enc': Soil_Type_enc, 'Crop_Type_enc': Crop_Type_enc
            }])
            pred = task4_model.predict(df4)[0]
            responses['salinity_stress'] = "High Stress" if pred == 1 else "Normal"

        return responses

    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"error": str(e)}
