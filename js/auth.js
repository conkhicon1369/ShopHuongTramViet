// ==================== AUTH.JS ====================

const MOCK_USERS = [
    {
        id: 1,
        name: 'Quản Trị Viên',
        email: 'admin@huongtramviet.com',
        password: 'admin123',
        phone: '0901 000 001',
        role: 'admin',
        status: 'active',
        spending: 0,
        joined: '2023-01-01'
    },
    {
        id: 2,
        name: 'Nguyễn Văn A',
        email: 'user@email.com',
        password: '123456',
        phone: '0901 234 567',
        role: 'user',
        status: 'active',
        spending: 2400000,
        joined: '2023-03-22'
    }
];

function getAllUsers() {
    const stored = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const merged = [...MOCK_USERS];
    stored.forEach(su => {
        if (!merged.find(u => u.email === su.email)) merged.push(su);
    });
    return merged;
}

function saveRegisteredUser(user) {
    const stored = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    stored.push(user);
    localStorage.setItem('registeredUsers', JSON.stringify(stored));
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    let fb = field.parentElement.querySelector('.invalid-feedback');
    if (!fb) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        field.parentElement.appendChild(fb);
    }
    fb.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    document.querySelectorAll('.form-alert').forEach(el => el.remove());
}

function showFormAlert(formId, message, type = 'danger') {
    const form = document.getElementById(formId);
    let old = form.querySelector('.form-alert');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = `alert alert-${type} form-alert mt-3 mb-0`;
    div.innerHTML = `<i class="bi bi-${type === 'danger' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>${message}`;
    form.appendChild(div);
    if (type !== 'danger') setTimeout(() => div.remove(), 4000);
}

// LOGIN
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    let ok = true;
    if (!email)    { showFieldError('loginEmail', 'Vui lòng nhập email'); ok = false; }
    if (!password) { showFieldError('loginPassword', 'Vui lòng nhập mật khẩu'); ok = false; }
    if (!ok) return;

    const user = getAllUsers().find(u => u.email === email && u.password === password);

    if (!user) {
        showFormAlert('loginForm', 'Email hoặc mật khẩu không đúng.');
        return;
    }
    if (user.status === 'locked') {
        showFormAlert('loginForm', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.');
        return;
    }

    const session = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
    localStorage.setItem('currentUser', JSON.stringify(session));
    if (!remember) sessionStorage.setItem('currentUser', JSON.stringify(session));

    showFormAlert('loginForm', 'Đăng nhập thành công! Đang chuyển hướng...', 'success');

    setTimeout(() => {
        window.location.href = user.role === 'admin' ? 'account.html' : 'index.html';
    }, 1000);
});

// REGISTER
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const name    = document.getElementById('registerName').value.trim();
    const email   = document.getElementById('registerEmail').value.trim().toLowerCase();
    const phone   = document.getElementById('registerPhone').value.trim();
    const pw      = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirmPassword').value;
    const agree   = document.getElementById('agreeTerms').checked;

    let ok = true;
    if (!name)                               { showFieldError('registerName', 'Vui lòng nhập họ tên'); ok = false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { showFieldError('registerEmail', 'Email không hợp lệ'); ok = false; }
    if (!phone || !/^0\d{9}$/.test(phone.replace(/\s/g, ''))) { showFieldError('registerPhone', 'Số điện thoại không hợp lệ (VD: 0901234567)'); ok = false; }
    if (!pw || pw.length < 6)               { showFieldError('registerPassword', 'Mật khẩu tối thiểu 6 ký tự'); ok = false; }
    if (pw !== confirm)                      { showFieldError('registerConfirmPassword', 'Mật khẩu xác nhận không khớp'); ok = false; }
    if (!agree)                              { showFormAlert('registerForm', 'Vui lòng đồng ý với điều khoản'); return; }
    if (!ok) return;

    const users = getAllUsers();
    if (users.find(u => u.email === email)) {
        showFieldError('registerEmail', 'Email này đã được đăng ký');
        return;
    }

    saveRegisteredUser({
        id: Date.now(), name, email, phone, password: pw,
        role: 'user', status: 'active', spending: 0,
        joined: new Date().toISOString().split('T')[0]
    });

    showFormAlert('registerForm', 'Đăng ký thành công! Chuyển sang đăng nhập...', 'success');
    setTimeout(() => {
        showLoginForm();
        document.getElementById('loginEmail').value = email;
    }, 1500);
});

// DEMO HINT
window.addEventListener('DOMContentLoaded', () => {
    const hint = document.createElement('div');
    hint.className = 'mt-3 p-3 rounded-3 text-center';
    hint.style.cssText = 'background:#fff8f0; font-size:0.8rem; border:1px dashed #cd853f;';
    hint.innerHTML = `
        <div class="fw-bold mb-1" style="color:var(--primary-color);">🔑 Tài khoản demo</div>
        <div class="text-muted mb-1">Admin: <kbd>admin@huongtramviet.com</kbd> / <kbd>admin123</kbd></div>
        <div class="text-muted">User: <kbd>user@email.com</kbd> / <kbd>123456</kbd></div>
    `;
    document.getElementById('loginForm').appendChild(hint);
});