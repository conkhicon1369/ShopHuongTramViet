// ==================== ACCOUNT.JS ====================

// ---- MOCK DATA ----
const MOCK_ACCOUNTS = [
    { id:1,  name:'Quản Trị Viên',  email:'admin@huongtramviet.com', phone:'0901 000 001', role:'admin', status:'active', spending:0,        joined:'2023-01-01' },
    { id:2,  name:'Nguyễn Văn A',   email:'user@email.com',          phone:'0901 234 567', role:'user',  status:'active', spending:2400000,  joined:'2023-03-22' },
    { id:3,  name:'Trần Thị Bích',  email:'bich@email.com',          phone:'0902 345 678', role:'user',  status:'active', spending:5800000,  joined:'2023-04-10' },
    { id:4,  name:'Lê Văn Cường',   email:'cuong@email.com',         phone:'0903 456 789', role:'user',  status:'locked', spending:1200000,  joined:'2023-05-15' },
    { id:5,  name:'Phạm Thị Dung',  email:'dung@email.com',          phone:'0904 567 890', role:'user',  status:'active', spending:9100000,  joined:'2023-06-01' },
    { id:6,  name:'Hoàng Minh Tú',  email:'tu@email.com',            phone:'0905 678 901', role:'user',  status:'active', spending:3400000,  joined:'2023-07-20' },
    { id:7,  name:'Võ Thị Thu',     email:'thu@email.com',           phone:'0906 789 012', role:'user',  status:'locked', spending:700000,   joined:'2023-08-05' },
    { id:8,  name:'Đặng Văn Hùng',  email:'hung@email.com',          phone:'0907 890 123', role:'user',  status:'active', spending:4600000,  joined:'2023-09-11' },
];

const MOCK_EMAILS = [
    { id:1, from:'khach1@email.com', name:'Nguyễn Minh Khoa', subject:'Hỏi về sản phẩm nhang trầm Huế', body:'Xin chào, tôi muốn hỏi về sản phẩm nhang trầm Huế. Sản phẩm có được giao đến Hà Nội không? Giá có bao gồm phí vận chuyển không? Xin cảm ơn.', date:'15/01/2024 09:30', unread:true },
    { id:2, from:'khach2@email.com', name:'Trần Thị Bích',    subject:'Phản hồi về đơn hàng #ORD-2024-002', body:'Tôi đã nhận được đơn hàng nhưng bao bì bị móp một chút. Mong shop xem lại cách đóng gói giúp tôi. Đơn hàng mã #ORD-2024-002, đặt ngày 14/01.', date:'14/01/2024 14:15', unread:true },
    { id:3, from:'khach3@email.com', name:'Lê Văn Cường',     subject:'Yêu cầu xuất hóa đơn VAT', body:'Nhờ shop xuất hóa đơn VAT cho đơn hàng #ORD-2024-003 trị giá 300.000đ. Thông tin: Công ty TNHH ABC, MST: 0123456789, địa chỉ: 100 Lý Thường Kiệt, Hà Nội.', date:'13/01/2024 11:00', unread:true },
    { id:4, from:'khach4@email.com', name:'Phạm Thị Dung',    subject:'Cảm ơn shop', body:'Cảm ơn shop đã giao hàng nhanh và đóng gói rất đẹp. Sản phẩm thơm tuyệt vời, gia đình tôi rất thích. Sẽ ủng hộ shop thường xuyên!', date:'12/01/2024 16:45', unread:false },
    { id:5, from:'khach5@email.com', name:'Hoàng Minh Tú',    subject:'Hỏi về chương trình khuyến mãi Tết', body:'Shop có chương trình khuyến mãi Tết không? Tôi muốn đặt số lượng lớn để làm quà biếu cho khách hàng và đối tác.', date:'11/01/2024 08:20', unread:false },
];

