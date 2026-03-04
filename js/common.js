// ==================== COMMON JAVASCRIPT ====================
// File này chứa các function dùng chung cho toàn bộ website

// Load data từ localStorage
const StorageManager = {
    // Cart management
    getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
    
    saveCart: (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
    },
    
    addToCart: (product, quantity = 1) => {
        const cart = StorageManager.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                priceFormatted: product.priceFormatted,
                image: product.image,
                quantity: quantity
            });
        }
        
        StorageManager.saveCart(cart);
        showNotification('Đã thêm vào giỏ hàng!', 'success');
        return cart;
    },
    
    removeFromCart: (productId) => {
        let cart = StorageManager.getCart();
        cart = cart.filter(item => item.id !== productId);
        StorageManager.saveCart(cart);
        return cart;
    },
    
    updateCartQuantity: (productId, quantity) => {
        const cart = StorageManager.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                return StorageManager.removeFromCart(productId);
            }
        }
        StorageManager.saveCart(cart);
        return cart;
    },
    
    clearCart: () => {
        localStorage.removeItem('cart');
        updateCartBadge();
    },
    
    // User management
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser') || 'null'),
    
    setCurrentUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserUI();
    },
    
    logout: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        updateUserUI();
        window.location.href = 'index.html';
    },
    
    // Users database (simple demo)
    getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
    
    addUser: (user) => {
        const users = StorageManager.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },
    
    findUser: (email, password) => {
        const users = StorageManager.getUsers();
        return users.find(u => u.email === email && u.password === password);
    }
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Update cart badge
function updateCartBadge() {
    const cart = StorageManager.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Update user UI
function updateUserUI() {
    const user = StorageManager.getCurrentUser();
    const userSection = document.getElementById('userSection');
    const guestSection = document.getElementById('guestSection');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (user) {
        if (userSection) userSection.style.display = 'block';
        if (guestSection) guestSection.style.display = 'none';
        if (userNameDisplay) userNameDisplay.textContent = user.name;
    } else {
        if (userSection) userSection.style.display = 'none';
        if (guestSection) guestSection.style.display = 'block';
    }
}

// LOGOUT FUNCTION - Global scope để navbar có thể gọi
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        StorageManager.logout();
        showNotification('Đã đăng xuất thành công', 'success');
        // Đợi 1 giây để người dùng thấy thông báo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Scroll to top button
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--primary-color);
        color: white;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Counter animation
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
}

// Stats counter observer
function initStatsObserver() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Initialize common features
function initCommon() {
    updateCartBadge();
    updateUserUI();
    initScrollToTop();
    initScrollAnimations();
    initStatsObserver();
    initSmoothScroll();
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', initCommon);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, formatCurrency, showNotification, loadProducts, logout };
}