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
            redirect('user_card.html');
        } else {
            showAlert('error', data.message);
        }
    } catch (error) {
        showAlert('error', 'An error occurred while adding the card.');
        console.error('Add card error:', error);
    }
};

// Load Card Details
// ...existing code...

const loadCardDetails = async () => {
    const cardDetailsSection = document.querySelector('.card-info');
    if (!cardDetailsSection) return;

    try {
        const response = await fetch('/api/cards/user');
        const data = await response.json();

        if (data.success && data.cards && data.cards.length > 0) {
            const cardsHtml = data.cards.map(card => `
                <div class="card mb-3">
                    <div class="card-body">
                        
                        <div class="card-info">
                            <p><strong>Card Holder:</strong> ${card.cardHolderName}</p>
                            <p><strong>Card Number:</strong> ${maskCardNumber(card.cardNumber)}</p>
                            <p><strong>Expiry Date:</strong> ${card.expiryDate}</p>
                            <p><strong>Balance:</strong> $${card.balance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            cardDetailsSection.innerHTML = cardsHtml;
        } else {
            cardDetailsSection.innerHTML = '<div class="alert alert-info">No cards found</div>';
        }
    } catch (error) {
        console.error('Error loading card details:', error);
        cardDetailsSection.innerHTML = '<div class="alert alert-danger">Error loading card details</div>';
    }
};

const maskCardNumber = (cardNumber) => {
    return `****${cardNumber.slice(-4)}`;
};

function addMoney(event) {
    event.preventDefault();

    const formData = {
        cardNumber: document.getElementById('cardNumber').value,
        cardHolderName: document.getElementById('cardHolderName').value,
        cvv: document.getElementById('cvv').value,
        expiryDate: document.getElementById('expiryDate').value,
        amount: parseFloat(document.getElementById('amount').value)
    };

    fetch('/api/money/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Money added successfully!');
                // Update the balance in the cards list
                updateCardBalance(data.card);
                // Clear the form
                document.getElementById('addMoneyForm').reset();
            } else {
                showAlert('error',data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add money. Please try again.');
        });
}

function updateCardBalance(updatedCard) {
    // Get all card elements
    const cardElements = document.querySelectorAll('.card-info');

    // Find the card element that contains the matching card number
    cardElements.forEach(cardElement => {
        const cardNumberElement = cardElement.querySelector('.card-text');
        if (cardNumberElement && cardNumberElement.textContent.includes(updatedCard.cardNumber)) {
            // Find and update the balance element
            const balanceElement = cardElement.querySelector('.card-text:last-child');
            if (balanceElement) {
                balanceElement.textContent = `Balance: $${updatedCard.balance.toFixed(2)}`;
            }
        }
    });
}
// Page Load Handler
    document.addEventListener('DOMContentLoaded', () => {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'user_card.html') {
            loadCardDetails();
        }

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

            case 'user_addmoney.html':
                document.getElementById('addMoneyForm')?.addEventListener('submit', addMoney);
                break;

        }

    });