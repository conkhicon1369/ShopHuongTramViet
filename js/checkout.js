// ==================== CHECKOUT PAGE JAVASCRIPT ====================

let cart = [];
let shippingFee = 30000;
let discountAmount = 0;

// Load checkout page
function loadCheckout() {
    cart = StorageManager.getCart();
    
    // Redirect if cart is empty
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống', 'warning');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
        return;
    }
    
    displayOrderSummary();
    calculateCheckoutTotal();
    loadUserInfo();
    setupPaymentMethodHandlers();
}

// Display order summary
function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" 
                         class="me-2">
                    <div>
                        <p class="mb-0 small"><strong>${item.name}</strong></p>
                        <small class="text-muted">SL: ${item.quantity}</small>
                    </div>
                </div>
                <strong class="text-primary-custom">${formatCurrency(item.price * item.quantity)}</strong>
            </div>
        `;
        orderItemsContainer.innerHTML += itemHTML;
    });
}

// Calculate total
function calculateCheckoutTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Free shipping for orders over 500k
    const finalShippingFee = subtotal >= 500000 ? 0 : shippingFee;
    
    const total = subtotal + finalShippingFee - discountAmount;
    
    document.getElementById('checkoutSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkoutShipping').textContent = finalShippingFee === 0 
        ? 'Miễn phí' 
        : formatCurrency(finalShippingFee);
    document.getElementById('checkoutDiscount').textContent = discountAmount > 0 
        ? `-${formatCurrency(discountAmount)}` 
        : '0đ';
    document.getElementById('checkoutTotal').textContent = formatCurrency(total);
    
    // Store for order placement
    window.orderTotal = total;
    window.orderSubtotal = subtotal;
    window.orderShipping = finalShippingFee;
}

// Load user info if logged in
function loadUserInfo() {
    const user = StorageManager.getCurrentUser();
    if (user) {
        document.getElementById('fullName').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    }
}

// Setup payment method handlers
function setupPaymentMethodHandlers() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const bankingInfo = document.getElementById('bankingInfo');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'banking') {
                bankingInfo.style.display = 'block';
            } else {
                bankingInfo.style.display = 'none';
            }
        });
    });
}

// Setup location dropdowns
function setupLocationDropdowns() {
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');
    
    // Mock data for districts
    const districts = {
        'hcm': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10'],
        'hn': ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Cầu Giấy', 'Tây Hồ'],
        'dn': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'],
        'ct': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt']
    };
    
    citySelect.addEventListener('change', (e) => {
        const selectedCity = e.target.value;
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        
        if (districts[selectedCity]) {
            districts[selectedCity].forEach(district => {
                districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
            });
        }
    });
    
    districtSelect.addEventListener('change', () => {
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        // Add wards based on selected district (simplified)
        for (let i = 1; i <= 10; i++) {
            wardSelect.innerHTML += `<option value="Phường ${i}">Phường ${i}</option>`;
        }
    });
}

// Validate form
function validateCheckoutForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const ward = document.getElementById('ward').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!fullName) {
        showNotification('Vui lòng nhập họ tên', 'warning');
        return false;
    }
    
    if (!phone || !/^[0-9]{10,11}$/.test(phone)) {
        showNotification('Số điện thoại không hợp lệ', 'warning');
        return false;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Email không hợp lệ', 'warning');
        return false;
    }
    
    if (!address) {
        showNotification('Vui lòng nhập địa chỉ', 'warning');
        return false;
    }
    
    if (!city || !district || !ward) {
        showNotification('Vui lòng chọn đầy đủ địa chỉ giao hàng', 'warning');
        return false;
    }
    
    if (!agreeTerms) {
        showNotification('Vui lòng đồng ý với điều khoản và điều kiện', 'warning');
        return false;
    }
    
    return true;
}

// Place order
function placeOrder() {
    if (!validateCheckoutForm()) {
        return;
    }
    
    // Get form data
    const orderData = {
        orderId: 'ORD' + Date.now(),
        customer: {
            name: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim()
        },
        shipping: {
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').options[document.getElementById('city').selectedIndex].text,
            district: document.getElementById('district').value,
            ward: document.getElementById('ward').value
        },
        items: cart,
        payment: {
            method: document.querySelector('input[name="paymentMethod"]:checked').value,
            subtotal: window.orderSubtotal,
            shipping: window.orderShipping,
            discount: discountAmount,
            total: window.orderTotal
        },
        notes: document.getElementById('notes').value.trim(),
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage (in production, send to backend)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    StorageManager.clearCart();
    
    // Show success modal
    document.getElementById('orderCode').textContent = orderData.orderId;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Log order for demo
    console.log('Order placed:', orderData);
    
    // Send confirmation email (mock)
    sendOrderConfirmation(orderData);
}

// Mock function to send order confirmation
function sendOrderConfirmation(orderData) {
    console.log('Sending order confirmation email to:', orderData.customer.email);
    console.log('Order details:', orderData);
    
    // In production, this would be an API call to your backend
    // which would handle sending the actual email
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    loadCheckout();
    setupLocationDropdowns();
    
    console.log('Checkout page loaded successfully!');
});