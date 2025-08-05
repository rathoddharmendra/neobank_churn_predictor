import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Create a simple test model
print("Creating test model...")

# Create sample training data with the expected features
np.random.seed(42)
n_samples = 1000

# Generate synthetic data for all 18 features
data = {
    'is_standard': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
    'is_premium': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
    'is_metal': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
    'user_settings_crypto_unlocked': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
    'is_apple': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
    'is_gb': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
    'is_pl': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
    'is_fr': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
    'age': np.random.randint(18, 80, n_samples),
    'total_transactions': np.random.randint(1, 100, n_samples),
    'avg_transaction_amount': np.random.uniform(10, 500, n_samples),
    'first_month_transactions': np.random.randint(1, 30, n_samples),
    'first_month_active_days': np.random.randint(1, 31, n_samples),
    'days_to_first_transaction': np.random.randint(0, 30, n_samples),
    'notification_success_rate': np.random.uniform(50, 100, n_samples),
    'total_notifications': np.random.randint(0, 50, n_samples),
    'last_transaction_date': pd.date_range('2019-01-01', '2023-12-31', periods=n_samples)
}

# Create target variable (churn)
# Higher churn probability for certain conditions
churn_prob = (
    (data['is_standard'] * 0.3) +
    (data['is_premium'] * 0.1) +
    (data['is_metal'] * 0.05) +
    (data['total_transactions'] < 10) * 0.4 +
    (data['avg_transaction_amount'] < 50) * 0.3 +
    (data['notification_success_rate'] < 70) * 0.2 +
    (data['days_to_first_transaction'] > 7) * 0.3
)

# Normalize to 0-1 range
churn_prob = np.clip(churn_prob, 0, 1)
data['is_churned'] = np.random.binomial(1, churn_prob)

# Create DataFrame
df = pd.DataFrame(data)

# Prepare features for training (exclude target and date)
feature_columns = [
    'is_standard', 'is_premium', 'is_metal', 'user_settings_crypto_unlocked',
    'is_apple', 'is_gb', 'is_pl', 'is_fr', 'age', 'total_transactions',
    'avg_transaction_amount', 'first_month_transactions', 'first_month_active_days',
    'days_to_first_transaction', 'notification_success_rate', 'total_notifications'
]

X = df[feature_columns]
y = df['is_churned']

# Create and train the model
model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X, y)

# Save the model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f, protocol=pickle.HIGHEST_PROTOCOL)

print("Test model created and saved as 'model.pkl'")
print(f"Model trained on {len(X)} samples")
print(f"Features: {list(X.columns)}")
print(f"Churn rate in training data: {y.mean():.2%}")

# Test the model with sample data
sample_data = {
    'is_standard': 1, 'is_premium': 0, 'is_metal': 0,
    'user_settings_crypto_unlocked': 0, 'is_apple': 0, 'is_gb': 0, 'is_pl': 0, 'is_fr': 0,
    'age': 34, 'total_transactions': 27, 'avg_transaction_amount': 68.83,
    'first_month_transactions': 26, 'first_month_active_days': 13,
    'days_to_first_transaction': 1, 'notification_success_rate': 100.0, 'total_notifications': 5
}

sample_df = pd.DataFrame([sample_data])
prediction = model.predict(sample_df)[0]
probability = model.predict_proba(sample_df)[0][1] if prediction == 1 else model.predict_proba(sample_df)[0][0]

print(f"\nTest prediction for sample data:")
print(f"Prediction: {'High churn risk' if prediction == 1 else 'Low churn risk'}")
print(f"Probability: {probability:.2%}") 