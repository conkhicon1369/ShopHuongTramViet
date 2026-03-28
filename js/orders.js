// ==================== ORDERS.JS ====================

// ---- MOCK DATA ----
const ALL_ORDERS = [
    {
        id:'ORD-2024-001', customer:'Nguyễn Văn A', custEmail:'user@email.com',
        phone:'0901 234 567', address:'123 Đường ABC, Q1, TP.HCM',
        date:'15/01/2024 09:30', payment:'cod', status:'completed',
        subtotal:820000, shipping:30000, discount:0, total:850000,
        products:[
            { name:'Nhang Trầm Huế Cao Cấp', qty:2, price:380000, icon:'🌿' },
            { name:'Nụ Trầm Tự Nhiên',       qty:1, price:60000,  icon:'🌸' },
        ],
        trackStep: 4
    },
    {
        id:'ORD-2024-002', customer:'Trần Thị Bích', custEmail:'bich@email.com',
        phone:'0902 345 678', address:'456 Đường XYZ, Q3, TP.HCM',
        date:'14/01/2024 14:15', payment:'banking', status:'delivering',
        subtotal:590000, shipping:30000, discount:50000, total:570000,
        products:[
            { name:'Nhang Vòng Trầm Hương', qty:3, price:150000, icon:'🌀' },
            { name:'Trầm Hương Loại A',     qty:1, price:140000, icon:'🪵' },
        ],
        trackStep: 3
    },
    {
        id:'ORD-2024-003', customer:'Nguyễn Văn A', custEmail:'user@email.com',
        phone:'0901 234 567', address:'123 Đường ABC, Q1, TP.HCM',
        date:'13/01/2024 11:00', payment:'momo', status:'approved',
        subtotal:270000, shipping:30000, discount:0, total:300000,
        products:[
            { name:'Nhang Trầm Hương', qty:5, price:54000, icon:'🕯️' },
        ],
        trackStep: 2
    },
    {
        id:'ORD-2024-004', customer:'Phạm Thị Dung', custEmail:'dung@email.com',
        phone:'0904 567 890', address:'321 Đường PQR, Bình Thạnh, TP.HCM',
        date:'12/01/2024 16:45', payment:'cod', status:'pending',
        subtotal:465000, shipping:30000, discount:0, total:495000,
        products:[
            { name:'Bộ Nhang Quà Tặng', qty:1, price:350000, icon:'🎁' },
            { name:'Nụ Trầm Tự Nhiên',  qty:2, price:57500,  icon:'🌸' },
        ],
        trackStep: 0
    },
    {
        id:'ORD-2024-005', customer:'Hoàng Minh Tú', custEmail:'tu@email.com',
        phone:'0905 678 901', address:'654 Đường STU, Gò Vấp, TP.HCM',
        date:'11/01/2024 08:20', payment:'banking', status:'pending',
        subtotal:1200000, shipping:0, discount:100000, total:1100000,
        products:[
            { name:'Nhang Trầm Huế Cao Cấp', qty:5, price:190000, icon:'🌿' },
            { name:'Nhang Vòng Trầm Hương',  qty:2, price:150000, icon:'🌀' },
        ],
        trackStep: 0
    },
    {
        id:'ORD-2024-006', customer:'Đặng Văn Hùng', custEmail:'hung@email.com',
        phone:'0907 890 123', address:'999 Đường DEF, Tân Phú, TP.HCM',
        date:'10/01/2024 13:00', payment:'cod', status:'pending',
        subtotal:380000, shipping:30000, discount:0, total:410000,
        products:[
            { name:'Nhang Trầm Huế Cao Cấp', qty:2, price:190000, icon:'🌿' },
        ],
        trackStep: 0
    },
    {
        id:'ORD-2023-020', customer:'Nguyễn Văn A', custEmail:'user@email.com',
        phone:'0901 234 567', address:'123 Đường ABC, Q1, TP.HCM',
        date:'28/12/2023 10:30', payment:'cod', status:'completed',
        subtotal:245000, shipping:30000, discount:0, total:275000,
        products:[
            { name:'Nhang Trầm Hương', qty:5, price:49000, icon:'🕯️' },
        ],
        trackStep: 4
    },
    {
        id:'ORD-2023-018', customer:'Võ Thị Thu', custEmail:'thu@email.com',
        phone:'0906 789 012', address:'987 Đường VWX, Tân Bình, TP.HCM',
        date:'15/12/2023 09:00', payment:'cod', status:'cancelled',
        subtotal:185000, shipping:30000, discount:0, total:215000,
        products:[
            { name:'Nhang Trầm Hương', qty:1, price:185000, icon:'🕯️' },
        ],
        trackStep: -1
    },
];