const MY_TRANSACTIONS = [
    { id:'ORD-2024-001', date:'15/01/2024', desc:'Nhang Trầm Huế x2, Nụ Trầm x1', amount:850000,  type:'buy' },
    { id:'ORD-2023-015', date:'28/12/2023', desc:'Nhang Vòng x3, Trầm Hương x1',  amount:620000,  type:'buy' },
    { id:'ORD-2023-012', date:'10/12/2023', desc:'Trầm Hương Loại A x1',           amount:480000,  type:'buy' },
    { id:'ORD-2023-009', date:'22/11/2023', desc:'Nhang Trầm Hương x5',            amount:275000,  type:'refund' },
    { id:'ORD-2023-006', date:'05/11/2023', desc:'Bộ Nhang Quà Tặng x1',           amount:195000,  type:'buy' },
];

// ---- STATE ----
let allAccounts = [...MOCK_ACCOUNTS];
let allEmails   = [...MOCK_EMAILS];
let nextAccId   = 9;
let currentUser = null;

// ---- BOOT ----
window.addEventListener('DOMContentLoaded', () => {
    currentUser = getCurrentUser();
    if (!currentUser) { window.location.href = 'login.html'; return; }

    // Merge registered users from auth.js
    const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registered.forEach(u => {
        if (!allAccounts.find(a => a.email === u.email)) {
            allAccounts.push({ id: nextAccId++, name: u.name, email: u.email, phone: u.phone || '', role: u.role || 'user', status: 'active', spending: 0, joined: u.joined || new Date().toISOString().split('T')[0] });
        }
    });

    // Fill sidebar
    document.getElementById('sidebarName').textContent = currentUser.name;

    if (currentUser.role === 'admin') {
        document.getElementById('sidebarAvatar').innerHTML    = '<i class="bi bi-shield-fill-check"></i>';
        document.getElementById('sidebarRoleLabel').textContent = 'Quản trị viên';
        document.getElementById('navAdmin').style.display      = 'flex';
        document.getElementById('navAdmin').style.flexDirection = 'column';
        initAdmin();
        showPanel('dashboard');
    } else {
        document.getElementById('sidebarRoleLabel').textContent = 'Người dùng';
        document.getElementById('navUser').style.display        = 'flex';
        document.getElementById('navUser').style.flexDirection  = 'column';
        initUser();
        showPanel('profile');
    }

    // Sidebar nav click
    document.querySelectorAll('.sidebar-nav a[data-panel]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showPanel(link.dataset.panel, link);
        });
    });

    // Admin: "View all emails" from dashboard
    const btnAllEmails = document.getElementById('btnViewAllEmails');
    if (btnAllEmails) btnAllEmails.addEventListener('click', e => { e.preventDefault(); showPanel('emails'); });
});

