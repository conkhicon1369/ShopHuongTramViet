// ==================== COMMON.JS ====================

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function requireAuth() {
    const user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return null; }
    return user;
}

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function updateNavbar() {
    const user    = getCurrentUser();
    const guestEl = document.getElementById('guestSection');
    const userEl  = document.getElementById('userSection');
    const nameEl  = document.getElementById('userNameDisplay');
    if (user) {
        if (guestEl) guestEl.style.display = 'none';
        if (userEl)  userEl.style.display  = 'block';
        if (nameEl)  nameEl.textContent    = user.name;
    } else {
        if (guestEl) guestEl.style.display = 'block';
        if (userEl)  userEl.style.display  = 'none';
    }
}

function updateCartBadge() {
    const cart  = JSON.parse(localStorage.getItem('cart') || '[]');
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    badge.textContent    = total;
    badge.style.display  = total > 0 ? 'inline' : 'none';
}

function formatCurrency(val) {
    if (!val) return '0đ';
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M đ';
    return val.toLocaleString('vi-VN') + 'đ';
}

function formatDate(str) {
    if (!str) return '';
    const p = str.split('-');
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : str;
}

function showToast(msg, type = 'success') {
    const el = document.getElementById('toastMsg');
    const tx = document.getElementById('toastText');
    if (!el || !tx) return;
    el.className    = `toast align-items-center text-bg-${type} border-0`;
    tx.textContent  = msg;
    new bootstrap.Toast(el, { delay: 3000 }).show();
}

window.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateCartBadge();
});