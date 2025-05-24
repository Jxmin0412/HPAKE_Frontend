// DOM Elements - Add null checks when getting elements
const alertSuccess = document.getElementById('alertSuccess');
const alertDanger = document.getElementById('alertDanger');

// Add the missing checkUrlParams function
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('msg') && alertSuccess) {
        showAlert(alertSuccess, 'Operation successful');
    }
    if (urlParams.has('msg1') && alertDanger) {
        showAlert(alertDanger, 'Operation failed');
    }
}

// Add showAlert function that was missing
function showAlert(element, message) {
    if (typeof element === 'string') {
        // If element is a string (element ID), get the element
        element = document.getElementById(element);
    }
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Function to populate users table with real data
async function populateUsersTable() {
    try {
        const response = await fetch('/api/server/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();

        const tableBody = document.getElementById('userTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.secretKey || 'N/A'}</td>
                <td>
                    <button class="action-btn" onclick="sendKey('${user.email}', '${user.secretKey}')">
                        Send Key
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert(alertDanger, 'Failed to load users');
    }
}

// Function to send key to user
async function sendKey(email, key) {
    try {
        const response = await fetch('/api/server/sendKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&key=${encodeURIComponent(key)}`
        });

        const data = await response.json();

        if (data.success) {
            showAlert(alertSuccess, 'Key sent successfully!');
        } else {
            showAlert(alertDanger, data.message || 'Failed to send key');
        }
    } catch (error) {
        console.error('Error sending key:', error);
        showAlert(alertDanger, 'Failed to send key');
    }
}

// Event Listeners - Only add if elements exist
document.addEventListener('DOMContentLoaded', function() {
    checkUrlParams();

    // Scroll reveal animation
    window.addEventListener('scroll', function() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    });

    // Populate users table if we're on the vus page
    if (document.getElementById('userTableBody')) {
        populateUsersTable();
    }
});