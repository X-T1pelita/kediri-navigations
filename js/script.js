// js/script.js

class KediriTourism {
    constructor() {
        this.currentLocation = null;
        this.nearbyDestinations = [];
        this.searchData = [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.language = localStorage.getItem('language') || 'id';
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.loadInitialData();
        this.setupServiceWorker();
        this.setupLocationService();
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        this.updateThemeToggleIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeToggleIcon();
    }

    updateThemeToggleIcon() {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Location access
        const locationAccess = document.getElementById('locationAccess');
        if (locationAccess) {
            locationAccess.addEventListener('click', () => {
                this.requestLocationPermission();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
            searchInput.addEventListener('focus', this.showSearchResults.bind(this));
        }

        // Back to top
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }

        // Loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 1000);
        });
    }

    // Data Loading
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadDestinations(),
                this.loadCulinary(),
                this.loadCulture(),
                this.loadWeather(),
                this.loadEvents()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    async loadDestinations() {
        const destinations = [
            {
                id: 1,
                name: "Gunung Kelud",
                category: "Alam",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                rating: 4.8,
                description: "Gunung berapi aktif dengan kawah yang menakjubkan dan pemandangan alam yang memukau.",
                distance: "25 km dari pusat kota",
                price: "Rp 15.000",
                featured: true,
                lat: -7.9345,
                lng: 112.3182
            },
            {
                id: 2,
                name: "Candi Surowono",
                category: "Sejarah",
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
                rating: 4.5,
                description: "Candi peninggalan Kerajaan Majapahit dengan arsitektur yang masih terawat.",
                distance: "18 km dari pusat kota",
                price: "Rp 10.000",
                featured: true,
                lat: -7.7896,
                lng: 112.1567
            },
            {
                id: 3,
                name: "Air Terjun Dolo",
                category: "Alam",
                image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
                rating: 4.7,
                description: "Air terjun dengan ketinggian 125 meter dikelilingi hutan yang asri.",
                distance: "30 km dari pusat kota",
                price: "Rp 12.000",
                featured: true,
                lat: -7.9123,
                lng: 112.2845
            },
            {
                id: 4,
                name: "Alun-alun Kediri",
                category: "Kota",
                image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
                rating: 4.3,
                description: "Pusat kota dengan taman yang indah, cocok untuk bersantai dan berolahraga.",
                distance: "0.5 km dari pusat kota",
                price: "Gratis",
                featured: true,
                lat: -7.8215,
                lng: 112.0169
            }
        ];

        this.renderDestinations(destinations);
        this.searchData = [...this.searchData, ...destinations];
        this.nearbyDestinations = destinations; // Store for findNearbyDestinations
    }

    async loadCulinary() {
        const culinary = [
            {
                id: 5,
                name: "Tahu Takwa",
                category: "Makanan",
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
                price: "Rp 5.000 - 15.000",
                description: "Tahu khas Kediri dengan tekstur kenyal dan rasa yang gurih.",
                rating: 4.9,
                featured: true,
                lat: -7.8189,
                lng: 112.0177
            },
            {
                id: 6,
                name: "Soto Kediri",
                category: "Makanan",
                image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
                price: "Rp 12.000 - 25.000",
                description: "Soto ayam dengan kuah bening khas dan sambal yang menggugah selera.",
                rating: 4.7,
                featured: true,
                lat: -7.8200,
                lng: 112.0180
            }
        ];

        this.renderCulinary(culinary);
        this.searchData = [...this.searchData, ...culinary];
        this.nearbyDestinations = [...this.nearbyDestinations, ...culinary];
    }

    async loadCulture() {
        const culture = [
            {
                id: 7,
                name: "Tari Jaranan",
                category: "Seni",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
                description: "Tari tradisional dengan properti kuda lumping yang penuh mistis.",
                featured: true
            },
            {
                id: 8,
                name: "Batik Kediri",
                category: "Kerajinan",
                image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
                description: "Batik dengan motif khas yang terinspirasi dari alam dan sejarah Kediri.",
                featured: true
            }
        ];

        this.renderCulture(culture);
        this.searchData = [...this.searchData, ...culture];
    }

    async loadWeather() {
        const weatherData = {
            temperature: 28,
            condition: "Cerah Berawan",
            humidity: 65,
            wind: 12
        };

        this.renderWeather(weatherData);
    }