// ---- PANEL SWITCH ----
function showPanel(name, clickedLink) {
    document.querySelectorAll('.acc-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));

    const panelMap = { profile:'panelProfile', history:'panelHistory', dashboard:'panelDashboard', accounts:'panelAccounts', emails:'panelEmails' };
    const panel = document.getElementById(panelMap[name]);
    if (panel) panel.classList.add('active');

    if (clickedLink) {
        clickedLink.classList.add('active');
    } else {
        // Activate matching link
        document.querySelectorAll(`.sidebar-nav a[data-panel="${name}"]`).forEach(a => a.classList.add('active'));
    }
}

// ============================================================
//  USER LOGIC
// ============================================================
function initUser() {
    const u = currentUser;
    // Profile
    document.getElementById('profileDisplayName').textContent  = u.name;
    document.getElementById('profileDisplayEmail').textContent = u.email;
    document.getElementById('editName').value    = u.name;
    document.getElementById('editPhone').value   = u.phone  || '';
    document.getElementById('editEmail').value   = u.email;
    document.getElementById('editAddress').value = u.address || '';

    // Order count & spending from transactions
    const buys = MY_TRANSACTIONS.filter(t => t.type === 'buy');
    document.getElementById('profileOrderCount').textContent = buys.length;
    document.getElementById('profileSpending').textContent   = formatCurrency(buys.reduce((s, t) => s + t.amount, 0));

    // History stats
    document.getElementById('histTotal').textContent    = buys.length;
    document.getElementById('histSpend').textContent    = formatCurrency(buys.reduce((s, t) => s + t.amount, 0));
    document.getElementById('histProducts').textContent = buys.reduce((s, t) => s + t.desc.split(',').length, 0);
    renderTransactions();

    // Buttons
    document.getElementById('btnSaveProfile').addEventListener('click', saveProfile);
    document.getElementById('btnChangePw').addEventListener('click', changePassword);
    document.getElementById('toggleCurrentPw').addEventListener('click', () => {
        const inp = document.getElementById('currentPw');
        inp.type  = inp.type === 'password' ? 'text' : 'password';
    });
}

function renderTransactions() {
    document.getElementById('txList').innerHTML = MY_TRANSACTIONS.map(tx => `
        <div class="tx-row">
            <div class="tx-icon ${tx.type}"><i class="bi bi-${tx.type === 'refund' ? 'arrow-return-left' : 'bag-check'}"></i></div>
            <div class="flex-grow-1">
                <div class="fw-semibold" style="font-size:.9rem;">${tx.desc}</div>
                <small class="text-muted">${tx.date} · Mã: ${tx.id}</small>
            </div>
            <div class="text-end">
                <div class="fw-bold" style="color:${tx.type === 'refund' ? '#28a745' : 'var(--primary-color)'};">
                    ${tx.type === 'refund' ? '+' : '-'}${formatCurrency(tx.amount)}
                </div>
                <small class="${tx.type === 'refund' ? 'text-success' : 'text-muted'}">${tx.type === 'refund' ? 'Hoàn tiền' : 'Đã mua'}</small>
            </div>
        </div>
    `).join('');
}

function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    if (!name) { showToast('Vui lòng nhập họ tên!', 'danger'); return; }
    currentUser.name = name;
    currentUser.phone   = document.getElementById('editPhone').value.trim();
    currentUser.address = document.getElementById('editAddress').value.trim();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('sidebarName').textContent          = name;
    document.getElementById('profileDisplayName').textContent   = name;
    document.getElementById('userNameDisplay').textContent      = name;
    showToast('Cập nhật thông tin thành công!');
}

function changePassword() {
    const cur  = document.getElementById('currentPw').value;
    const nw   = document.getElementById('newPw').value;
    const cf   = document.getElementById('confirmPw').value;
    if (!cur)            { showToast('Vui lòng nhập mật khẩu hiện tại!', 'danger'); return; }
    if (nw.length < 6)   { showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'danger'); return; }
    if (nw !== cf)        { showToast('Mật khẩu xác nhận không khớp!', 'danger'); return; }

    // Check current pw against stored users
    const allUsers = getAllUsersForPw();
    const found = allUsers.find(u => u.email === currentUser.email);
    if (found && found.password !== cur) { showToast('Mật khẩu hiện tại không đúng!', 'danger'); return; }

    // Update in registeredUsers
    const stored = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const idx = stored.findIndex(u => u.email === currentUser.email);
    if (idx >= 0) { stored[idx].password = nw; localStorage.setItem('registeredUsers', JSON.stringify(stored)); }

    document.getElementById('currentPw').value = '';
    document.getElementById('newPw').value      = '';
    document.getElementById('confirmPw').value  = '';
    showToast('Đổi mật khẩu thành công!');
}

function getAllUsersForPw() {
    const defaults = [
        { email:'admin@huongtramviet.com', password:'admin123' },
        { email:'user@email.com',          password:'123456' },
    ];
    const stored = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return [...defaults, ...stored];
}

// ============================================================
//  ADMIN LOGIC
// ============================================================
function initAdmin() {
    renderDashboard();
    renderAccountsTable(allAccounts);
    renderEmails();
    updateEmailBadge();

    // Filters
    document.getElementById('accSearch').addEventListener('input', filterAccounts);
    document.getElementById('accStatusFilter').addEventListener('change', filterAccounts);
    document.getElementById('accRoleFilter').addEventListener('change', filterAccounts);
    document.getElementById('emailSearch').addEventListener('input', () => renderEmails(document.getElementById('emailSearch').value));

    // Add account
    document.getElementById('btnAddAccount').addEventListener('click', addAccount);

    // Save edit
    document.getElementById('btnSaveEdit').addEventListener('click', saveEditAccount);

    // Send reply
    document.getElementById('btnSendReply').addEventListener('click', sendReply);
}

