const productsData = {
    "products": [
        {
            "id": 1,
            "name": "Nhang Trầm Hương Cao Cấp",
            "category": "Trầm Hương",
            "image": "./img/1.jpg",
            "price": 350000,
            "priceFormatted": "350.000đ",
            "description": "Nhang trầm hương cao cấp từ gỗ trầm tự nhiên, hương thơm thanh tao, lưu mùi lâu. Thích hợp cho không gian thiền định, thờ cúng và thư giãn.",
            "quantity": "100 que/hộp",
            "burnTime": "45 phút/que",
            "ingredients": [
                "Gỗ trầm tự nhiên 80%",
                "Bột nan hương 15%",
                "Chất kết dính thực vật 5%"
            ],
            "badge": "Bán chạy",
            "stock": 50
        },
        {
            "id": 2,
            "name": "Nhang Nụ Trầm Hương",
            "category": "Nụ Trầm",
            "image": "./img/2.jpg",
            "price": 280000,
            "priceFormatted": "280.000đ",
            "description": "Nhang nụ trầm hương dạng tháp, cháy chậm, tỏa hương đều. Thích hợp đặt trong phòng khách, phòng ngủ hoặc văn phòng.",
            "quantity": "50 nụ/hộp",
            "burnTime": "2 giờ/nụ",
            "ingredients": [
                "Gỗ trầm nghệ 75%",
                "Bột trầm 20%",
                "Chất liên kết tự nhiên 5%"
            ],
            "badge": "Mới",
            "stock": 30
        },
        {
            "id": 3,
            "name": "Nhang Vòng Trầm Hương",
            "category": "Nhang Vòng",
            "image": "./img/3.jpg",
            "price": 420000,
            "priceFormatted": "420.000đ",
            "description": "Nhang vòng trầm hương cháy lâu, thơm dịu nhẹ. Phù hợp cho các không gian rộng, phòng thờ, quán cà phê.",
            "quantity": "20 vòng/hộp",
            "burnTime": "4 giờ/vòng",
            "ingredients": [
                "Gỗ trầm Khánh Hòa 70%",
                "Bột dó giấy 25%",
                "Tinh dầu trầm 5%"
            ],
            "badge": "Cao cấp",
            "stock": 20
        },
        {
            "id": 4,
            "name": "Nhang Trầm Huế",
            "category": "Trầm Huế",
            "image": "./img/4.jpg",
            "price": 300000,
            "priceFormatted": "300.000đ",
            "description": "Nhang trầm truyền thống xứ Huế, hương thơm đặc trưng, thanh nhã. Sản phẩm được làm thủ công theo công thức cổ truyền.",
            "quantity": "80 que/hộp",
            "burnTime": "40 phút/que",
            "ingredients": [
                "Gỗ trầm Quảng Nam 80%",
                "Bột cây bồ đề 15%",
                "Nhựa thông tự nhiên 5%"
            ],
            "badge": null,
            "stock": 40
        },
        {
            "id": 5,
            "name": "Nhang Trầm Quảng Nam",
            "category": "Trầm Hương",
            "image": "./img/5.jpg",
            "price": 380000,
            "priceFormatted": "380.000đ",
            "description": "Nhang trầm Quảng Nam nổi tiếng với mùi hương đặc trưng, ngọt ngào và tinh tế. Được chiết xuất từ gỗ trầm tự nhiên vùng Quảng Nam.",
            "quantity": "100 que/hộp",
            "burnTime": "50 phút/que",
            "ingredients": [
                "Gỗ trầm Quảng Nam 85%",
                "Bột gỗ tự nhiên 10%",
                "Chất kết dính hữu cơ 5%"
            ],
            "badge": null,
            "stock": 35
        },
        {
            "id": 6,
            "name": "Nhang Nụ Cao Cấp",
            "category": "Nụ Trầm",
            "image": "./img/6.jpg",
            "price": 320000,
            "priceFormatted": "320.000đ",
            "description": "Nhang nụ cao cấp với thiết kế tinh xảo, cháy lâu và đều. Thích hợp cho không gian sang trọng và yên tĩnh.",
            "quantity": "40 nụ/hộp",
            "burnTime": "3 giờ/nụ",
            "ingredients": [
                "Gỗ trầm tuyển chọn 80%",
                "Bột trầm nguyên chất 15%",
                "Keo tự nhiên 5%"
            ],
            "badge": "Hot",
            "stock": 25
        }
    ]
};

let products = [];

// Initialize products from embedded data
function initProducts() {
    products = productsData.products;
    displayProducts();
}

// Display products on page (only show first 4 featured products)
function displayProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Show only first 4 products on homepage
    const featuredProducts = products.slice(0, 4);
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.innerHTML += productCard;
    });
}

// Helper function to create product card HTML
function createProductCard(product) {
    return `
        <div class="col-md-6 col-lg-3">
            <div class="product-card card h-100">
                <div class="position-relative overflow-hidden">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small">
                        ${product.description.substring(0, 80)}...
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <h5 class="mb-0" style="color: var(--primary-color);">
                            ${product.priceFormatted}
                        </h5>
                        <div>
                            <button class="btn btn-outline-primary btn-sm me-2" 
                                    onclick="addToCartQuick(${product.id})"
                                    title="Thêm vào giỏ hàng">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                            <button class="btn btn-primary btn-sm" 
                                    onclick="showProductDetail(${product.id})">
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show product detail in modal
function showProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductQuantity').textContent = product.quantity;
    document.getElementById('modalProductBurnTime').textContent = product.burnTime;
    document.getElementById('modalProductPrice').textContent = product.priceFormatted;

    const ingredientsList = document.getElementById('modalProductIngredients');
    ingredientsList.innerHTML = '';
    product.ingredients.forEach(ing => {
        ingredientsList.innerHTML += `<li>${ing}</li>`;
    });

    // Store product ID in modal for "Add to Cart" button
    const addToCartBtn = document.getElementById('modalAddToCartBtn');
    addToCartBtn.onclick = () => addToCartFromModal(id);

    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// Add to cart from modal
function addToCartFromModal(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        StorageManager.addToCart(product);
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    }
}

// Quick add to cart (without modal)
function addToCartQuick(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        StorageManager.addToCart(product);
    }
}

// Newsletter subscription
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Vui lòng nhập email', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ', 'danger');
        return;
    }
    
    // Here you would typically send to backend
    showNotification('Đã đăng ký nhận tin thành công!', 'success');
    emailInput.value = '';
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Initialize carousel auto-slide
function initCarousel() {
    const carousel = new bootstrap.Carousel(document.getElementById('heroCarousel'), {
        interval: 5000, // Auto slide every 5 seconds
        wrap: true,
        pause: 'hover'
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initCarousel();
    
    // Setup newsletter form
    const newsletterBtn = document.getElementById('newsletterBtn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', subscribeNewsletter);
    }
    
    const newsletterEmail = document.getElementById('newsletterEmail');
    if (newsletterEmail) {
        newsletterEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                subscribeNewsletter();
            }
        });
    }
    
    console.log('Index page loaded successfully!');
    console.log('Carousel auto-slide enabled (5 seconds interval)');
});
// ==================== SCROLL ANIMATIONS ====================

function initFadeInSections() {
    const sections = document.querySelectorAll('.fade-in-section');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(el => observer.observe(el));
}

// ==================== COUNTER ANIMATION ====================

function animateCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            let current  = 0;
            const step   = Math.ceil(target / 60);
            const timer  = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current.toLocaleString('vi-VN') + suffix;
            }, 25);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    initFadeInSections();
    animateCounters();
});