// ==================== CHATBOX FUNCTIONALITY ====================

class ChatBox {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatBox();
        this.attachEventListeners();
        this.loadPredefinedResponses();
    }

    createChatBox() {
        const chatBoxHTML = `
            <!-- Chat Toggle Button -->
            <div class="chatbox-toggle" id="chatboxToggle">
                <i class="bi bi-chat-dots"></i>
            </div>

            <!-- Chat Container -->
            <div class="chatbox-container" id="chatboxContainer">
                <div class="chatbox-header">
                    <div>
                        <h5 class="mb-0">Hỗ Trợ Trực Tuyến</h5>
                        <small>Chúng tôi luôn sẵn sàng hỗ trợ bạn</small>
                    </div>
                    <button class="btn btn-link text-white p-0" id="chatboxClose">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="chatbox-body" id="chatboxBody">
                    <div class="chat-message bot">
                        <div class="message-bubble">
                            Xin chào! Tôi là trợ lý ảo của Hương Trầm Việt. 
                            Tôi có thể giúp gì cho bạn hôm nay?
                        </div>
                        <small class="text-muted mt-1">${this.getCurrentTime()}</small>
                    </div>
                    <div class="quick-options mt-3">
                        <p class="small text-muted mb-2">Câu hỏi thường gặp:</p>
                        <button class="btn btn-outline-primary btn-sm mb-2 quick-btn" data-question="Sản phẩm của bạn có gì đặc biệt?">
                            Sản phẩm có gì đặc biệt?
                        </button>
                        <button class="btn btn-outline-primary btn-sm mb-2 quick-btn" data-question="Làm thế nào để đặt hàng?">
                            Cách đặt hàng?
                        </button>
                        <button class="btn btn-outline-primary btn-sm mb-2 quick-btn" data-question="Thời gian giao hàng là bao lâu?">
                            Thời gian giao hàng?
                        </button>
                        <button class="btn btn-outline-primary btn-sm mb-2 quick-btn" data-question="Chính sách đổi trả như thế nào?">
                            Chính sách đổi trả?
                        </button>
                    </div>
                </div>
                <div class="chatbox-footer">
                    <div class="chatbox-input">
                        <input type="text" id="chatInput" placeholder="Nhập tin nhắn..." />
                        <button id="chatSend">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatBoxHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatboxToggle');
        const close = document.getElementById('chatboxClose');
        const send = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick question buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.getAttribute('data-question');
                this.sendMessage(question);
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatboxContainer');
        const toggle = document.getElementById('chatboxToggle');
        
        if (this.isOpen) {
            container.classList.add('active');
            toggle.innerHTML = '<i class="bi bi-x-lg"></i>';
        } else {
            container.classList.remove('active');
            toggle.innerHTML = '<i class="bi bi-chat-dots"></i>';
        }
    }

    sendMessage(messageText = null) {
        const input = document.getElementById('chatInput');
        const message = messageText || input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(text, sender) {
        const chatBody = document.getElementById('chatboxBody');
        const messageHTML = `
            <div class="chat-message ${sender}">
                <div class="message-bubble">${text}</div>
                <small class="text-muted mt-1">${this.getCurrentTime()}</small>
            </div>
        `;
        
        chatBody.insertAdjacentHTML('beforeend', messageHTML);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        this.messages.push({ text, sender, time: new Date() });
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    loadPredefinedResponses() {
        this.responses = {
            'sản phẩm': 'Sản phẩm của chúng tôi được làm từ 100% trầm hương tự nhiên, không pha tạp chất. Mỗi sản phẩm đều được kiểm định chất lượng và đóng gói cẩn thận.',
            'đặc biệt': 'Nhang trầm của chúng tôi đặc biệt ở chất lượng nguyên liệu cao cấp, quy trình sản xuất thủ công truyền thống và mùi hương thanh tao, lưu lâu.',
            'đặt hàng': 'Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và điền thông tin giao hàng. Hoặc liên hệ hotline: 0901234567',
            'giao hàng': 'Thời gian giao hàng từ 2-3 ngày với đơn hàng nội thành, 3-5 ngày với đơn hàng ngoại thành. Miễn phí ship cho đơn hàng trên 500.000đ.',
            'thanh toán': 'Chúng tôi hỗ trợ thanh toán COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng và thanh toán qua ví điện tử.',
            'đổi trả': 'Chúng tôi chấp nhận đổi trả trong vòng 7 ngày nếu sản phẩm bị lỗi hoặc không đúng mô tả. Sản phẩm cần còn nguyên vẹn, chưa sử dụng.',
            'liên hệ': 'Bạn có thể liên hệ với chúng tôi qua:\n- Hotline: 0901234567\n- Email: contact@huongtramviet.com\n- Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM',
            'giá': 'Giá sản phẩm dao động từ 280.000đ - 420.000đ tùy vào loại sản phẩm. Chúng tôi thường xuyên có chương trình khuyến mãi.',
            'chào': 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tư vấn về sản phẩm nào?',
            'default': 'Cảm ơn bạn đã liên hệ. Để được hỗ trợ tốt nhất, vui lòng liên hệ hotline: 0901234567 hoặc email: contact@huongtramviet.com'
        };
    }

    getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (let keyword in this.responses) {
            if (lowerMessage.includes(keyword)) {
                return this.responses[keyword];
            }
        }
        
        return this.responses['default'];
    }
}

// Initialize chatbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatbox = new ChatBox();
    console.log('ChatBox initialized');
});