const TRACK_STEPS = ['Đặt hàng', 'Đã xác nhận', 'Đóng gói', 'Đang vận chuyển', 'Đã giao hàng'];
const TRACK_DESCS = [
    'Đơn hàng đã được đặt thành công',
    'Cửa hàng đã xác nhận và chuẩn bị xử lý',
    'Sản phẩm đang được đóng gói cẩn thận',
    'Đơn hàng đang trên đường đến bạn',
    'Giao hàng thành công. Cảm ơn bạn!',
];
const STATUS_CFG = {
    pending:    { cls:'s-pending',    label:'⏳ Chờ xử lý' },
    approved:   { cls:'s-approved',  label:'✅ Đã duyệt' },
    delivering: { cls:'s-delivering',label:'🚚 Đang giao' },
    completed:  { cls:'s-completed', label:'🎉 Hoàn thành' },
    cancelled:  { cls:'s-cancelled', label:'❌ Đã hủy' },
};
const PAY_LABEL = { cod:'COD', banking:'Chuyển khoản', momo:'MoMo' };

// ---- STATE ----
let orders = ALL_ORDERS.map(o => ({ ...o, products: o.products.map(p => ({ ...p })) }));
let currentUser  = null;
let adminCurFilter = 'all';


// Close order detail modal - must be global for inline onclick handlers
function closeOrderModal() {
    const m = bootstrap.Modal.getInstance(document.getElementById('modalOrderDetail'));
    if (m) m.hide();
}
// ---- BOOT ----
window.addEventListener('DOMContentLoaded', () => {
    currentUser = getCurrentUser();
    if (!currentUser) { window.location.href = 'login.html'; return; }

    document.getElementById('sidebarName').textContent = currentUser.name;

    if (currentUser.role === 'admin') {
        document.getElementById('sidebarAvatar').innerHTML     = '<i class="bi bi-shield-fill-check"></i>';
        document.getElementById('sidebarRoleLabel').textContent = 'Quản trị viên';
        document.getElementById('navAdmin').style.display       = 'flex';
        document.getElementById('navAdmin').style.flexDirection = 'column';
        initAdmin();
        showPanel('adminOrders');
    } else {
        document.getElementById('sidebarRoleLabel').textContent = 'Người dùng';
        document.getElementById('navUser').style.display        = 'flex';
        document.getElementById('navUser').style.flexDirection  = 'column';
        initUser();
        showPanel('myOrders');
    }

    // Sidebar clicks
    document.querySelectorAll('.sidebar-nav a[data-panel]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showPanel(link.dataset.panel, link);
        });
    });
});

// ---- PANEL SWITCH ----
function showPanel(name, clickedLink) {
    document.querySelectorAll('.ord-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));

    const map = { myOrders:'panelMyOrders', tracking:'panelTracking', adminOrders:'panelAdminOrders', adminTracking:'panelAdminTracking' };
    const panel = document.getElementById(map[name]);
    if (panel) panel.classList.add('active');

    if (clickedLink) {
        clickedLink.classList.add('active');
    } else {
        document.querySelectorAll(`.sidebar-nav a[data-panel="${name}"]`).forEach(a => a.classList.add('active'));
    }
}

// ============================================================
//  USER LOGIC
// ============================================================
function initUser() {
    const myOrders = orders.filter(o => o.custEmail === currentUser.email);

    // Stats
    document.getElementById('statMyTotal').textContent     = myOrders.length;
    document.getElementById('statMyPending').textContent   = myOrders.filter(o => o.status === 'pending').length;
    document.getElementById('statMyDelivering').textContent = myOrders.filter(o => o.status === 'delivering').length;
    document.getElementById('statMyCompleted').textContent = myOrders.filter(o => o.status === 'completed').length;

    // Filter tabs
    const tabs = [
        { key:'all',        label:'Tất cả' },
        { key:'pending',    label:'Chờ xử lý' },
        { key:'approved',   label:'Đã duyệt' },
        { key:'delivering', label:'Đang giao' },
        { key:'completed',  label:'Hoàn thành' },
        { key:'cancelled',  label:'Đã hủy' },
    ];
    document.getElementById('userFilterTabs').innerHTML = tabs.map(t => {
        const cnt = t.key === 'all' ? myOrders.length : myOrders.filter(o => o.status === t.key).length;
        return `<button class="ftab ${t.key === 'all' ? 'active' : ''}" data-filter="${t.key}">${t.label} <span class="cnt">${cnt}</span></button>`;
    }).join('');

    document.querySelectorAll('#userFilterTabs .ftab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#userFilterTabs .ftab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            renderUserOrders(f === 'all' ? myOrders : myOrders.filter(o => o.status === f));
        });
    });

    renderUserOrders(myOrders);

    // Tracking
    document.getElementById('btnTrack').addEventListener('click', trackOrder);
    renderActiveDeliveries(myOrders);
}

