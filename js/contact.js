// ==================== CONTACT PAGE JAVASCRIPT ====================

// Character counter for message textarea
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

if (messageTextarea) {
    messageTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        // Limit to 500 characters
        if (length > 500) {
            this.value = this.value.substring(0, 500);
            charCount.textContent = '500';
        }
    });
}

// Form validation and submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.classList.add('was-validated');
            showAlert('Vui lòng điền đầy đủ thông tin!', 'danger');
            return;
        }

        // Validate phone number
        const phone = document.getElementById('phone').value;
        if (!/^0\d{9}$/.test(phone)) {
            showAlert('Số điện thoại không hợp lệ! Vui lòng nhập 10 số bắt đầu bằng 0.', 'danger');
            return;
        }

        // Validate email
        const email = document.getElementById('email').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showAlert('Email không hợp lệ!', 'danger');
            return;
        }

        // Show loading state
        showLoadingAlert();

        // Simulate sending message (in production, this would be an API call)
        setTimeout(() => {
            const name = document.getElementById('fullName').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Store contact message
            saveContactMessage({
                name: name,
                phone: phone,
                email: email,
                subject: subject,
                message: message,
                date: new Date().toISOString()
            });
            
            showSuccessAlert(name);
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                charCount.textContent = '0';
            }, 3000);
        }, 1500);
    });
}

// Show alert message
function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    const icon = type === 'danger' ? 'exclamation-triangle' : 'check-circle';
    
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${icon} me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show loading alert
function showLoadingAlert() {
    const container = document.getElementById('alertContainer');
    container.innerHTML = `
        <div class="alert alert-info d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Đang gửi tin nhắn của bạn...
        </div>
    `;
}

// Show success alert
function showSuccessAlert(name) {
    const container = document.getElementById('alertContainer');
    container.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show">
            <h5 class="alert-heading">
                <i class="bi bi-check-circle-fill me-2"></i>Gửi Thành Công!
            </h5>
            <p class="mb-0">Cảm ơn <strong>${name}</strong> đã liên hệ với chúng tôi!</p>
            <hr>
            <p class="mb-0 small">
                <i class="bi bi-clock me-1"></i>
                Chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Save contact message to localStorage (for demo purposes)
function saveContactMessage(data) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(data);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    console.log('Contact message saved:', data);
}

// Real-time validation for individual fields
['fullName', 'phone', 'email'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
        field.addEventListener('blur', function() {
            if (this.value.trim().length > 0) {
                if (id === 'phone' && !/^0\d{9}$/.test(this.value)) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            }
        });
        
        // Remove validation classes on input
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });
    }
});

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Contact page loaded successfully!');
});