// --- Dashboard ---
function renderDashboard() {
    document.getElementById('dashTotalAcc').textContent  = allAccounts.length;
    document.getElementById('dashActiveAcc').textContent = allAccounts.filter(a => a.status === 'active').length;
    document.getElementById('dashLockedAcc').textContent = allAccounts.filter(a => a.status === 'locked').length;
    const rev = allAccounts.reduce((s, a) => s + a.spending, 0);
    document.getElementById('dashRevenue').textContent   = formatCurrency(rev);

    // Top spenders
    const top = [...allAccounts].sort((a, b) => b.spending - a.spending).slice(0, 5);
    const maxSpend = top[0]?.spending || 1;
    const medals = ['🥇','🥈','🥉','4.','5.'];
    document.getElementById('dashTopSpenders').innerHTML = top.map((acc, i) => `
        <div class="spender-row">
            <span style="width:22px; font-size:.9rem;">${medals[i]}</span>
            <div class="spender-avatar">${acc.name.charAt(0)}</div>
            <div class="flex-grow-1">
                <div class="fw-semibold" style="font-size:.88rem;">${acc.name}</div>
                <div class="spend-bar"><div class="spend-fill" style="width:${(acc.spending/maxSpend*100).toFixed(0)}%;"></div></div>
            </div>
            <div class="fw-bold" style="color:var(--primary-color); font-size:.83rem; white-space:nowrap;">${formatCurrency(acc.spending)}</div>
        </div>
    `).join('');

    // Email preview
    const unread = allEmails.filter(e => e.unread).slice(0, 3);
    document.getElementById('dashEmailPreview').innerHTML = unread.length
        ? unread.map(em => `
            <div class="dash-email-preview">
                <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-color); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; flex-shrink:0; font-size:.85rem;">${em.name.charAt(0)}</div>
                <div><div class="fw-semibold" style="font-size:.88rem;">${em.name}</div><div style="font-size:.82rem; color:var(--primary-color);">${em.subject}</div><small class="text-muted">${em.date}</small></div>
            </div>
        `).join('')
        : '<p class="text-muted" style="font-size:.88rem;">Không có email chưa đọc</p>';
}