function renderUserOrders(data) {
    const container = document.getElementById('userOrdersList');
    if (!data.length) {
        container.innerHTML = `<div class="text-center py-5 text-muted">
            <i class="bi bi-bag-x" style="font-size:3rem; opacity:.3;"></i>
            <p class="mt-3">Không có đơn hàng nào</p>
            <a href="product.html" class="btn btn-primary mt-2"><i class="bi bi-shop me-2"></i>Tiếp Tục Mua Sắm</a>
        </div>`;
        return;
    }
    container.innerHTML = data.map(ord => `
        <div class="order-card">
            <div class="order-card-head">
                <div>
                    <span class="fw-bold" style="color:var(--primary-color);">${ord.id}</span>
                    <span class="text-muted ms-3" style="font-size:.82rem;"><i class="bi bi-calendar me-1"></i>${ord.date}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="${STATUS_CFG[ord.status].cls}">${STATUS_CFG[ord.status].label}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="goTracking('${ord.id}')">
                        <i class="bi bi-geo-alt me-1"></i>Theo dõi
                    </button>
                </div>
            </div>
            <div class="order-card-body">
                ${ord.products.map(p => `
                    <div class="prod-row">
                        <div class="prod-icon">${p.icon}</div>
                        <div class="flex-grow-1"><div class="fw-semibold" style="font-size:.9rem;">${p.name}</div><small class="text-muted">x${p.qty}</small></div>
                        <div class="fw-bold" style="color:var(--primary-color);">${(p.price * p.qty).toLocaleString('vi-VN')}đ</div>
                    </div>
                `).join('')}
                <div class="d-flex justify-content-between align-items-center mt-3 pt-3" style="border-top:2px dashed #f0e6d3;">
                    <div>
                        <span class="text-muted me-3" style="font-size:.85rem;"><i class="bi bi-credit-card me-1"></i>${PAY_LABEL[ord.payment]}</span>
                        ${ord.discount > 0 ? `<span class="text-success" style="font-size:.85rem;"><i class="bi bi-tag me-1"></i>Giảm ${ord.discount.toLocaleString('vi-VN')}đ</span>` : ''}
                    </div>
                    <div class="text-end">
                        <div class="text-muted" style="font-size:.8rem;">Tổng cộng</div>
                        <div class="fw-bold" style="font-size:1.05rem; color:var(--primary-color);">${ord.total.toLocaleString('vi-VN')}đ</div>
                    </div>
                </div>
                ${ord.status === 'pending' ? `<div class="mt-3"><button class="btn btn-sm btn-cancel" onclick="cancelMyOrder('${ord.id}')"><i class="bi bi-x-circle me-1"></i>Hủy đơn hàng</button></div>` : ''}
            </div>
        </div>
    `).join('');
}

function cancelMyOrder(id) {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    const ord = orders.find(o => o.id === id);
    if (ord) { ord.status = 'cancelled'; ord.trackStep = -1; }
    initUser();
    showToast('Đã hủy đơn hàng!');
}

