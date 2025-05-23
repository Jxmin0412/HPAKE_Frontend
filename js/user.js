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
                redirect('user_card.html')
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
async function purchaseProduct(productId) {
    try {
        // First store the product ID
        localStorage.setItem('selectedProductId', productId);

        // Make the API call
        const response = await fetch(`/api/products/purchase/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            // Redirect to purchase confirmation page
            window.location.href = 'user_products1.html';
        } else {
            showAlert('error', data.message || 'Purchase failed');
        }
    } catch (error) {
        console.error('Error purchasing product:', error);
        showAlert('error', 'Error occurred while purchasing product');
    }
}
async function loadUserCart() {
    const cartTable = document.getElementById('cartTable');
    if (!cartTable) return;

    try {
        const response = await fetch('/api/cart/items');
        if (!response.ok) throw new Error('Failed to fetch cart items');

        const cartItems = await response.json();
        cartTable.innerHTML = ''; // Clear existing content

        if (cartItems.length === 0) {
            cartTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Your cart is empty</td>
                </tr>`;
            return;
        }

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            const imageSrc = item.imageBase64
                ? `data:image/jpeg;base64,${item.imageBase64}`
                : '';

            row.innerHTML = `
                <td>${item.id}</td>
                <td>
                    ${imageSrc ?
                `<img src="${imageSrc}" alt="${item.name}" 
                            class="product-image" style="max-width: 100px;">` :
                'No Image'}
                </td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.totalCost.toFixed(2)}</td>
            `;
            cartTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Failed to load cart items');
    }
}
async function handleStoredProduct() {
    // Get data from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || localStorage.getItem('selectedProductId');

    if (!productId) {
        window.location.href = 'user_products.html';
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();
        if (!product) {
            throw new Error('Product data is empty');
        }

        // Populate form fields
        const productIdField = document.getElementById('productId');
        const productNameField = document.getElementById('productName');
        const productDescField = document.getElementById('productDesc');
        const productPriceField = document.getElementById('productPrice');
        const quantityField = document.getElementById('quantity');
        const totalCostField = document.getElementById('totalCost');
        const cardNumberField = document.getElementById('cardNumber');
        const expiryDateField = document.getElementById('expiryDate');
        const cvvField = document.getElementById('cvv');

        if (productIdField) productIdField.value = product.id;
        if (productNameField) productNameField.value = product.name;
        if (productDescField) productDescField.value = product.description;
        if (productPriceField) productPriceField.value = product.price.toFixed(2);

        // Handle quantity change and total cost calculation
        if (quantityField && totalCostField && productPriceField) {
            // Initial calculation
            const calculateTotal = () => {
                const quantity = parseInt(quantityField.value) || 0;
                const price = parseFloat(productPriceField.value) || 0;
                totalCostField.value = (quantity * price).toFixed(2);
            };

            // Calculate initial total
            calculateTotal();

            // Add event listeners for both input and change events
            quantityField.addEventListener('input', calculateTotal);
            quantityField.addEventListener('change', calculateTotal);
        }

        // Handle form submission
        const purchaseForm = document.getElementById('purchaseForm');
        if (purchaseForm) {
            purchaseForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Validate form data
                const quantity = parseInt(quantityField.value);
                if (!quantity || quantity <= 0) {
                    showAlert('error', 'Please enter a valid quantity');
                    return;
                }

                const formData = {
                    productId: product.id,
                    quantity: quantity,
                    totalCost: parseFloat(totalCostField.value),
                    cardNumber: cardNumberField.value,
                    expiryDate: expiryDateField.value,
                    cvv: cvvField.value
                };

                try {
                    const response = await fetch('/api/purchase/confirm', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();
                    if (data.success) {
                        showAlert('success', 'Purchase successful!');
                        // Clear localStorage
                        localStorage.removeItem('selectedProductId');
                        // Redirect after successful purchase
                        setTimeout(() => {
                            window.location.href = 'user_cart.html';
                        }, 1500);
                    } else {
                        showAlert('error', data.message || 'Purchase failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('error', 'Error processing purchase');
                }
            });
        }

    } catch (error) {
        console.error('Error loading product details:', error);
        showAlert('error', 'Error loading product details');
        window.location.href = 'user_products.html';
    }
    if (data.success) {
        try {
            await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity,
                    totalCost: product.price * quantity
                })
            });

            showAlert('success', 'Purchase successful! Added to cart.');
            setTimeout(() => {
                window.location.href = 'user_cart.html';
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Failed to add item to cart');
        }
    }

}

// Update your DOMContentLoaded event listener to use handleStoredProduct
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    // ...existing switch statement code...

    if (currentPage === 'user_products1.html') {
        handleStoredProduct();
    }
});


// Update your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

});    // Add event listeners based on current page

// Page Load Handler
    document.addEventListener('DOMContentLoaded', () => {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'user_card.html') {
            loadCardDetails();
        }
        // Product related functions
        const loadProducts = async () => {
            const productsTable = document.getElementById('productsTable');
            if (!productsTable) return;

            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                productsTable.innerHTML = ''; // Clear previous entries

                data.forEach(product => {
                    const row = document.createElement('tr');
                    const imageSrc = product.imageBase64
                        ? `data:image/jpeg;base64,${product.imageBase64}`
                        : '';

                    row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    ${imageSrc ?
                        `<img src="${imageSrc}" alt="${product.name}" class="product-image" style="max-width: 100px;">` :
                        'No Image'}
                </td>
                <td>${product.name || 'N/A'}</td>
                <td>${product.description || 'No description'}</td>
                <td>$${product.price?.toFixed(2) || '0.00'}</td>
                <td>${product.quantity || 0}</td>
                <td>
                    <button class="purchase-btn" 
                            onclick="purchaseProduct(${product.id})"
                            ${product.quantity <= 0 ? 'disabled' : ''}>
                        ${product.quantity <= 0 ? 'Out of Stock' : 'Purchase'}
                    </button>
                </td>
            `;

                    productsTable.appendChild(row);
                });

                if (!data.length) {
                    productsTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">No products available</td>
                </tr>`;
                }
            } catch (error) {
                console.error('Error loading products:', error);
                productsTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: red;">
                    Error loading products: ${error.message}
                </td>
            </tr>`;
                showAlert('error', 'Failed to load products. Please try again.');
            }
        };
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
            case 'user_products.html':
                loadProducts();
                break;
            // In your DOMContentLoaded event listener switch statement
            case 'user_products1.html':
                const storedProductId = localStorage.getItem('selectedProductId');
                if (storedProductId) {
                    // Get product details and populate the form
                    fetch(`/api/products/${storedProductId}`)
                        .then(response => response.json())
                        .then(product => {
                            document.getElementById('productId').value = product.id;
                            document.getElementById('productName').value = product.name;
                            document.getElementById('productDesc').value = product.description;
                            document.getElementById('productPrice').value = product.price;
                        })
                        .catch(error => {
                            console.error('Error loading product details:', error);
                            showAlert('error', 'Error loading product details');
                        });
                } else {
                    // Redirect back to products page if no product ID is stored
                    window.location.href = 'user_products.html';
                }
                break;
            case 'user_cart.html':
                loadUserCart();
                break;
        }

    });

window.purchaseProduct = purchaseProduct;