// --- Accounts table ---
function renderAccountsTable(data) {
    const tbody = document.getElementById('accTableBody');
    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Không có tài khoản nào</td></tr>';
        return;
    }
    tbody.innerHTML = data.map((acc, i) => `
        <tr>
            <td class="text-muted fw-bold">${i + 1}</td>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--accent-color),var(--secondary-color)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; flex-shrink:0;">${acc.name.charAt(0)}</div>
                    <div><div class="fw-semibold" style="font-size:.9rem;">${acc.name}</div><small class="text-muted">${acc.email}</small></div>
                </div>
            </td>
            <td><span class="${acc.role === 'admin' ? 'role-admin' : 'role-user'}">${acc.role === 'admin' ? '👑 Admin' : '👤 User'}</span></td>
            <td><span class="${acc.status === 'active' ? 'status-active' : 'status-locked'}">${acc.status === 'active' ? '✓ Hoạt động' : '✗ Đã khóa'}</span></td>
            <td>
                <div class="fw-semibold" style="color:var(--primary-color); font-size:.88rem;">${formatCurrency(acc.spending)}</div>
                <div class="spend-bar"><div class="spend-fill" style="width:${Math.min(acc.spending / 100000, 100).toFixed(0)}%;"></div></div>
            </td>
            <td><small class="text-muted">${formatDate(acc.joined)}</small></td>
            <td>
                <div class="d-flex gap-1 flex-wrap">
                    <button class="btn-act btn-act-edit"   onclick="openEditModal(${acc.id})" title="Chỉnh sửa"><i class="bi bi-pencil"></i></button>
                    <button class="btn-act ${acc.status === 'active' ? 'btn-act-lock' : 'btn-act-unlock'}" onclick="toggleLock(${acc.id})" title="${acc.status === 'active' ? 'Khóa' : 'Mở khóa'}"><i class="bi bi-${acc.status === 'active' ? 'lock' : 'unlock'}"></i></button>
                    <button class="btn-act btn-act-del"    onclick="deleteAccount(${acc.id})" title="Xóa"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterAccounts() {
    const q      = document.getElementById('accSearch').value.toLowerCase();
    const status = document.getElementById('accStatusFilter').value;
    const role   = document.getElementById('accRoleFilter').value;
    const filtered = allAccounts.filter(a =>
        (!q      || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)) &&
        (!status || a.status === status) &&
        (!role   || a.role   === role)
    );
    renderAccountsTable(filtered);
}

function openEditModal(id) {
    const acc = allAccounts.find(a => a.id === id);
    if (!acc) return;
    document.getElementById('editAccId').value    = id;
    document.getElementById('editAccName').value  = acc.name;
    document.getElementById('editAccEmail').value = acc.email;
    document.getElementById('editAccPhone').value = acc.phone;
    document.getElementById('editAccRole').value  = acc.role;
    new bootstrap.Modal(document.getElementById('modalEditAccount')).show();
}

function saveEditAccount() {
    const id  = parseInt(document.getElementById('editAccId').value);
    const acc = allAccounts.find(a => a.id === id);
    if (!acc) return;
    acc.name  = document.getElementById('editAccName').value.trim() || acc.name;
    acc.phone = document.getElementById('editAccPhone').value.trim();
    acc.role  = document.getElementById('editAccRole').value;
    renderAccountsTable(allAccounts);
    renderDashboard();
    bootstrap.Modal.getInstance(document.getElementById('modalEditAccount')).hide();
    showToast('Cập nhật tài khoản thành công!');
}

function toggleLock(id) {
    const acc = allAccounts.find(a => a.id === id);
    if (!acc) return;
    // Don't lock own account
    if (acc.email === currentUser.email) { showToast('Không thể khóa tài khoản đang đăng nhập!', 'danger'); return; }
    acc.status = acc.status === 'active' ? 'locked' : 'active';
    renderAccountsTable(allAccounts);
    renderDashboard();
    showToast(acc.status === 'active' ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản!');
}

function deleteAccount(id) {
    const acc = allAccounts.find(a => a.id === id);
    if (!acc) return;
    if (acc.email === currentUser.email) { showToast('Không thể xóa tài khoản đang đăng nhập!', 'danger'); return; }
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${acc.name}"?`)) return;
    allAccounts = allAccounts.filter(a => a.id !== id);
    renderAccountsTable(allAccounts);
    renderDashboard();
    showToast('Đã xóa tài khoản!');
}

function addAccount() {
    const name  = document.getElementById('newAccName').value.trim();
    const email = document.getElementById('newAccEmail').value.trim().toLowerCase();
    const phone = document.getElementById('newAccPhone').value.trim();
    const pw    = document.getElementById('newAccPw').value;
    const role  = document.getElementById('newAccRole').value;

    if (!name || !email || !pw) { showToast('Vui lòng nhập đầy đủ các trường bắt buộc!', 'danger'); return; }
    if (allAccounts.find(a => a.email === email)) { showToast('Email này đã tồn tại!', 'danger'); return; }

    const newAcc = { id: nextAccId++, name, email, phone, role, status:'active', spending:0, joined: new Date().toISOString().split('T')[0] };
    allAccounts.push(newAcc);

    // Also save to registeredUsers so auth.js picks it up
    const stored = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    stored.push({ ...newAcc, password: pw });
    localStorage.setItem('registeredUsers', JSON.stringify(stored));

    renderAccountsTable(allAccounts);
    renderDashboard();
    bootstrap.Modal.getInstance(document.getElementById('modalAddAccount')).hide();
    ['newAccName','newAccEmail','newAccPhone','newAccPw'].forEach(id => document.getElementById(id).value = '');
    showToast('Thêm tài khoản thành công!');
}