    async loadEvents() {
        const events = [
            {
                id: 1,
                title: "Festival Tahu Takwa",
                date: "15 Agustus 2024",
                location: "Alun-alun Kediri",
                category: "Kuliner"
            },
            {
                id: 2,
                title: "Pertunjukan Tari Jaranan",
                date: "20 Agustus 2024",
                location: "Taman Sekartaji",
                category: "Budaya"
            }
        ];

        this.renderEvents(events);
    }

    // Rendering Methods
    renderDestinations(destinations) {
        const container = document.getElementById('destinationsGrid');
        if (!container) return;

        container.innerHTML = destinations.map(dest => `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card destination-card h-100">
                    <div class="position-relative">
                        <img src="${dest.image}" class="card-img-top" alt="${dest.name}" loading="lazy">
                        <span class="badge bg-primary">${dest.category}</span>
                        <div class="card-overlay">
                            <div class="rating">
                                <i class="bi bi-star-fill"></i>
                                <span>${dest.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${dest.name}</h5>
                        <p class="card-text">${dest.description}</p>
                        <div class="destination-meta">
                            <small class="text-muted"><i class="bi bi-geo-alt"></i> ${dest.distance}</small>
                            <small class="text-muted"><i class="bi bi-tag"></i> ${dest.price}</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <a href="pages/wisata.html" class="btn btn-primary btn-sm">Selengkapnya</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCulinary(culinary) {
        const container = document.getElementById('culinaryGrid');
        if (!container) return;

        container.innerHTML = culinary.map(item => `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card culinary-card h-100">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <div class="culinary-meta">
                            <div class="rating">
                                <i class="bi bi-star-fill text-warning"></i>
                                <span>${item.rating}</span>
                            </div>
                            <span class="price">${item.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCulture(culture) {
        const container = document.getElementById('cultureGrid');
        if (!container) return;

        container.innerHTML = culture.map(item => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card culture-card h-100">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <span class="badge bg-secondary">${item.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderWeather(weather) {
        const container = document.getElementById('weatherInfo');
        if (!container) return;

        container.innerHTML = `
            <div class="weather-info">
                <div class="weather-icon">
                    <i class="bi bi-cloud-sun"></i>
                </div>
                <div class="weather-details">
                    <h3>${weather.temperature}°C</h3>
                    <p class="mb-1">${weather.condition}</p>
                    <small class="text-muted">
                        Kelembaban: ${weather.humidity}% | Angin: ${weather.wind} km/jam
                    </small>
                </div>
            </div>
        `;
    }

    renderEvents(events) {
        const container = document.getElementById('upcomingEvents');
        if (!container) return;

        container.innerHTML = events.map(event => `
            <div class="event-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${event.title}</h6>
                        <small class="text-muted">
                            <i class="bi bi-calendar"></i> ${event.date} | 
                            <i class="bi bi-geo-alt"></i> ${event.location}
                        </small>
                    </div>
                    <span class="badge bg-primary">${event.category}</span>
                </div>
            </div>
        `).join('');
    }

    // Search Functionality
    handleSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        const resultsContainer = document.getElementById('autocompleteResults');

        if (!resultsContainer) return;

        if (query.length < 2) {
            resultsContainer.classList.remove('show');
            return;
        }

        const results = this.searchData.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        ).slice(0, 5);

        this.renderSearchResults(results);
        resultsContainer.classList.add('show');
    }

    renderSearchResults(results) {
        const container = document.getElementById('autocompleteResults');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<div class="autocomplete-item">Tidak ada hasil</div>';
            return;
        }

        container.innerHTML = results.map(item => `
            <div class="autocomplete-item" data-id="${item.id}" data-type="${item.category}">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="search-thumb me-3" loading="lazy">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleSearchItemClick(item.dataset.id, item.dataset.type);
            });
        });
    }

    showSearchResults() {
        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('autocompleteResults');
        
        if (!searchInput || !resultsContainer) return;

        const query = searchInput.value;
        if (query.length >= 2) {
            resultsContainer.classList.add('show');
        }
    }

    handleSearchItemClick(id, type) {
        const item = this.searchData.find(d => d.id == id);
        if (item) {
            let url = '';
            switch (type) {
                case 'Alam':
                case 'Sejarah':
                case 'Kota':
                    url = `pages/wisata.html`;
                    break;
                case 'Makanan':
                    url = `pages/kuliner.html`;
                    break;
                case 'Seni':
                case 'Kerajinan':
                    url = `pages/budaya.html`;
                    break;
            }
            if (url) window.location.href = url;
        }
    }

    // Location Services
    setupLocationService() {
        if (navigator.geolocation) {
            this.getCurrentLocation();
        } else {
            this.updateLocationInfo('Geolocation tidak didukung oleh browser ini');
        }
    }

    requestLocationPermission() {
        if (!navigator.geolocation) {
            this.showNotification('Browser Anda tidak mendukung geolocation', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                this.handleLocationSuccess(position);
            },
            error => {
                this.handleLocationError(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    getCurrentLocation() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            position => {
                this.handleLocationSuccess(position);
                this.startLocationTracking();
                this.calculateNearbyDestinations(position.coords);
                this.updateMapWithLocation(position.coords);
            },
            error => {
                this.handleLocationError(error);
            }
        );
    }

    handleLocationSuccess(position) {
        const coords = position.coords;
        this.currentLocation = coords;
        
        this.reverseGeocode(coords.latitude, coords.longitude);
        this.calculateNearbyDestinations(coords);
    }

    handleLocationError(error) {
        let message = 'Tidak dapat mengakses lokasi';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = 'Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Informasi lokasi tidak tersedia.';
                break;
            case error.TIMEOUT:
                message = 'Permintaan lokasi timeout.';
                break;
        }
        
        this.updateLocationInfo(message);
    }

    async reverseGeocode(lat, lng) {
        const address = await this.simulateReverseGeocode(lat, lng);
        this.updateLocationInfo(`Lokasi terdeteksi: ${address}`);
    }

    simulateReverseGeocode(lat, lng) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('Kota Kediri, Jawa Timur');
            }, 1000);
        });
    }

    // NEW METHOD - Fixed findNearbyDestinations
    findNearbyDestinations(coords) {
        if (!coords || !this.nearbyDestinations || this.nearbyDestinations.length === 0) {
            return [];
        }

        const nearby = this.nearbyDestinations
            .filter(dest => dest.lat && dest.lng)
            .map(dest => {
                const distance = this.calculateDistance(
                    coords.latitude,
                    coords.longitude,
                    dest.lat,
                    dest.lng
                );
                return { ...dest, calculatedDistance: distance };
            })
            .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
            .slice(0, 5);

        return nearby;
    }

    calculateNearbyDestinations(coords) {
        const nearby = this.findNearbyDestinations(coords);
        
        if (nearby.length > 0) {
            const nearbyAttractions = document.getElementById('nearbyAttractions');
            if (nearbyAttractions) {
                const nearest = nearby[0];
                nearbyAttractions.textContent = 
                    `Destinasi terdekat: ${nearest.name} (${nearest.calculatedDistance.toFixed(1)} km)`;
            }
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    startLocationTracking() {
        if (navigator.geolocation) {
            this.watchId = navigator.geolocation.watchPosition(
                position => {
                    this.currentLocation = position.coords;
                    this.updateLocationOnMap(position.coords);
                },
                error => {
                    console.error('Error tracking location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000
                }
            );
        }
    }

    updateLocationInfo(message) {
        const element = document.getElementById('currentLocation');
        if (element) {
            element.textContent = message;
        }
    }

    updateMapWithLocation(coords) {
        if (window.kediriMap) {
            window.kediriMap.updateUserLocation(coords);
        }
    }

    updateLocationOnMap(coords) {
        if (window.kediriMap) {
            window.kediriMap.updateUserMarker(coords);
        }
    }

    // Newsletter
    handleNewsletterSubmit(event) {
        event.preventDefault();
        const emailInput = event.target.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        const email = emailInput.value;
        
        this.subscribeNewsletter(email)
            .then(() => {
                this.showNotification('Berhasil berlangganan newsletter!', 'success');
                event.target.reset();
            })
            .catch(error => {
                this.showNotification('Gagal berlangganan. Silakan coba lagi.', 'error');
            });
    }

    subscribeNewsletter(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email.includes('@')) {
                    resolve();
                } else {
                    reject(new Error('Invalid email'));
                }
            }, 1000);
        });
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            minWidth: '300px'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Utility Methods
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.kediriTourism = new KediriTourism();
});

// Global functions for HTML onclick attributes
function scrollToSection(sectionId) {
    if (window.kediriTourism) {
        window.kediriTourism.scrollToSection(sectionId);
    }
}