function goTracking(id) {
    document.getElementById('trackingInput').value = id;
    showPanel('tracking');
    document.querySelectorAll('#navUser a[data-panel="tracking"]').forEach(a => {
        document.querySelectorAll('#navUser a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
    });
    trackOrder();
}

// ---- Tracking ----
function trackOrder() {
    const code = document.getElementById('trackingInput').value.trim().toUpperCase();
    const ord  = orders.find(o => o.id === code);
    const box  = document.getElementById('trackingResult');

    if (!ord) {
        box.innerHTML = `<div class="text-center py-5 text-muted"><i class="bi bi-search" style="font-size:3rem; opacity:.3;"></i><p class="mt-3">Không tìm thấy đơn hàng <strong>${code}</strong></p></div>`;
        return;
    }

    const cancelled = ord.status === 'cancelled';
    box.innerHTML = `
        <div style="padding:22px;">
            <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                <div>
                    <h5 class="fw-bold mb-1" style="color:var(--primary-color);">${ord.id}</h5>
                    <div class="text-muted" style="font-size:.83rem;"><i class="bi bi-person me-1"></i>${ord.customer} &nbsp;·&nbsp; <i class="bi bi-telephone me-1"></i>${ord.phone}</div>
                    <div class="text-muted" style="font-size:.83rem;"><i class="bi bi-geo-alt me-1"></i>${ord.address}</div>
                </div>
                <span class="${STATUS_CFG[ord.status].cls}">${STATUS_CFG[ord.status].label}</span>
            </div>

            ${cancelled ? `<div class="alert alert-danger"><i class="bi bi-x-circle me-2"></i>Đơn hàng này đã bị hủy.</div>` : `
            <div class="dp-track mb-4">
                ${TRACK_STEPS.map((s, i) => `
                    <div class="dp-step ${ord.trackStep > i ? 'done' : ord.trackStep === i ? 'active' : ''}">
                        <div class="dp-dot">${ord.trackStep > i ? '<i class="bi bi-check" style="font-size:.7rem;"></i>' : i + 1}</div>
                        <div class="dp-lbl">${s}</div>
                    </div>
                `).join('')}
            </div>
            `}

            <div class="info-card-title"><i class="bi bi-clock-history me-2"></i>Lịch Sử Cập Nhật</div>
            <div class="tl">
                ${cancelled ? `
                    <div class="tl-step"><div class="tl-dot active"></div><div class="tl-title" style="color:#dc3545;">Đơn hàng đã bị hủy</div><div class="tl-detail">Theo yêu cầu của khách hàng</div></div>
                    <div class="tl-step"><div class="tl-dot done"></div><div class="tl-title text-muted">Đặt hàng</div><div class="tl-detail">${ord.date}</div></div>
                ` : TRACK_STEPS.slice(0, Math.max(ord.trackStep + 1, 1)).reverse().map((s, ri) => {
                    const realIdx = Math.max(ord.trackStep, 0) - ri;
                    const isLatest = ri === 0;
                    return `<div class="tl-step"><div class="tl-dot ${isLatest ? 'active' : 'done'}"></div><div class="tl-title ${isLatest ? '' : 'text-muted'}">${s}</div><div class="tl-detail">${TRACK_DESCS[realIdx]}</div></div>`;
                }).join('')}
            </div>

            <div class="info-card-title mt-4"><i class="bi bi-bag me-2"></i>Sản Phẩm</div>
            ${ord.products.map(p => `
                <div class="prod-row">
                    <div class="prod-icon">${p.icon}</div>
                    <div class="flex-grow-1"><div class="fw-semibold" style="font-size:.9rem;">${p.name}</div><small class="text-muted">x${p.qty}</small></div>
                    <div class="fw-bold" style="color:var(--primary-color);">${(p.price * p.qty).toLocaleString('vi-VN')}đ</div>
                </div>
            `).join('')}
            <div class="d-flex justify-content-between fw-bold mt-3 pt-3" style="border-top:2px solid #f0e6d3; font-size:1rem;">
                <span>Tổng cộng:</span>
                <span style="color:var(--primary-color);">${ord.total.toLocaleString('vi-VN')}đ</span>
            </div>
        </div>
    `;
}

function renderActiveDeliveries(myOrders) {
    const active = myOrders.filter(o => o.status === 'delivering');
    document.getElementById('activeDeliveriesUser').innerHTML = active.length
        ? active.map(o => `
            <div class="d-flex align-items-center gap-2 p-2 rounded-3 mb-2" style="background:#fffaf5; border:1px solid #f0e6d3; cursor:pointer;" onclick="document.getElementById('trackingInput').value='${o.id}'; trackOrder();">
                <i class="bi bi-truck" style="color:var(--primary-color);"></i>
                <div><div class="fw-semibold" style="font-size:.83rem;">${o.id}</div><small class="text-muted">${o.date.split(' ')[0]}</small></div>
            </div>
        `).join('')
        : '<p class="text-muted" style="font-size:.83rem;">Không có đơn đang giao</p>';
}

// ============================================================
//  ADMIN LOGIC
// ============================================================
function initAdmin() {
    renderAdminStats();
    renderAdminFilterTabs();
    renderAdminOrders(orders);
    renderAdminTracking();
    updatePendingBadge();

    document.getElementById('adminOrderSearch').addEventListener('input', applyAdminFilters);
    document.getElementById('adminPayFilter').addEventListener('change', applyAdminFilters);
    document.getElementById('btnExport').addEventListener('click', () => showToast('Xuất file Excel thành công!'));
}

function renderAdminStats() {
    document.getElementById('adminStatTotal').textContent     = orders.length;
    document.getElementById('adminStatPending').textContent   = orders.filter(o => o.status === 'pending').length;
    document.getElementById('adminStatDelivering').textContent = orders.filter(o => o.status === 'delivering').length;
    const rev = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    document.getElementById('adminStatRevenue').textContent   = formatCurrency(rev);
}

function renderAdminFilterTabs() {
    const defs = [
        { key:'all',        label:'Tất cả' },
        { key:'pending',    label:'⏳ Chờ duyệt' },
        { key:'approved',   label:'✅ Đã duyệt' },
        { key:'delivering', label:'🚚 Đang giao' },
        { key:'completed',  label:'🎉 Hoàn thành' },
        { key:'cancelled',  label:'❌ Đã hủy' },
    ];
    document.getElementById('adminFilterTabs').innerHTML = defs.map(t => {
        const cnt = t.key === 'all' ? orders.length : orders.filter(o => o.status === t.key).length;
        return `<button class="ftab ${t.key === adminCurFilter ? 'active' : ''}" data-filter="${t.key}">${t.label} <span class="cnt">${cnt}</span></button>`;
    }).join('');

    document.querySelectorAll('#adminFilterTabs .ftab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#adminFilterTabs .ftab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            adminCurFilter = btn.dataset.filter;
            applyAdminFilters();
        });
    });
}

