// ==================== AUTHENTICATION JAVASCRIPT ====================

// Show/Hide forms
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'warning');
        return;
    }
    
    // Check user credentials
    const user = StorageManager.findUser(email, password);
    
    if (user) {
        // Login successful
        StorageManager.setCurrentUser(user);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showNotification('Đăng nhập thành công!', 'success');
        
        // Check if there's a redirect URL (from cart/checkout)
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        
        // Redirect after 1 second
        setTimeout(() => {
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        showNotification('Email hoặc mật khẩu không đúng', 'danger');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ', 'danger');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showNotification('Số điện thoại không hợp lệ', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp', 'danger');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'warning');
        return;
    }
    
    // Check if email already exists
    const users = StorageManager.getUsers();
    if (users.find(u => u.email === email)) {
        showNotification('Email đã được sử dụng', 'danger');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    // Save user
    StorageManager.addUser(newUser);
    
    // Auto login
    StorageManager.setCurrentUser(newUser);
    
    showNotification('Đăng ký thành công!', 'success');
    
    // Check if there's a redirect URL (from cart/checkout)
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    
    // Redirect after 1 second
    setTimeout(() => {
        if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } else {
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Validation helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9]{10,11}$/.test(phone);
}

// Logout function
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        StorageManager.logout();
        showNotification('Đã đăng xuất', 'success');
    }
}

// Initialize auth page
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Check if already logged in
    const currentUser = StorageManager.getCurrentUser();
    if (currentUser && window.location.pathname.includes('login.html')) {
        // Check if there's a redirect URL
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } else {
            window.location.href = 'index.html';
        }
    }
    
    // Initialize with default account for testing
    const users = StorageManager.getUsers();
    if (users.length === 0) {
        // Add a default test account
        StorageManager.addUser({
            id: 1,
            name: 'Người Dùng Demo',
            email: 'demo@huongtramviet.com',
            phone: '0901234567',
            password: '123456',
            createdAt: new Date().toISOString()
        });
        console.log('Demo account created: demo@huongtramviet.com / 123456');
    }
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { handleLogin, handleRegister, logout };
}