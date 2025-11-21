// Main Peta Page Class
class PetaPage {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.markers = [];
        this.currentLocation = null;
        this.allLocations = [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.route = null;
        this.isLegendVisible = true;
        this.locationData = null;
        this.init();
    }
    
    async init() {
        await this.loadLocationData();
        this.setupTheme();
        this.setupEventListeners();
        this.startRealTimeClock();
        this.initMap();
        this.loadLocations();
        this.hideLoadingScreen();
    }
    
    async loadLocationData() {
        if (window.locationData) {
            this.locationData = window.locationData;
        } else {
            // Fallback jika locations.js tidak terload
            this.locationData = {
                allLocations: [],
                getLocationsByType: () => [],
                getPopularDestinations: () => []
            };
        }
    }
    
    setupTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = this.theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    }
    
    startRealTimeClock() {
        const updateClock = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Jakarta'
            };
            
            const dateTime = now.toLocaleDateString('id-ID', options);
            const clockElement = document.getElementById('realTimeClock');
            if (clockElement) clockElement.textContent = dateTime;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading');
            if (loadingScreen) loadingScreen.classList.add('hidden');
        }, 1000);
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-bs-theme', this.theme);
                localStorage.setItem('theme', this.theme);
                this.setupTheme();
            });
        }

        // Location access
        const locationAccess = document.getElementById('locationAccess');
        if (locationAccess) {
            locationAccess.addEventListener('click', () => this.getUserLocation());
        }

        // Search functionality
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchLocation());
        }

        const mapSearch = document.getElementById('mapSearch');
        if (mapSearch) {
            mapSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchLocation();
            });
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        const distanceFilter = document.getElementById('distanceFilter');
        if (distanceFilter) {
            distanceFilter.addEventListener('change', (e) => {
                this.filterByDistance(e.target.value);
            });
        }

        // Map controls
        const currentLocationBtn = document.getElementById('currentLocationBtn');
        if (currentLocationBtn) {
            currentLocationBtn.addEventListener('click', () => {
                this.centerToUserLocation();
            });
        }

        const resetMapBtn = document.getElementById('resetMapBtn');
        if (resetMapBtn) {
            resetMapBtn.addEventListener('click', () => {
                this.resetMap();
            });
        }

        const legendToggle = document.getElementById('legendToggle');
        if (legendToggle) {
            legendToggle.addEventListener('click', () => {
                this.toggleLegend();
            });
        }

        const zoomInBtn = document.getElementById('zoomInBtn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.map.zoomIn();
            });
        }

        const zoomOutBtn = document.getElementById('zoomOutBtn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.map.zoomOut();
            });
        }

        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) categoryFilter.value = category;
                this.filterByCategory(category);
            });
        });

        // Back to top
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Scroll events
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            const backToTop = document.getElementById('backToTop');
            
            if (window.scrollY > 100) {
                if (navbar) navbar.classList.add('scrolled');
                if (backToTop) backToTop.classList.add('show');
            } else {
                if (navbar) navbar.classList.remove('scrolled');
                if (backToTop) backToTop.classList.remove('show');
            }
        });
    }

    initMap() {
        this.map = L.map('map').setView([-7.8232, 112.0178], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        this.map.on('click', () => {
            this.updateLocationInfo('Klik marker di peta untuk melihat detail lokasi');
        });
    }

    loadLocations() {
        this.allLocations = this.locationData.allLocations;
        this.createMarkers();
        this.loadPopularDestinations();
    }

    createMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        this.allLocations.forEach(location => {
            const icon = this.createCustomIcon(location.type);
            
            const marker = L.marker(location.position, { icon: icon })
                .addTo(this.map)
                .bindPopup(this.createPopupContent(location));

            marker.on('click', () => {
                this.showLocationDetails(location);
                marker.openPopup();
            });

            this.markers.push(marker);
        });
    }

    createCustomIcon(type) {
        const colors = {
            'wisata': '#2c786c',
            'kuliner': '#ff9800',
            'budaya': '#10b981',
            'hotel': '#3b82f6',
            'transport': '#6b7280',
            'emergency': '#ef4444',
            'shopping': '#8b5cf6'
        };

        const color = colors[type] || '#2c786c';
        
        const icons = {
            'wisata': '🏞️',
            'kuliner': '🍽️',
            'budaya': '🎭',
            'hotel': '🏨',
            'transport': '🚗',
            'emergency': '🚨',
            'shopping': '🛍️'
        };

        const icon = icons[type] || '📍';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background: ${color};
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    color: white;
                    font-weight: bold;
                ">
                    ${icon}
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
    }

    createPopupContent(location) {
        return `
            <div class="map-popup">
                <h6 class="fw-bold mb-2">${location.name}</h6>
                <div class="rating mb-2">
                    <i class="bi bi-star-fill text-warning"></i>
                    <span class="fw-semibold">${location.rating}</span>
                    <small class="text-muted">(${location.reviews} ulasan)</small>
                    <span class="badge bg-${this.getCategoryColor(location.type)} ms-2">${location.category}</span>
                </div>
                <p class="mb-2 small">${location.description}</p>
                <div class="location-meta small text-muted mb-2">
                    <div><i class="bi bi-tag"></i> ${location.price}</div>
                    <div><i class="bi bi-clock"></i> ${location.openHours}</div>
                    <div><i class="bi bi-signpost"></i> ${location.distance}</div>
                </div>
                <button class="btn btn-primary btn-sm w-100" onclick="petaPage.showDirections(${location.position[0]}, ${location.position[1]})">
                    <i class="bi bi-signpost"></i> Lihat Rute
                </button>
            </div>
        `;
    }

    getCategoryColor(type) {
        const colors = {
            'wisata': 'success',
            'kuliner': 'warning',
            'budaya': 'info',
            'hotel': 'primary',
            'transport': 'secondary',
            'emergency': 'danger',
            'shopping': 'info'
        };
        return colors[type] || 'primary';
    }

    showLocationDetails(location) {
        const container = document.getElementById('locationDetails');
        if (!container) return;

        container.innerHTML = `
            <div class="location-details">
                <h6 class="fw-bold mb-2">${location.name}</h6>
                <div class="rating mb-2">
                    <i class="bi bi-star-fill text-warning"></i>
                    <span class="fw-semibold">${location.rating}</span>
                    <small class="text-muted">(${location.reviews} ulasan)</small>
                    <span class="badge bg-${this.getCategoryColor(location.type)} ms-2">${location.category}</span>
                </div>
                <p class="mb-3">${location.description}</p>
                
                <div class="location-info mb-3">
                    <div class="info-item mb-2">
                        <i class="bi bi-tag text-primary"></i>
                        <span class="ms-2 fw-semibold">${location.price}</span>
                    </div>
                    <div class="info-item mb-2">
                        <i class="bi bi-clock text-primary"></i>
                        <span class="ms-2">${location.openHours}</span>
                    </div>
                    <div class="info-item mb-2">
                        <i class="bi bi-signpost text-primary"></i>
                        <span class="ms-2">${location.distance}</span>
                    </div>
                    ${location.contact && location.contact !== '-' ? `
                    <div class="info-item mb-2">
                        <i class="bi bi-telephone text-primary"></i>
                        <span class="ms-2">${location.contact}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="d-grid gap-2">
                    <button class="btn btn-primary" onclick="petaPage.showDirections(${location.position[0]}, ${location.position[1]})">
                        <i class="bi bi-signpost"></i> Lihat Rute
                    </button>
                    <button class="btn btn-outline-primary" onclick="petaPage.saveLocation(${location.id})">
                        <i class="bi bi-bookmark"></i> Simpan Lokasi
                    </button>
                </div>
            </div>
        `;
    }

    loadPopularDestinations() {
        const popularDestinations = this.locationData.getPopularDestinations();
        const container = document.getElementById('popularDestinations');
        
        if (container && popularDestinations.length > 0) {
            container.innerHTML = popularDestinations.map(location => `
                <div class="location-item" onclick="petaPage.centerToLocation(${location.position[0]}, ${location.position[1]})">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${location.name}</h6>
                            <small class="text-muted">${location.category}</small>
                        </div>
                        <span class="badge bg-primary">${location.rating}</span>
                    </div>
                    <div class="rating small mt-1">
                        <i class="bi bi-star-fill text-warning"></i>
                        <span>${location.rating}</span>
                        <small class="text-muted">(${location.reviews})</small>
                    </div>
                </div>
            `).join('');
        }
    }

    updateLocationInfo(message) {
        const container = document.getElementById('locationDetails');
        if (container) {
            container.innerHTML = `<p class="mb-0 text-muted">${message}</p>`;
        }
    }

    filterByCategory(category) {
        this.markers.forEach(marker => {
            const location = this.allLocations.find(loc => 
                JSON.stringify(loc.position) === JSON.stringify(marker.getLatLng())
            );
            
            if (category === 'all' || (location && location.type === category)) {
                this.map.addLayer(marker);
            } else {
                this.map.removeLayer(marker);
            }
        });

        const visibleMarkers = this.markers.filter(marker => {
            const location = this.allLocations.find(loc => 
                JSON.stringify(loc.position) === JSON.stringify(marker.getLatLng())
            );
            return category === 'all' || (location && location.type === category);
        });

        if (visibleMarkers.length > 0) {
            const group = new L.featureGroup(visibleMarkers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    filterByDistance(distance) {
        if (distance === 'all' || !this.currentLocation) {
            this.markers.forEach(marker => this.map.addLayer(marker));
            return;
        }

        const maxDistance = parseInt(distance) * 1000;

        this.markers.forEach(marker => {
            const location = this.allLocations.find(loc => 
                JSON.stringify(loc.position) === JSON.stringify(marker.getLatLng())
            );
            
            if (location) {
                const locationDistance = this.calculateDistance(
                    this.currentLocation[0],
                    this.currentLocation[1],
                    location.position[0],
                    location.position[1]
                );

                if (locationDistance <= maxDistance) {
                    this.map.addLayer(marker);
                } else {
                    this.map.removeLayer(marker);
                }
            }
        });
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    searchLocation() {
        const mapSearch = document.getElementById('mapSearch');
        if (!mapSearch) return;

        const query = mapSearch.value.toLowerCase().trim();
        if (!query) {
            this.showNotification('Masukkan kata kunci pencarian', 'warning');
            return;
        }

        const results = this.locationData.searchLocations(query);
        
        if (results.length > 0) {
            const found = results[0];
            this.map.setView(found.position, 15);
            const foundMarker = this.markers.find(marker => 
                JSON.stringify(marker.getLatLng()) === JSON.stringify(found.position)
            );
            if (foundMarker) {
                foundMarker.openPopup();
            }
            this.showLocationDetails(found);
            this.showNotification(`"${found.name}" ditemukan! ${results.length > 1 ? `+${results.length - 1} hasil lainnya` : ''}`, 'success');
        } else {
            this.showNotification('Lokasi tidak ditemukan', 'danger');
        }
    }

    getUserLocation() {
        if (!navigator.geolocation) {
            this.showNotification('Browser tidak mendukung geolocation', 'danger');
            return;
        }

        this.showNotification('Mendeteksi lokasi...', 'info');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLocation = [position.coords.latitude, position.coords.longitude];
                this.centerToUserLocation();
                this.updateNearbyPlaces();
                this.showNotification('Lokasi terdeteksi!', 'success');
            },
            (error) => {
                let message = 'Tidak dapat mengakses lokasi';
                if (error.code === error.PERMISSION_DENIED) {
                    message = 'Akses lokasi ditolak';
                }
                this.showNotification(message, 'danger');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    centerToUserLocation() {
        if (!this.currentLocation) {
            this.getUserLocation();
            return;
        }

        this.map.setView(this.currentLocation, 15);

        if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
        }

        this.userMarker = L.marker(this.currentLocation, {
            icon: L.divIcon({
                className: 'user-marker',
                html: `
                    <div style="
                        background: #ef4444;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 14px;
                    ">
                        <i class="bi bi-person-fill"></i>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            })
        })
        .addTo(this.map)
        .bindPopup('<strong>Lokasi Anda</strong>')
        .openPopup();
    }

    updateNearbyPlaces() {
        if (!this.currentLocation) return;

        const nearby = this.allLocations
            .map(location => {
                const distance = this.calculateDistance(
                    this.currentLocation[0],
                    this.currentLocation[1],
                    location.position[0],
                    location.position[1]
                );
                return { ...location, calculatedDistance: (distance / 1000).toFixed(1) };
            })
            .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
            .slice(0, 5);

        const container = document.getElementById('nearbyPlaces');
        if (container) {
            if (nearby.length === 0) {
                container.innerHTML = '<p class="text-muted mb-0">Tidak ada tempat terdekat</p>';
                return;
            }

            container.innerHTML = nearby.map(location => `
                <div class="location-item" onclick="petaPage.centerToLocation(${location.position[0]}, ${location.position[1]})">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${location.name}</h6>
                            <small class="text-muted">${location.category}</small>
                        </div>
                        <span class="badge bg-primary">${location.calculatedDistance} km</span>
                    </div>
                    <div class="rating small mt-1">
                        <i class="bi bi-star-fill text-warning"></i>
                        <span>${location.rating}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    centerToLocation(lat, lng) {
        this.map.setView([lat, lng], 15);
        const marker = this.markers.find(m => 
            JSON.stringify(m.getLatLng()) === JSON.stringify([lat, lng])
        );
        if (marker) marker.openPopup();
    }

    showDirections(destLat, destLng) {
        if (!this.currentLocation) {
            this.showNotification('Aktifkan lokasi terlebih dahulu untuk melihat rute', 'warning');
            this.getUserLocation();
            return;
        }

        const start = this.currentLocation;
        const end = [destLat, destLng];
        
        const distance = this.calculateDistance(start[0], start[1], end[0], end[1]);
        const estimatedTime = Math.round((distance / 1000) * 2.5);

        this.showNotification(`Perkiraan jarak: ${(distance / 1000).toFixed(1)} km, Waktu: ${estimatedTime} menit`, 'info');

        if (this.route) {
            this.map.removeLayer(this.route);
        }

        this.route = L.polyline([start, end], {
            color: '#2c786c',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(this.map);

        this.map.fitBounds([start, end]);
    }

    toggleLegend() {
        const legend = document.getElementById('mapLegend');
        if (legend) {
            this.isLegendVisible = !this.isLegendVisible;
            legend.style.display = this.isLegendVisible ? 'block' : 'none';
            this.showNotification(this.isLegendVisible ? 'Legenda ditampilkan' : 'Legenda disembunyikan', 'info');
        }
    }

    toggleFullscreen() {
        const mapContainer = document.querySelector('.map-container');
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen().catch(err => {
                this.showNotification('Fullscreen tidak didukung', 'warning');
            });
        } else {
            document.exitFullscreen();
        }
    }

    resetMap() {
        this.map.setView([-7.8232, 112.0178], 13);
        
        const categoryFilter = document.getElementById('categoryFilter');
        const distanceFilter = document.getElementById('distanceFilter');
        const mapSearch = document.getElementById('mapSearch');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (distanceFilter) distanceFilter.value = 'all';
        if (mapSearch) mapSearch.value = '';
        
        this.filterByCategory('all');
        
        if (this.route) {
            this.map.removeLayer(this.route);
            this.route = null;
        }
        
        if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
            this.userMarker = null;
        }
        
        this.updateLocationInfo('Klik marker di peta untuk melihat detail lokasi');
        this.showNotification('Peta telah direset', 'info');
    }

    saveLocation(locationId) {
        const favorites = JSON.parse(localStorage.getItem('kediriFavorites') || '[]');
        
        if (favorites.includes(locationId)) {
            this.showNotification('Lokasi sudah ada di favorit', 'info');
        } else {
            favorites.push(locationId);
            localStorage.setItem('kediriFavorites', JSON.stringify(favorites));
            this.showNotification('Lokasi disimpan ke favorit!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const types = {
            success: { icon: 'check-circle-fill', color: 'success' },
            danger: { icon: 'x-circle-fill', color: 'danger' },
            info: { icon: 'info-circle-fill', color: 'info' },
            warning: { icon: 'exclamation-triangle-fill', color: 'warning' }
        };
        
        const notif = types[type] || types.info;
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="bi bi-${notif.icon}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 5000);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.petaPage = new PetaPage();
});