function applyAdminFilters() {
    const q   = document.getElementById('adminOrderSearch').value.toLowerCase();
    const pay = document.getElementById('adminPayFilter').value;
    const filtered = orders.filter(o =>
        (adminCurFilter === 'all' || o.status === adminCurFilter) &&
        (!q   || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) &&
        (!pay || o.payment === pay)
    );
    renderAdminOrders(filtered);
}

function renderAdminOrders(data) {
    const tbody = document.getElementById('adminOrdersBody');
    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Không có đơn hàng nào</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(ord => `
        <tr>
            <td><span class="fw-bold" style="color:var(--primary-color); font-size:.83rem;">${ord.id}</span></td>
            <td><div class="fw-semibold" style="font-size:.88rem;">${ord.customer}</div><small class="text-muted">${ord.phone}</small></td>
            <td><div style="font-size:.82rem;">${ord.products.map(p => p.icon + ' ' + (p.name.length > 16 ? p.name.substring(0,16)+'…' : p.name)).join('<br>')}</div></td>
            <td><span class="fw-bold" style="color:var(--primary-color);">${ord.total.toLocaleString('vi-VN')}đ</span></td>
            <td><span class="badge bg-secondary">${PAY_LABEL[ord.payment]}</span></td>
            <td><span class="${STATUS_CFG[ord.status].cls}">${STATUS_CFG[ord.status].label}</span></td>
            <td><small class="text-muted">${ord.date.split(' ')[0]}</small></td>
            <td>
                <div class="d-flex gap-1 flex-wrap">
                    <button class="btn-act btn-view"    onclick="openOrderModal('${ord.id}')" title="Xem chi tiết"><i class="bi bi-eye"></i></button>
                    ${ord.status === 'pending'    ? `<button class="btn-act btn-approve"  onclick="approveOrder('${ord.id}')"  title="Duyệt"><i class="bi bi-check"></i></button>` : ''}
                    ${ord.status === 'pending'    ? `<button class="btn-act btn-cancel"   onclick="cancelOrder('${ord.id}')"   title="Hủy"><i class="bi bi-x"></i></button>` : ''}
                    ${ord.status === 'approved'   ? `<button class="btn-act btn-deliver"  onclick="deliverOrder('${ord.id}')"  title="Giao hàng"><i class="bi bi-truck"></i></button>` : ''}
                    ${ord.status === 'delivering' ? `<button class="btn-act btn-complete" onclick="completeOrder('${ord.id}')" title="Đã giao"><i class="bi bi-check2-all"></i></button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function approveOrder(id) {
    const ord = orders.find(o => o.id === id);
    if (!ord) return;
    ord.status = 'approved'; ord.trackStep = 1;
    afterOrderChange(); showToast('Đã duyệt đơn ' + id + '!');
}
function deliverOrder(id) {
    const ord = orders.find(o => o.id === id);
    if (!ord) return;
    ord.status = 'delivering'; ord.trackStep = 3;
    afterOrderChange(); showToast('Đơn hàng đang vận chuyển!');
}
function completeOrder(id) {
    const ord = orders.find(o => o.id === id);
    if (!ord) return;
    ord.status = 'completed'; ord.trackStep = 4;
    afterOrderChange(); showToast('Đơn hàng đã giao thành công!');
}
function cancelOrder(id) {
    if (!confirm('Hủy đơn hàng ' + id + '?')) return;
    const ord = orders.find(o => o.id === id);
    if (!ord) return;
    ord.status = 'cancelled'; ord.trackStep = -1;
    afterOrderChange(); showToast('Đã hủy đơn hàng!');
}

function afterOrderChange() {
    renderAdminStats();
    renderAdminFilterTabs();
    applyAdminFilters();
    renderAdminTracking();
    updatePendingBadge();
}

function updatePendingBadge() {
    const count = orders.filter(o => o.status === 'pending').length;
    const badge = document.getElementById('pendingBadge');
    if (!badge) return;
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
}

function openOrderModal(id) {
    const ord = orders.find(o => o.id === id);
    if (!ord) return;
    document.getElementById('modalOrderId').textContent = '#' + ord.id;
    document.getElementById('modalOrderBody').innerHTML = `
        <div class="row g-4">
            <div class="col-md-6">
                <h6 class="fw-bold" style="color:var(--primary-color);">Thông tin khách hàng</h6>
                <table class="table table-borderless" style="font-size:.9rem;">
                    <tr><td class="text-muted py-1">Họ tên:</td><td class="fw-semibold py-1">${ord.customer}</td></tr>
                    <tr><td class="text-muted py-1">Điện thoại:</td><td class="py-1">${ord.phone}</td></tr>
                    <tr><td class="text-muted py-1">Địa chỉ:</td><td class="py-1">${ord.address}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6 class="fw-bold" style="color:var(--primary-color);">Thông tin đơn hàng</h6>
                <table class="table table-borderless" style="font-size:.9rem;">
                    <tr><td class="text-muted py-1">Ngày đặt:</td><td class="py-1">${ord.date}</td></tr>
                    <tr><td class="text-muted py-1">Thanh toán:</td><td class="py-1">${PAY_LABEL[ord.payment]}</td></tr>
                    <tr><td class="text-muted py-1">Trạng thái:</td><td class="py-1"><span class="${STATUS_CFG[ord.status].cls}">${STATUS_CFG[ord.status].label}</span></td></tr>
                </table>
            </div>
            <div class="col-12">
                <h6 class="fw-bold mb-3" style="color:var(--primary-color);">Sản phẩm đặt mua</h6>
                <table class="table" style="font-size:.88rem;">
                    <thead style="background:#f8f4ef;"><tr><th>Sản phẩm</th><th class="text-center">SL</th><th class="text-end">Đơn giá</th><th class="text-end">Thành tiền</th></tr></thead>
                    <tbody>
                        ${ord.products.map(p => `<tr><td>${p.icon} ${p.name}</td><td class="text-center">${p.qty}</td><td class="text-end">${p.price.toLocaleString('vi-VN')}đ</td><td class="text-end fw-bold">${(p.price*p.qty).toLocaleString('vi-VN')}đ</td></tr>`).join('')}
                    </tbody>
                    <tfoot>
                        <tr><td colspan="3" class="text-end text-muted">Tạm tính:</td><td class="text-end">${ord.subtotal.toLocaleString('vi-VN')}đ</td></tr>
                        <tr><td colspan="3" class="text-end text-muted">Phí ship:</td><td class="text-end">${ord.shipping.toLocaleString('vi-VN')}đ</td></tr>
                        ${ord.discount > 0 ? `<tr><td colspan="3" class="text-end text-success">Giảm giá:</td><td class="text-end text-success">-${ord.discount.toLocaleString('vi-VN')}đ</td></tr>` : ''}
                        <tr><td colspan="3" class="text-end fw-bold" style="font-size:1rem;">Tổng cộng:</td><td class="text-end fw-bold" style="color:var(--primary-color); font-size:1.05rem;">${ord.total.toLocaleString('vi-VN')}đ</td></tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;

    const footer = document.getElementById('modalOrderFooter');
    footer.innerHTML = `<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Đóng</button>`;
    if (ord.status === 'pending') {
        footer.innerHTML += `
            <button class="btn btn-success" onclick="approveOrder('${ord.id}'); closeOrderModal()"><i class="bi bi-check-circle me-1"></i>Duyệt đơn</button>
            <button class="btn btn-danger"  onclick="cancelOrder('${ord.id}');  closeOrderModal()"><i class="bi bi-x-circle me-1"></i>Hủy đơn</button>
        `;
    } else if (ord.status === 'approved') {
        footer.innerHTML += `<button class="btn btn-primary" onclick="deliverOrder('${ord.id}'); closeOrderModal()"><i class="bi bi-truck me-1"></i>Chuyển sang giao hàng</button>`;
    } else if (ord.status === 'delivering') {
        footer.innerHTML += `<button class="btn btn-success" onclick="completeOrder('${ord.id}'); closeOrderModal()"><i class="bi bi-check2-all me-1"></i>Xác nhận đã giao</button>`;
    }
    // Attach closeOrderModal to modal action buttons
    document.querySelectorAll('#modalOrderFooter button').forEach(btn => {
        if (btn.textContent.includes('Đóng')) return;
        btn.addEventListener('click', closeOrderModal);
    });
    new bootstrap.Modal(document.getElementById('modalOrderDetail')).show();
}

function renderAdminTracking() {
    const active = orders.filter(o => ['pending','approved','delivering'].includes(o.status));
    document.getElementById('adminTrackingList').innerHTML = active.length
        ? active.map(ord => `
            <div class="track-card">
                <div class="track-head">
                    <div>
                        <span class="fw-bold" style="color:var(--primary-color);">${ord.id}</span>
                        <span class="text-muted ms-2" style="font-size:.83rem;">${ord.customer} · ${ord.phone}</span>
                    </div>
                    <span class="${STATUS_CFG[ord.status].cls}">${STATUS_CFG[ord.status].label}</span>
                </div>
                <div class="track-body">
                    <div class="text-muted mb-3" style="font-size:.82rem;"><i class="bi bi-geo-alt me-1"></i>${ord.address}</div>
                    <div class="dp-track mb-3">
                        ${TRACK_STEPS.map((s, i) => `
                            <div class="dp-step ${ord.trackStep > i ? 'done' : ord.trackStep === i ? 'active' : ''}">
                                <div class="dp-dot">${ord.trackStep > i ? '<i class="bi bi-check" style="font-size:.7rem;"></i>' : i+1}</div>
                                <div class="dp-lbl">${s}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted" style="font-size:.82rem;"><i class="bi bi-calendar me-1"></i>${ord.date}</span>
                        <div class="d-flex gap-2">
                            ${ord.status === 'pending'    ? `<button class="btn btn-sm btn-success" onclick="approveOrder('${ord.id}')"><i class="bi bi-check me-1"></i>Duyệt</button>` : ''}
                            ${ord.status === 'approved'   ? `<button class="btn btn-sm btn-primary" onclick="deliverOrder('${ord.id}')"><i class="bi bi-truck me-1"></i>Giao hàng</button>` : ''}
                            ${ord.status === 'delivering' ? `<button class="btn btn-sm btn-success" onclick="completeOrder('${ord.id}')"><i class="bi bi-check2-all me-1"></i>Đã giao</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('')
        : '<div class="text-center text-muted py-5"><i class="bi bi-truck" style="font-size:3rem; opacity:.3;"></i><p class="mt-3">Không có đơn hàng cần theo dõi</p></div>';
}