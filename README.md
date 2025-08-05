# NeoBank Churn Predictor

A stunning, modern Flask web application for predicting customer churn using machine learning. This application provides an intuitive interface for inputting customer data and receiving AI-powered churn predictions with actionable recommendations.

## Features

- 🎨 **Beautiful Modern UI** - Stunning gradient design with smooth animations
- 🤖 **AI-Powered Predictions** - Uses your trained Logistic Regression model
- 📊 **Interactive Results** - Visual probability meter and detailed recommendations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Real-time Validation** - Form validation and error handling
- 🔄 **Dynamic Updates** - Live form updates and smooth transitions

## Screenshots

The application features:
- Gradient background with glassmorphism effects
- Interactive form with organized sections
- Real-time prediction results with visual indicators
- Responsive design for all devices

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure your model file is present:**
   - Make sure `model.pkl` is in the root directory
   - The model should be trained with the expected features

## Usage

1. **Start the Flask application:**
   ```bash
   python app.py
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

3. **Enter customer data:**
   - Select account type (Standard, Premium, Metal)
   - Fill in personal information (age, last transaction date)
   - Toggle device and location settings
   - Enter transaction data
   - Provide notification statistics

4. **Get predictions:**
   - Click "Predict Churn Risk"
   - View results with probability meter
   - See actionable recommendations

## Model Features

The application expects the following 18 features from your model:

### Account Information
- `is_standard` - Standard account type (0/1)
- `is_premium` - Premium account type (0/1)
- `is_metal` - Metal account type (0/1)

### User Settings
- `user_settings_crypto_unlocked` - Crypto features enabled (0/1)

### Device & Location
- `is_apple` - Apple device user (0/1)
- `is_gb` - United Kingdom user (0/1)
- `is_pl` - Poland user (0/1)
- `is_fr` - France user (0/1)

### Personal Data
- `age` - Customer age (numeric)
- `last_transaction_date` - Date of last transaction

### Transaction Data
- `total_transactions` - Total number of transactions
- `avg_transaction_amount` - Average transaction amount
- `first_month_transactions` - Transactions in first month
- `first_month_active_days` - Active days in first month
- `days_to_first_transaction` - Days until first transaction

### Notification Data
- `notification_success_rate` - Success rate percentage (0-100)
- `total_notifications` - Total notifications sent

## API Endpoints

- `GET /` - Main application interface
- `POST /predict` - Prediction endpoint
- `GET /api/health` - Health check endpoint

## Project Structure

```
neobank_churn_predictor/
├── app.py                 # Main Flask application
├── model.pkl             # Your trained ML model
├── requirements.txt      # Python dependencies
├── README.md            # This file
├── templates/
│   └── index.html       # Main HTML template
└── static/
    ├── css/
    │   └── style.css    # Beautiful CSS styles
    └── js/
        └── script.js    # Interactive JavaScript
```

## Customization

### Styling
- Modify `static/css/style.css` to change colors, fonts, and layout
- The design uses CSS Grid and Flexbox for responsive layouts
- Custom animations and transitions are included

### Functionality
- Edit `static/js/script.js` to modify form behavior
- Update `app.py` to change API logic
- Modify `templates/index.html` to change the interface

### Model Integration
- Ensure your `model.pkl` file is compatible with scikit-learn
- The model should expect the exact feature names listed above
- Update the feature processing in `app.py` if needed

## Troubleshooting

### Common Issues

1. **Model not loading:**
   - Ensure `model.pkl` is in the root directory
   - Check that the model was saved with pickle
   - Verify the model is compatible with scikit-learn

2. **Port already in use:**
   - Change the port in `app.py` line: `app.run(debug=True, host='0.0.0.0', port=5000)`

3. **Dependencies not found:**
   - Run `pip install -r requirements.txt`
   - Ensure you're using Python 3.7+

### Debug Mode

The application runs in debug mode by default. For production:
- Set `debug=False` in `app.py`
- Use a production WSGI server like Gunicorn

## Contributing

Feel free to enhance this application by:
- Adding more visualization options
- Implementing user authentication
- Adding data export functionality
- Creating additional prediction models

## License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Flask, HTML5, CSS3, and JavaScript** 