// --- Emails ---
function renderEmails(query = '') {
    const filtered = query ? allEmails.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.subject.toLowerCase().includes(query.toLowerCase())) : allEmails;
    document.getElementById('emailListContainer').innerHTML = filtered.map(em => `
        <div class="email-row ${em.unread ? 'unread' : ''}" onclick="openEmail(${em.id})">
            <div class="d-flex justify-content-between align-items-start">
                <div style="min-width:0; flex:1;">
                    <div class="fw-semibold" style="font-size:.88rem;">
                        ${em.unread ? '<span class="unread-dot"></span>' : ''}${em.name}
                    </div>
                    <div class="fw-bold text-truncate" style="font-size:.82rem; color:var(--primary-color);">${em.subject}</div>
                    <div class="text-muted text-truncate" style="font-size:.78rem;">${em.body.substring(0, 55)}...</div>
                </div>
                <small class="text-muted ms-2 flex-shrink-0" style="font-size:.72rem;">${em.date.split(' ')[0]}</small>
            </div>
        </div>
    `).join('');
}

function openEmail(id) {
    const em = allEmails.find(e => e.id === id);
    if (!em) return;
    em.unread = false;
    renderEmails();
    updateEmailBadge();
    renderDashboard();

    document.getElementById('emailDetailPane').innerHTML = `
        <div style="padding:24px;">
            <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                <div>
                    <h5 class="fw-bold mb-1">${em.subject}</h5>
                    <div class="text-muted" style="font-size:.84rem;"><i class="bi bi-person me-1"></i>${em.name} &lt;${em.from}&gt;</div>
                    <small class="text-muted"><i class="bi bi-clock me-1"></i>${em.date}</small>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openReplyModal(${em.id})">
                    <i class="bi bi-reply me-1"></i>Trả lời
                </button>
            </div>
            <div class="p-3 rounded-3 mb-4" style="background:#f8f9fa; line-height:1.8; font-size:.92rem;">${em.body}</div>
            <hr>
            <div class="fw-semibold mb-2" style="color:var(--primary-color); font-size:.9rem;">Trả lời nhanh</div>
            <textarea class="form-control mb-2" id="quickReplyBody" rows="3" placeholder="Nhập nội dung..."></textarea>
            <button class="btn btn-primary btn-sm" onclick="sendQuickReply('${em.from}')">
                <i class="bi bi-send me-1"></i>Gửi nhanh
            </button>
        </div>
    `;
}

function openReplyModal(id) {
    const em = allEmails.find(e => e.id === id);
    if (!em) return;
    document.getElementById('replyTo').value      = `${em.name} <${em.from}>`;
    document.getElementById('replySubject').value = `Re: ${em.subject}`;
    document.getElementById('replyBody').value    = '';
    new bootstrap.Modal(document.getElementById('modalReplyEmail')).show();
}

function sendReply() {
    const body = document.getElementById('replyBody').value.trim();
    if (!body) { showToast('Vui lòng nhập nội dung!', 'danger'); return; }
    bootstrap.Modal.getInstance(document.getElementById('modalReplyEmail')).hide();
    showToast('Email đã được gửi thành công!');
}

function sendQuickReply(to) {
    const body = document.getElementById('quickReplyBody')?.value.trim();
    if (!body) { showToast('Vui lòng nhập nội dung!', 'danger'); return; }
    if (document.getElementById('quickReplyBody')) document.getElementById('quickReplyBody').value = '';
    showToast(`Đã gửi trả lời đến ${to}!`);
}

function updateEmailBadge() {
    const count = allEmails.filter(e => e.unread).length;
    const badge = document.getElementById('emailUnreadBadge');
    if (!badge) return;
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
}