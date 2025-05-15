// DOM Elements
const cardForm = document.getElementById('cardForm');
const alertSuccess = document.getElementById('alertSuccess');
const alertDanger = document.getElementById('alertDanger');
const cardNumber = document.getElementById('cardNumber');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    checkUrlParams();

    // Parse URL parameters to show alerts
    const urlParams = new URLSearchParams(window.location.search);

    // Check for success message (m1 parameter)
    if (urlParams.has('m1')) {
        const alertSuccess = document.getElementById('alertSuccess');
        alertSuccess.style.display = 'block';

        setTimeout(function() {
            alertSuccess.style.display = 'none';
        }, 5000);
    }

    // Check for failure message (m2 parameter)
    if (urlParams.has('m2')) {
        const alertDanger = document.getElementById('alertDanger');
        alertDanger.style.display = 'block';

        setTimeout(function() {
            alertDanger.style.display = 'none';
        }, 5000);
    }

    // Form validation
    const serverLoginForm = document.getElementById('serverLoginForm');
    if (serverLoginForm) {
        serverLoginForm.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                event.preventDefault();
                const alertDanger = document.getElementById('alertDanger');
                alertDanger.textContent = 'Please fill in all required fields';
                alertDanger.style.display = 'block';

                setTimeout(function() {
                    alertDanger.style.display = 'none';
                }, 5000);
            }
        });
    }

    // Scroll reveal animation
    window.addEventListener('scroll', function() {
        const reveals = document.querySelectorAll('.reveal');

        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    });

    // Populate users table if we're on the vus page
    if (document.getElementById('userTableBody')) {
        populateUsersTable();
    }
});

cardNumber.addEventListener('keypress', isNumber);
cardForm.addEventListener('submit', handleFormSubmit);

// Check URL parameters for success/failure messages
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('msg')) {
        showAlert(alertSuccess);
    }

    if (urlParams.has('msg1')) {
        showAlert(alertDanger);
    }
}

// Show alert and hide after 5 seconds
function showAlert(alertElement) {
    alertElement.style.display = 'block';
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}

// Input validation for numbers only
function isNumber(evt) {
    evt = evt || window.event;
    const charCode = evt.which || evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
        return false;
    }
    return true;
}

// Form validation and submission
function handleFormSubmit(e) {
    e.preventDefault();

    if (cardNumber.value === "") {
        alert("Please enter your Card Number");
        return false;
    }

    if (cardNumber.value.length !== 16) {
        alert("Card Number is not valid. Please enter a 16-digit Card Number.");
        return false;
    }

    // If validation passes, submit the form
    this.submit();
}

// Function to populate users table with mock data
function populateUsersTable() {
    const mockData = [
        {
            username: 'user1',
            email: 'user1@example.com',
            data: 'Sample Data 1',
            key: 'KEY123'
        },
        {
            username: 'user2',
            email: 'user2@example.com',
            data: 'Sample Data 2',
            key: 'KEY456'
        }
        // Add more mock data as needed
    ];

    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    mockData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.data}</td>
            <td>${user.key}</td>
            <td>
                <button class="action-btn" onclick="sendKey('${user.email}', '${user.key}')">
                    Send Key
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to send key (mock implementation)
async function sendKey(email, key) {
    try {
        // Mock API call
        const response = await fetch('/api/sendKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, key })
        });

        if (response.ok) {
            showAlert('alertSuccess');
        } else {
            showAlert('alertDanger');
        }
    } catch (error) {
        console.error('Error sending key:', error);
        showAlert('alertDanger');
    }
}
// ...existing code...

// Add server login handling function
async function handleServerLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('serverPassword').value.trim();

    if (!username || !password) {
        const alertDanger = document.getElementById('alertDanger');
        alertDanger.textContent = 'Please fill in all required fields';
        alertDanger.style.display = 'block';
        setTimeout(() => alertDanger.style.display = 'none', 5000);
        return;
    }

    try {
        const response = await fetch('/api/server/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            const alertSuccess = document.getElementById('alertSuccess');
            alertSuccess.textContent = data.message;
            alertSuccess.style.display = 'block';

            // Redirect after showing success message
            setTimeout(() => {
                window.location.href = '/' + data.redirectUrl;
            }, 1000);
        } else {
            const alertDanger = document.getElementById('alertDanger');
            alertDanger.textContent = data.message;
            alertDanger.style.display = 'block';
            setTimeout(() => alertDanger.style.display = 'none', 5000);
        }
    } catch (error) {
        console.error('Login error:', error);
        const alertDanger = document.getElementById('alertDanger');
        alertDanger.textContent = 'An error occurred during login';
        alertDanger.style.display = 'block';
        setTimeout(() => alertDanger.style.display = 'none', 5000);
    }
}

// ...existing code...

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isNumber,
        handleFormSubmit,
        showAlert
    };
}