document.addEventListener('DOMContentLoaded', function() {
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

// Function to show alert message
function showAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (!alert) return;

    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}