// ==================== CART PAGE JAVASCRIPT ====================

let cart = [];
let shippingFee = 30000;
let discountAmount = 0;

// Load and display cart
function loadCart() {
    cart = StorageManager.getCart();
    displayCart();
    calculateTotal();
}

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'flex';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid">
                    </div>
                    <div class="col-md-4 col-9">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-muted mb-0">${item.priceFormatted}</p>
                    </div>
                    <div class="col-md-3 col-6 mt-3 mt-md-0">
                        <div class="d-flex align-items-center">
                            <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="form-control quantity-input mx-2" 
                                   value="${item.quantity}" min="1" 
                                   onchange="updateQuantity(${item.id}, this.value)">
                            <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4 text-end mt-3 mt-md-0">
                        <h5 class="mb-0 text-primary-custom">${formatCurrency(itemTotal)}</h5>
                    </div>
                    <div class="col-md-1 col-2 text-end mt-3 mt-md-0">
                        <button class="btn btn-link text-danger" onclick="removeItem(${item.id})" title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    
    cart = StorageManager.updateCartQuantity(productId, newQuantity);
    loadCart();
}

// Remove item from cart
function removeItem(productId) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        cart = StorageManager.removeFromCart(productId);
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
        loadCart();
    }
}

// Calculate total
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Free shipping for orders over 500k
    const finalShippingFee = subtotal >= 500000 ? 0 : shippingFee;
    
    const total = subtotal + finalShippingFee - discountAmount;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = finalShippingFee === 0 
        ? 'Miễn phí' 
        : formatCurrency(finalShippingFee);
    document.getElementById('discount').textContent = discountAmount > 0 
        ? `-${formatCurrency(discountAmount)}` 
        : '0đ';
    document.getElementById('total').textContent = formatCurrency(total);
    
    // Show free shipping message
    if (subtotal >= 500000) {
        const shippingElement = document.getElementById('shipping');
        shippingElement.parentElement.classList.add('text-success');
        shippingElement.innerHTML = 'Miễn phí <i class="bi bi-check-circle ms-1"></i>';
    }
}

// Check login before proceeding to checkout
function proceedToCheckout() {
    const currentUser = StorageManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để tiếp tục thanh toán', 'warning');
        setTimeout(() => {
            // Store redirect URL for after login
            sessionStorage.setItem('redirectAfterLogin', 'checkout.html');
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    window.location.href = 'checkout.html';
    return true;
}

// Apply coupon
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Vui lòng nhập mã giảm giá', 'warning');
        return;
    }
    
    // Predefined coupons
    const coupons = {
        'WELCOME10': { type: 'percent', value: 10, description: 'Giảm 10%' },
        'SAVE50K': { type: 'fixed', value: 50000, description: 'Giảm 50.000đ' },
        'FREESHIP': { type: 'shipping', value: 0, description: 'Miễn phí vận chuyển' }
    };
    
    const coupon = coupons[couponCode];
    
    if (!coupon) {
        showNotification('Mã giảm giá không hợp lệ', 'danger');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (coupon.type === 'percent') {
        discountAmount = Math.floor(subtotal * coupon.value / 100);
    } else if (coupon.type === 'fixed') {
        discountAmount = coupon.value;
    } else if (coupon.type === 'shipping') {
        shippingFee = 0;
    }
    
    showNotification(`Đã áp dụng mã giảm giá: ${coupon.description}`, 'success');
    calculateTotal();
}

// Clear cart
function clearCart() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
        StorageManager.clearCart();
        cart = [];
        loadCart();
        showNotification('Đã xóa toàn bộ giỏ hàng', 'success');
    }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Update checkout button to use proceedToCheckout function
    const checkoutBtn = document.querySelector('a[href="checkout.html"]');
    if (checkoutBtn) {
        checkoutBtn.removeAttribute('href');
        checkoutBtn.style.cursor = 'pointer';
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            proceedToCheckout();
        });
    }
    
    // Add clear cart button if needed
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer && cart.length > 0) {
        const clearButton = `
            <div class="text-end mb-3">
                <button class="btn btn-outline-danger btn-sm" onclick="clearCart()">
                    <i class="bi bi-trash me-2"></i>Xóa toàn bộ giỏ hàng
                </button>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforebegin', clearButton);
    }
    
    console.log('Cart page loaded successfully!');
});