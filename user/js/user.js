// Utility functions
const showAlert = (type, message) => {
    const alertSuccess = document.getElementById('alertSuccess');
    const alertDanger = document.getElementById('alertDanger');
    
    if (type === 'success') {
        alertSuccess.textContent = message;
        alertSuccess.style.display = 'block';
        alertDanger.style.display = 'none';
    } else {
        alertDanger.textContent = message;
        alertDanger.style.display = 'block';
        alertSuccess.style.display = 'none';
    }
};

const redirect = (url, delay = 2000) => {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
};

// User Registration
const handleRegistration = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('success', 'Registration successful! Check your email for the secret key.');
            redirect('user.html');
        } else {
            showAlert('error', data.message);
        }
    } catch (error) {
        showAlert('error', 'An error occurred during registration.');
        console.error('Registration error:', error);
    }
};

// User Login
const handleLogin = async (event) => {
    event.preventDefault();
    
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        secretKey: document.getElementById('secretKey').value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showAlert('success', 'Login successful!');
            redirect('user_card.html');
        } else {
            showAlert('error', data.message);
        }
    } catch (error) {
        showAlert('error', 'An error occurred during login.');
        console.error('Login error:', error);
    }
};

// Add Card
const handleAddCard = async (event) => {
    event.preventDefault();

    const formData = {
        cardHolderName: document.getElementById('cardName').value,
        cardNumber: document.getElementById('cardNumber').value,
        cvv: document.getElementById('cvv').value,
        expiryDate: document.getElementById('expiryDate').value
    };

    try {
        const response = await fetch('/api/cards/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', 'Card added successfully!');
            event.target.reset();
            redirect('user_viewmoney.html');
        } else {
            showAlert('error', data.message);
        }
    } catch (error) {
        showAlert('error', 'An error occurred while adding the card.');
        console.error('Add card error:', error);
    }
};

// Load Card Details
const loadCardDetails = async () => {
    try {
        const response = await fetch('/api/cards/user');
        const cards = await response.json();
        
        const tableBody = document.getElementById('moneyTableBody');
        if (cards.length > 0) {
            tableBody.innerHTML = cards.map(card => `
                <tr>
                    <td>${card.cardHolderName}</td>
                    <td>${card.cardNumber.replace(/\d(?=\d{4})/g, "*")}</td>
                    <td>$${card.balance.toFixed(2)}</td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="3">No cards found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading card details:', error);
        showAlert('error', 'Failed to load card details.');
    }
};

// Page Load Handler
document.addEventListener('DOMContentLoaded', () => {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Add event listeners based on current page
    switch (currentPage) {
        case 'userreg.html':
            document.getElementById('registrationForm')?.addEventListener('submit', handleRegistration);
            break;
            
        case 'user.html':
            document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
            break;
            
        case 'user_addcard.html':
            document.getElementById('cardForm')?.addEventListener('submit', handleAddCard);
            break;
            

    }
});