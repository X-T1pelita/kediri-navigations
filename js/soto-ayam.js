class SotoAyamPage {
    constructor() {
        this.currentUserRating = 0;
        this.reviews = [];
        this.currentPage = 1;
        this.reviewsPerPage = 5;
        this.init();
    }
    
    async init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupGallery();
        await this.loadReviews();
        this.setupScrollEffects();
        
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1000);
    }
    
    setupTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', theme);
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    }
    
    setupEventListeners() {
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('locationAccess').addEventListener('click', () => {
            this.requestLocation();
        });
        
        document.getElementById('directionBtn').addEventListener('click', () => {
            this.openDirections();
        });
        
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareRestaurant();
        });
        
        document.getElementById('addReviewBtn').addEventListener('click', () => {
            this.showAddReviewModal();
        });
        
        document.getElementById('loadMoreReviews').addEventListener('click', () => {
            this.loadMoreReviews();
        });
        
        this.setupRatingStars();
        
        document.getElementById('submitReview').addEventListener('click', () => {
            this.submitReview();
        });
        
        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    setupGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newSrc = thumb.getAttribute('data-image');
                mainImage.src = newSrc;
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 300);
            });
        });
    }
    
    setupRatingStars() {
        const stars = document.querySelectorAll('.rating-input .stars i');
        const ratingInput = document.getElementById('userRating');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                this.currentUserRating = rating;
                ratingInput.value = rating;
                
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.className = 'bi bi-star-fill active';
                    } else {
                        s.className = 'bi bi-star';
                    }
                });
            });
            
            star.addEventListener('mouseenter', () => {
                const hoverRating = index + 1;
                stars.forEach((s, i) => {
                    if (i < hoverRating) {
                        s.className = 'bi bi-star-fill';
                    } else {
                        s.className = 'bi bi-star';
                    }
                });
            });
            
            star.addEventListener('mouseleave', () => {
                stars.forEach((s, i) => {
                    if (i < this.currentUserRating) {
                        s.className = 'bi bi-star-fill active';
                    } else {
                        s.className = 'bi bi-star';
                    }
                });
            });
        });
    }
    
    async loadReviews() {
        try {
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = this.createSkeletonReviews(3);
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.reviews = [
                {
                    id: 1,
                    name: "Dian Permata",
                    rating: 5,
                    title: "Soto Terenak di Kediri!",
                    text: "Kuahnya bening tapi berasa banget rempahnya. Daging ayam kampungnya empuk dan tidak alot. Sudah langganan sejak masih pakai gerobak.",
                    date: "1 hari yang lalu",
                    photos: [
                        "../../images/restaurant/soto1.jpg",
                        "../../images/restaurant/soto2.jpg"
                    ]
                },
                {
                    id: 2,
                    name: "Rudi Hartono",
                    rating: 5,
                    title: "Autentik Rasa Lamongan",
                    text: "Sebagai orang Lamongan asli, saya akui soto di sini sangat autentik. Bumbunya pas, tidak terlalu kuat tapi berasa rempahnya.",
                    date: "3 hari yang lalu",
                    photos: [
                        "../../images/restaurant/soto3.jpg"
                    ]
                },
                {
                    id: 3,
                    name: "Siti Rahayu",
                    rating: 4,
                    title: "Enak dan Higienis",
                    text: "Sotonya enak, tempatnya bersih, pelayanan cepat. Harga cukup terjangkau untuk kualitas yang diberikan. Recommended!",
                    date: "1 minggu yang lalu",
                    photos: []
                },
                {
                    id: 4,
                    name: "Bambang Sugiono",
                    rating: 5,
                    title: "Legendaris dan Konsisten",
                    text: "Sejak 1985 sampai sekarang rasanya tetap sama. Konsistensi inilah yang membuat saya selalu kembali ke sini.",
                    date: "2 minggu yang lalu",
                    photos: [
                        "../../images/restaurant/soto4.jpg"
                    ]
                },
                {
                    id: 5,
                    name: "Maya Wulandari",
                    rating: 4,
                    title: "Tempat Nyaman untuk Makan Keluarga",
                    text: "Suasana restoran nyaman, cocok untuk makan bersama keluarga. Anak-anak saya sangat suka sotonya yang tidak terlalu pedas.",
                    date: "3 minggu yang lalu",
                    photos: []
                },
                {
                    id: 6,
                    name: "Ari Setiawan",
                    rating: 5,
                    title: "Pelayanan Ramah dan Cepat",
                    text: "Selain sotonya yang enak, pelayanannya juga sangat ramah dan cepat. Tidak perlu menunggu lama meski ramai pengunjung.",
                    date: "1 bulan yang lalu",
                    photos: []
                }
            ];
            
            this.displayReviews();
            
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showNotification('Gagal memuat ulasan', 'danger');
        }
    }
    
    createSkeletonReviews(count) {
        let skeletonHTML = '';
        for (let i = 0; i < count; i++) {
            skeletonHTML += `
                <div class="review-item skeleton">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-name skeleton" style="width: 120px; height: 20px; margin-bottom: 8px;"></div>
                            <div class="review-date skeleton" style="width: 80px; height: 16px;"></div>
                        </div>
                        <div class="review-rating skeleton" style="width: 100px; height: 20px;"></div>
                    </div>
                    <div class="review-title skeleton" style="width: 200px; height: 20px; margin-bottom: 12px;"></div>
                    <div class="review-text">
                        <div class="skeleton" style="width: 100%; height: 16px; margin-bottom: 8px;"></div>
                        <div class="skeleton" style="width: 80%; height: 16px; margin-bottom: 8px;"></div>
                        <div class="skeleton" style="width: 60%; height: 16px;"></div>
                    </div>
                </div>
            `;
        }
        return skeletonHTML;
    }
    
    displayReviews() {
        const reviewsList = document.getElementById('reviewsList');
        const startIndex = 0;
        const endIndex = this.currentPage * this.reviewsPerPage;
        const reviewsToShow = this.reviews.slice(startIndex, endIndex);
        
        if (reviewsToShow.length === 0) {
            reviewsList.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-chat-square-text display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">Belum Ada Ulasan</h4>
                    <p class="text-muted">Jadilah yang pertama memberikan ulasan</p>
                </div>
            `;
            return;
        }
        
        reviewsList.innerHTML = reviewsToShow.map(review => `
            <div class="review-item fade-in">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">
                            ${this.renderStars(review.rating)}
                        </div>
                    </div>
                </div>
                <h5 class="review-title">${review.title}</h5>
                <p class="review-text">${review.text}</p>
                ${review.photos.length > 0 ? `
                    <div class="review-photos">
                        ${review.photos.map(photo => `
                            <div class="review-photo">
                                <img src="${photo}" alt="Foto ulasan ${review.name}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        const loadMoreBtn = document.getElementById('loadMoreReviews');
        if (endIndex >= this.reviews.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }
        return stars;
    }
    
    loadMoreReviews() {
        this.currentPage++;
        this.displayReviews();
    }
    
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-bs-theme');
        const theme = current === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        
        this.showNotification(`Mode ${theme === 'dark' ? 'gelap' : 'terang'} diaktifkan`, 'info');
    }
    
    requestLocation() {
        if (!navigator.geolocation) {
            this.showNotification('Browser tidak mendukung geolocation', 'danger');
            return;
        }
        
        this.showNotification('Mendeteksi lokasi...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                this.showNotification('Lokasi terdeteksi!', 'success');
                console.log('User location:', lat, lng);
            },
            (error) => {
                this.showNotification('Gagal mengakses lokasi', 'danger');
            }
        );
    }
    
    openDirections() {
        const address = "Soto Ayam Lamongan Cak Har, Jl. Mayor Bismo No. 12, Kediri";
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    }
    
    shareRestaurant() {
        if (navigator.share) {
            navigator.share({
                title: 'Soto Ayam Lamongan Cak Har - Soto Legendaris Kediri',
                text: 'Coba Soto Ayam Lamongan Cak Har yang sudah legendaris di Kediri sejak 1985!',
                url: window.location.href
            })
            .then(() => this.showNotification('Berhasil dibagikan', 'success'))
            .catch(() => this.showNotification('Gagal membagikan', 'danger'));
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => this.showNotification('Link disalin ke clipboard', 'success'))
                .catch(() => this.showNotification('Gagal menyalin link', 'danger'));
        }
    }
    
    showAddReviewModal() {
        this.currentUserRating = 0;
        document.getElementById('userRating').value = '0';
        document.getElementById('reviewTitle').value = '';
        document.getElementById('reviewText').value = '';
        document.getElementById('reviewPhotos').value = '';
        
        const stars = document.querySelectorAll('.rating-input .stars i');
        stars.forEach(star => {
            star.className = 'bi bi-star';
        });
        
        const modal = new bootstrap.Modal(document.getElementById('addReviewModal'));
        modal.show();
    }
    
    submitReview() {
        const title = document.getElementById('reviewTitle').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        const rating = this.currentUserRating;
        
        if (rating === 0) {
            this.showNotification('Harap berikan rating', 'danger');
            return;
        }
        
        if (!title) {
            this.showNotification('Harap isi judul ulasan', 'danger');
            return;
        }
        
        if (!text) {
            this.showNotification('Harap isi ulasan Anda', 'danger');
            return;
        }
        
        this.showNotification('Mengirim ulasan...', 'info');
        
        setTimeout(() => {
            const newReview = {
                id: this.reviews.length + 1,
                name: "Anda",
                rating: rating,
                title: title,
                text: text,
                date: "Baru saja",
                photos: []
            };
            
            this.reviews.unshift(newReview);
            this.displayReviews();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addReviewModal'));
            modal.hide();
            
            this.showNotification('Ulasan berhasil dikirim!', 'success');
        }, 1500);
    }
    
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const backToTop = document.getElementById('backToTop');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    }
    
    setupScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
    
    showNotification(message, type) {
        const types = {
            success: { icon: 'check-circle-fill', color: 'success' },
            danger: { icon: 'x-circle-fill', color: 'danger' },
            info: { icon: 'info-circle-fill', color: 'info' }
        };
        
        const notif = types[type] || types.info;
        
        const alert = document.createElement('div');
        alert.className = `toast-notification ${type}`;
        alert.innerHTML = `
            <i class="bi bi-${notif.icon} fs-4 text-${type === 'error' ? 'danger' : type}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.sotoAyamPage = new SotoAyamPage();
});