from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
from datetime import datetime
import numpy as np
import traceback

app = Flask(__name__)

# Load the model
try:
    model = joblib.load('model.pkl')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    traceback.print_exc()
    model = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get form data
        data = request.get_json()
        print(data)
        
        # Create feature vector
        features = {
            'is_standard': int(data.get('is_standard', 0)),
            'is_premium': int(data.get('is_premium', 0)),
            'is_metal': int(data.get('is_metal', 0)),
            'user_settings_crypto_unlocked': int(data.get('user_settings_crypto_unlocked', 0)),
            'is_apple': int(data.get('is_apple', 0)),
            'is_gb': int(data.get('is_gb', 0)),
            'is_pl': int(data.get('is_pl', 0)),
            'is_fr': int(data.get('is_fr', 0)),
            'age': int(data.get('age', 0)),
            'total_transactions': int(data.get('total_transactions', 0)),
            'avg_transaction_amount': float(data.get('avg_transaction_amount', 0)),
            'first_month_transactions': int(data.get('first_month_transactions', 0)),
            'first_month_active_days': int(data.get('first_month_active_days', 0)),
            'days_to_first_transaction': int(data.get('days_to_first_transaction', 0)),
            'notification_success_rate': float(data.get('notification_success_rate', 0)),
            'total_notifications': int(data.get('total_notifications', 0)),
            # 'last_transaction_date': data.get('last_transaction_date', '2019-01-10')
        }
        
        # Convert to DataFrame
        df = pd.DataFrame([features])
        
        # Make prediction
        if model is not None:
            prediction = model.predict(df)[0]
            probability = model.predict_proba(df)[0][1] if prediction == 1 else model.predict_proba(df)[0][0]
            
            return jsonify({
                'success': True,
                'prediction': int(prediction),
                'probability': float(probability),
                'message': 'High churn risk' if prediction == 1 else 'Low churn risk'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 