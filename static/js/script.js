document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const resultsContainer = document.getElementById('results');
    const loadingOverlay = document.getElementById('loading');

    // Handle account type radio buttons
    const accountTypeRadios = document.querySelectorAll('input[name="account_type"]');
    accountTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Reset all account type fields
            document.getElementById('is_standard').checked = false;
            document.getElementById('is_premium').checked = false;
            document.getElementById('is_metal').checked = false;
            
            // Set the selected account type
            if (this.value === 'standard') {
                document.getElementById('is_standard').checked = true;
            } else if (this.value === 'premium') {
                document.getElementById('is_premium').checked = true;
            } else if (this.value === 'metal') {
                document.getElementById('is_metal').checked = true;
            }
        });
    });

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        try {
            // Collect form data
            const formData = {
                is_standard: document.querySelector('input[name="account_type"]:checked').value === 'standard' ? 1 : 0,
                is_premium: document.querySelector('input[name="account_type"]:checked').value === 'premium' ? 1 : 0,
                is_metal: document.querySelector('input[name="account_type"]:checked').value === 'metal' ? 1 : 0,
                user_settings_crypto_unlocked: document.getElementById('user_settings_crypto_unlocked').checked ? 1 : 0,
                is_apple: document.getElementById('is_apple').checked ? 1 : 0,
                is_gb: document.getElementById('is_gb').checked ? 1 : 0,
                is_pl: document.getElementById('is_pl').checked ? 1 : 0,
                is_fr: document.getElementById('is_fr').checked ? 1 : 0,
                age: parseInt(document.getElementById('age').value),
                total_transactions: parseInt(document.getElementById('total_transactions').value),
                avg_transaction_amount: parseFloat(document.getElementById('avg_transaction_amount').value),
                first_month_transactions: parseInt(document.getElementById('first_month_transactions').value),
                first_month_active_days: parseInt(document.getElementById('first_month_active_days').value),
                days_to_first_transaction: parseInt(document.getElementById('days_to_first_transaction').value),
                notification_success_rate: parseFloat(document.getElementById('notification_success_rate').value),
                total_notifications: parseInt(document.getElementById('total_notifications').value),
                // last_transaction_date: document.getElementById('last_transaction_date').value
            };

            // Make API call
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                displayResults(result);
            } else {
                showError(result.error || 'An error occurred during prediction');
            }

        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please try again.');
        } finally {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
        }
    });

    function displayResults(result) {
        const predictionCard = document.querySelector('.prediction-card');
        const predictionIcon = document.getElementById('prediction-icon');
        const predictionText = document.getElementById('prediction-text');
        const predictionDescription = document.getElementById('prediction-description');
        const probabilityPercentage = document.getElementById('probability-percentage');
        const probabilityFill = document.getElementById('probability-fill');
        const recommendationsList = document.getElementById('recommendations-list');
        const meterLabel = document.querySelector('.meter-label span');

        // Update prediction card
        if (result.prediction === 1) {
            // High churn risk
            predictionCard.className = 'prediction-card';
            predictionIcon.className = 'fas fa-exclamation-triangle';
            predictionText.textContent = 'High Churn Risk';
            predictionDescription.textContent = 'This customer shows signs of potential churn';
            probabilityFill.className = 'meter-fill';
            if (meterLabel) meterLabel.textContent = 'Churn Probability';
        } else {
            // Low churn risk
            predictionCard.className = 'prediction-card low-risk';
            predictionIcon.className = 'fas fa-check-circle';
            predictionText.textContent = 'Low Churn Risk';
            predictionDescription.textContent = 'This customer appears to be stable';
            probabilityFill.className = 'meter-fill low-risk';
            if (meterLabel) meterLabel.textContent = 'Retention Probability';
        }

        // Update probability
        const probability = (result.probability * 100).toFixed(1);
        probabilityPercentage.textContent = `${probability}%`;
        probabilityFill.style.width = `${probability}%`;

        // Update recommendations based on prediction
        if (result.prediction === 1) {
            recommendationsList.innerHTML = `
                <li>Implement targeted retention campaigns</li>
                <li>Offer personalized incentives and rewards</li>
                <li>Increase engagement through notifications</li>
                <li>Schedule follow-up calls with customer success team</li>
                <li>Consider account upgrade offers</li>
            `;
        } else {
            recommendationsList.innerHTML = `
                <li>Continue current engagement strategies</li>
                <li>Monitor for any changes in behavior patterns</li>
                <li>Maintain regular communication</li>
                <li>Consider upselling opportunities</li>
            `;
        }

        // Show results with animation
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('success-animation');
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        // Remove animation class after animation completes
        setTimeout(() => {
            resultsContainer.classList.remove('success-animation');
        }, 500);
    }

    function showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="error-close">&times;</button>
            </div>
        `;
        
        // Add styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(errorDiv);

        // Add close functionality
        const closeBtn = errorDiv.querySelector('.error-close');
        closeBtn.addEventListener('click', () => {
            errorDiv.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add input validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (this.value !== '' && (value < min || value > max)) {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });

    // Add form validation before submission
    form.addEventListener('input', function() {
        const submitBtn = document.querySelector('.submit-btn');
        const requiredInputs = form.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
            }
        });

        submitBtn.disabled = !isValid;
        submitBtn.style.opacity = isValid ? '1' : '0.6';
    });

    // Initialize form validation
    form.dispatchEvent(new Event('input'));
});

// Add CSS for error notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    }
    
    .error-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style); 