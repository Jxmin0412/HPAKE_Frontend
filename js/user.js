document.addEventListener('DOMContentLoaded', function() {
    // Sample data - replace with actual data from your backend
    const cards = [
        {
            id: 1,
            cardNumber: '**** **** **** 1234',
            cardHolder: 'John Doe',
            expiryDate: '12/25',
            balance: '$5,000'
        }
    ];

    const cardInfo = document.getElementById('cardInfo');

    if (cards.length > 0) {
        cardInfo.innerHTML = cards.map(card => `
            <div class="card-item">
                <h3>Card Information</h3>
                <div class="card-details">
                    <div class="card-detail-item">
                        <span class="detail-label">Card Number</span>
                        <span class="detail-value">${card.cardNumber}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-label">Card Holder</span>
                        <span class="detail-value">${card.cardHolder}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-label">Expiry Date</span>
                        <span class="detail-value">${card.expiryDate}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-label">Current Balance</span>
                        <span class="detail-value">${card.balance}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Handle success/error alerts
    const urlParams = new URLSearchParams(window.location.search);
    const successAlert = document.getElementById('alertSuccess');
    const dangerAlert = document.getElementById('alertDanger');

    if (urlParams.has('success')) {
        successAlert.style.display = 'block';
        setTimeout(() => successAlert.style.display = 'none', 3000);
    }

    if (urlParams.has('error')) {
        dangerAlert.style.display = 'block';
        setTimeout(() => dangerAlert.style.display = 'none', 3000);
    }

    // Initial check for reveal elements
    checkReveal();
    
    // Check for reveal elements on scroll
    window.addEventListener('scroll', checkReveal);

    // Add Money Form Handling
    const addMoneyForm = document.getElementById('addMoneyForm');
    if (addMoneyForm) {
        // Load card holder name from localStorage or session
        const cardHolderName = document.getElementById('cardHolderName');
        if (localStorage.getItem('userName')) {
            cardHolderName.value = localStorage.getItem('userName');
        }

        // Card number formatting and validation
        const cardNumber = document.getElementById('cardNumber');
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            e.target.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        });

        // CVV validation
        const cvv = document.getElementById('cvv');
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });

        // Expiry date formatting and validation
        const expiryDate = document.getElementById('expiryDate');
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });

        // Amount validation
        const amount = document.getElementById('amount');
        amount.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^\d.]/g, '');
        });

        // Form submission
        addMoneyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!validateForm()) return;

            // Here you would typically make an API call to your backend
            // For demo, we'll just show success message
            document.getElementById('alertSuccess').style.display = 'block';
            setTimeout(() => {
                document.getElementById('alertSuccess').style.display = 'none';
                // Redirect after successful addition
                window.location.href = 'user_card.html';
            }, 2000);
        });

        function validateForm() {
            const cardNum = cardNumber.value.replace(/\s/g, '');
            if (cardNum.length !== 16) {
                showError('Please enter a valid 16-digit card number');
                return false;
            }

            if (cvv.value.length !== 3) {
                showError('Please enter a valid 3-digit CVV');
                return false;
            }

            const today = new Date();
            const [month, year] = expiryDate.value.split('/');
            if (!month || !year || month > 12 || 
                new Date(2000 + parseInt(year), month - 1) < today) {
                showError('Please enter a valid expiry date');
                return false;
            }

            if (!amount.value || parseFloat(amount.value) <= 0) {
                showError('Please enter a valid amount');
                return false;
            }

            return true;
        }

        function showError(message) {
            const alertDanger = document.getElementById('alertDanger');
            alertDanger.textContent = message;
            alertDanger.style.display = 'block';
            setTimeout(() => {
                alertDanger.style.display = 'none';
            }, 3000);
        }
    }
});

// Function to show alert messages
function showAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (!alert) return;
    
    alert.style.display = 'block';
    
    // Hide alert after 5 seconds
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

function checkReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Function to fetch and display card money details
async function loadCardMoneyDetails() {
    try {
        // In a real application, this would be an API call
        // For demo purposes, we'll use mock data
        const mockData = {
            cardHolder: localStorage.getItem('username') || 'John Doe',
            cardNumber: '4***********1234',
            balance: '5000.00'
        };

        const tableBody = document.getElementById('moneyTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td>${mockData.cardHolder}</td>
                    <td>${mockData.cardNumber}</td>
                    <td>$${mockData.balance}</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading card money details:', error);
    }
}

// Load card money details when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href.includes('user_viewmoney.html')) {
        loadCardMoneyDetails();
    }
});

// Sample product data (replace with actual data from your backend)
const products = [
    {
        id: 1,
        name: "Sample Product 1",
        description: "Product description here",
        quantity: 10,
        price: 99.99,
        image: "product1.jpg"
    },
    // Add more products as needed
];

// Function to display products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="../Gallery/${product.image}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p class="product-price">$${product.price}</p>
                    <a href="user_products1.html?id=${product.id}" class="purchase-btn">Purchase</a>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
}

// Initialize products when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});

// Show success message if URL contains success parameter
if (new URLSearchParams(window.location.search).get('msg')) {
    alert('User Login Successfully');
}

// Show error message if URL contains error parameter
if (new URLSearchParams(window.location.search).get('msg1')) {
    alert('Login Failed');
}

// Function to populate purchase form with product details
function populatePurchaseForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productName = urlParams.get('pname');
    const productDesc = urlParams.get('pdes');
    const productPrice = urlParams.get('pprice');

    if (document.getElementById('purchaseForm')) {
        document.getElementById('productId').value = productId;
        document.getElementById('productName').value = productName;
        document.getElementById('productDesc').value = productDesc;
        document.getElementById('productPrice').value = productPrice;
    }
}

// Handle purchase form submission
function handlePurchaseSubmit(event) {
    if (event.target.id === 'purchaseForm') {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const quantity = formData.get('quan');
        
        if (!quantity) {
            alert('Please select a quantity');
            return;
        }

        // Here you would typically make an API call to process the purchase
        // For now, we'll simulate with a redirect
        window.location.href = 'user_products2.html?' + new URLSearchParams(formData).toString();
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populatePurchaseForm();
    
    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchaseSubmit);
    }

    const quantitySelect = document.getElementById('quantity');
    if (quantitySelect) {
        quantitySelect.addEventListener('change', calculateTotal);
    }

    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', (e) => formatExpiryDate(e.target));
    }
});

function calculateTotal() {
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const total = price * quantity;
    document.getElementById('totalCost').value = total.toFixed(2);
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;
}