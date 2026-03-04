// ==================== ABOUT PAGE JAVASCRIPT ====================

// Team members data
const teamMembers = [
    {
        id: 1,
        name: "Nguyễn Văn Minh",
        position: "Giám Đốc Điều Hành",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        experience: "15+ năm",
        expertise: "Quản trị doanh nghiệp",
        bio: "Người sáng lập và định hướng chiến lược phát triển cho Hương Trầm Việt. Với tầm nhìn xa và đam mê bảo tồn nghề truyền thống, ông đã dẫn dắt công ty trở thành thương hiệu uy tín hàng đầu."
    },
    {
        id: 2,
        name: "Trần Thị Hương",
        position: "Giám Đốc Sản Xuất",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
        experience: "12+ năm",
        expertise: "Công nghệ sản xuất nhang",
        bio: "Chuyên gia hàng đầu về quy trình sản xuất nhang trầm. Bà đã nghiên cứu và phát triển nhiều công thức độc quyền, đảm bảo chất lượng sản phẩm luôn đạt chuẩn cao nhất."
    },
    {
        id: 3,
        name: "Lê Hoàng Nam",
        position: "Trưởng Phòng Nghiên Cứu",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
        experience: "10+ năm",
        expertise: "R&D, Phát triển sản phẩm",
        bio: "Chuyên gia nghiên cứu và phát triển sản phẩm mới. Anh đã tạo ra nhiều dòng nhang độc đáo, kết hợp giữa truyền thống và hiện đại, mang lại trải nghiệm tốt nhất cho khách hàng."
    },
    {
        id: 4,
        name: "Phạm Thị Lan",
        position: "Giám Đốc Marketing",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
        experience: "8+ năm",
        expertise: "Marketing & Branding",
        bio: "Người xây dựng và phát triển thương hiệu Hương Trầm Việt. Với chiến lược marketing hiệu quả, bà đã giúp công ty tiếp cận và chinh phục hàng ngàn khách hàng trên toàn quốc."
    }
];

// Load team members
function loadTeam() {
    const grid = document.getElementById('teamGrid');
    
    teamMembers.forEach(member => {
        const teamCard = `
            <div class="col-md-6 col-lg-3">
                <div class="team-card card" onclick="showMemberDetail(${member.id})">
                    <div class="position-relative overflow-hidden">
                        <img src="${member.image}" class="card-img-top" alt="${member.name}">
                        <div class="team-overlay">
                            <button class="btn btn-light btn-sm">
                                <i class="bi bi-info-circle me-2"></i>Xem chi tiết
                            </button>
                        </div>
                    </div>
                    <div class="card-body text-center">
                        <h5 class="fw-bold mb-1">${member.name}</h5>
                        <p class="text-primary-custom small mb-2">${member.position}</p>
                        <p class="text-muted small mb-0">
                            <i class="bi bi-award me-1"></i>${member.experience}
                        </p>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += teamCard;
    });
}

// Show team member detail in modal
function showMemberDetail(memberId) {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById('modalMemberName').textContent = member.name;
    document.getElementById('modalMemberImage').src = member.image;
    document.getElementById('modalMemberPosition').textContent = member.position;
    document.getElementById('modalMemberBio').textContent = member.bio;
    document.getElementById('modalMemberExperience').textContent = member.experience;
    document.getElementById('modalMemberExpertise').textContent = member.expertise;

    // Show modal
    new bootstrap.Modal(document.getElementById('teamModal')).show();
}

// Animate timeline items on scroll
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        observer.observe(item);
    });
}

// Initialize about page
document.addEventListener('DOMContentLoaded', () => {
    loadTeam();
    animateTimeline();
    
    console.log('About page loaded successfully!');
});