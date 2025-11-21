// js/map.js - Menggunakan OpenStreetMap/Leaflet saja (tanpa Google Maps)

class PetaPage {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.markers = [];
        this.currentLocation = null; 
        this.allLocations = [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.routingControl = null;
        this.init();
    }
    
    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.initMap();
        this.loadLocations();
    }
    
    setupTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }
    
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', this.theme);
                this.setupTheme();
            });
        }

        const locationAccess = document.getElementById('locationAccess');
        if (locationAccess) {
            locationAccess.addEventListener('click', () => {
                this.getUserLocation();
            });
        }

        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.searchLocation();
            });
        }

        const mapSearch = document.getElementById('mapSearch');
        if (mapSearch) {
            mapSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchLocation();
            });
        }

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

        const currentLocationBtn = document.getElementById('currentLocationBtn');
        if (currentLocationBtn) {
            currentLocationBtn.addEventListener('click', () => {
                this.centerToUserLocation();
            });
        }

        const directionsBtn = document.getElementById('directionsBtn');
        if (directionsBtn) {
            directionsBtn.addEventListener('click', () => {
                this.showNotification('Pilih destinasi pada peta untuk melihat rute', 'info');
            });
        }

        const resetMapBtn = document.getElementById('resetMapBtn');
        if (resetMapBtn) {
            resetMapBtn.addEventListener('click', () => {
                this.resetMap();
            });
        }

        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) {
                    categoryFilter.value = category;
                }
                this.filterByCategory(category);
            });
        });

        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            const backToTop = document.getElementById('backToTop');
            
            if (navbar && window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else if (navbar) {
                navbar.classList.remove('scrolled');
            }

            if (backToTop && window.scrollY > 100) {
                backToTop.classList.add('show');
            } else if (backToTop) {
                backToTop.classList.remove('show');
            }
        });

        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    initMap() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([-7.8232, 112.0178], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        this.map.on('click', () => {
            this.updateLocationInfo('Klik marker di peta untuk melihat detail lokasi');
        });
    }

    loadLocations() {
        this.allLocations = [
            {
                id: 1,
                name: "Gunung Kelud",
                type: "wisata",
                position: [-7.9345, 112.3182],
                category: "Wisata Alam",
                rating: 4.8,
                reviews: 1247,
                description: "Gunung berapi aktif dengan kawah yang menakjubkan",
                price: "Rp 15.000",
                openHours: "06:00 - 18:00",
                distance: "25 km"
            },
            {
                id: 2,
                name: "Tahu Takwa Legendaris",
                type: "kuliner",
                position: [-7.8189, 112.0177],
                category: "Makanan Khas",
                rating: 4.9,
                reviews: 892,
                description: "Tahu khas Kediri dengan tekstur kenyal",
                price: "Rp 5.000 - 15.000",
                openHours: "08:00 - 21:00",
                distance: "0.8 km"
            },
            {
                id: 3,
                name: "Candi Surowono",
                type: "wisata",
                position: [-7.7896, 112.1567],
                category: "Wisata Sejarah",
                rating: 4.5,
                reviews: 654,
                description: "Candi peninggalan Kerajaan Majapahit",
                price: "Rp 10.000",
                openHours: "08:00 - 17:00",
                distance: "18 km"
            },
            {
                id: 4,
                name: "Alun-alun Kediri",
                type: "wisata",
                position: [-7.8215, 112.0169],
                category: "Wisata Kota",
                rating: 4.3,
                reviews: 2156,
                description: "Pusat kota dengan taman yang indah",
                price: "Gratis",
                openHours: "24 jam",
                distance: "0.5 km"
            },
            {
                id: 5,
                name: "Hotel Sahid Montana",
                type: "hotel",
                position: [-7.8198, 112.0193],
                category: "Penginapan",
                rating: 4.2,
                reviews: 543,
                description: "Hotel bintang 3 di pusat kota",
                price: "Rp 350.000 - 800.000",
                openHours: "24 jam",
                distance: "1.2 km"
            },
            {
                id: 6,
                name: "Air Terjun Dolo",
                type: "wisata",
                position: [-7.9123, 112.2845],
                category: "Wisata Alam",
                rating: 4.7,
                reviews: 956,
                description: "Air terjun dengan ketinggian 125 meter",
                price: "Rp 12.000",
                openHours: "07:00 - 17:00",
                distance: "30 km"
            },
            {
                id: 7,
                name: "Museum Airlangga",
                type: "budaya",
                position: [-7.8205, 112.0145],
                category: "Museum Budaya",
                rating: 4.4,
                reviews: 432,
                description: "Museum sejarah dan budaya Kediri",
                price: "Rp 5.000",
                openHours: "08:00 - 16:00",
                distance: "1.5 km"
            },
            {
                id: 8,
                name: "Terminal Kediri",
                type: "transport",
                position: [-7.8167, 112.0234],
                category: "Transportasi",
                rating: 4.0,
                reviews: 234,
                description: "Terminal bus utama Kediri",
                price: "Gratis",
                openHours: "24 jam",
                distance: "2 km"
            },
            {
                id: 9,
                name: "RS Baptis Kediri",
                type: "emergency",
                position: [-7.8234, 112.0156],
                category: "Layanan Darurat",
                rating: 4.3,
                reviews: 567,
                description: "Rumah sakit dengan layanan darurat 24 jam",
                price: "Bervariasi",
                openHours: "24 jam",
                distance: "1.8 km"
            },
            {
                id: 10,
                name: "Monumen Simpang Lima Gumul",
                type: "wisata",
                position: [-7.8567, 112.0456],
                category: "Landmark",
                rating: 4.7,
                reviews: 1892,
                description: "Monumen megah mirip Arc de Triomphe",
                price: "Gratis",
                openHours: "24 jam",
                distance: "8 km"
            }
        ];

        this.createMarkers();
    }

    createMarkers() {
        // Remove existing markers
        this.markers.forEach(item => {
            if (item.marker) {
                this.map.removeLayer(item.marker);
            }
        });
        this.markers = [];

        this.allLocations.forEach(location => {
            const iconUrl = this.getMarkerIcon(location.type);
            const icon = L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            const marker = L.marker(location.position, { icon: icon })
                .addTo(this.map)
                .bindPopup(this.createPopupContent(location));

            marker.on('click', () => {
                this.showLocationDetails(location);
            });

            this.markers.push({
                marker: marker,
                data: location
            });
        });
    }

    getMarkerIcon(type) {
        const colors = {
            'wisata': '2c786c',
            'kuliner': 'ff9800',
            'budaya': '10b981',
            'hotel': '3b82f6',
            'transport': '6b7280',
            'emergency': 'ef4444'
        };
        
        return `https://api.dicebear.com/7.x/shapes/svg?seed=${type}&backgroundColor=${colors[type] || '2c786c'}`;
    }

    createPopupContent(location) {
        return `
            <div class="map-popup">
                <h6>${location.name}</h6>
                <div class="rating">
                    <i class="bi bi-star-fill"></i>
                    <span>${location.rating}</span>
                    <small class="text-muted">(${location.reviews})</small>
                </div>
                <p class="mb-2">${location.description}</p>
                <div class="mb-2">
                    <small><i class="bi bi-tag"></i> ${location.price}</small><br>
                    <small><i class="bi bi-clock"></i> ${location.openHours}</small><br>
                    <small><i class="bi bi-signpost"></i> ${location.distance}</small>
                </div>
                <button class="btn btn-primary btn-sm w-100" onclick="petaPage.showDirections(${location.position[0]}, ${location.position[1]})">
                    <i class="bi bi-signpost"></i> Lihat Rute
                </button>
            </div>
        `;
    }

    showLocationDetails(location) {
        const container = document.getElementById('locationDetails');
        if (!container) return;

        container.innerHTML = `
            <h6 class="mb-2">${location.name}</h6>
            <div class="rating mb-2">
                <i class="bi bi-star-fill text-warning"></i>
                <span>${location.rating}</span>
                <small class="text-muted">(${location.reviews} reviews)</small>
            </div>
            <span class="badge bg-primary mb-2">${location.category}</span>
            <p class="mb-2">${location.description}</p>
            <div class="location-meta">
                <p class="mb-1"><i class="bi bi-tag"></i> ${location.price}</p>
                <p class="mb-1"><i class="bi bi-clock"></i> ${location.openHours}</p>
                <p class="mb-1"><i class="bi bi-signpost"></i> ${location.distance}</p>
            </div>
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-primary btn-sm" onclick="petaPage.showDirections(${location.position[0]}, ${location.position[1]})">
                    <i class="bi bi-signpost"></i> Lihat Rute
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="petaPage.saveLocation(${location.id})">
                    <i class="bi bi-bookmark"></i> Simpan Lokasi
                </button>
            </div>
        `;
    }

    updateLocationInfo(message) {
        const container = document.getElementById('locationDetails');
        if (container) {
            container.innerHTML = `<p class="mb-0 text-muted">${message}</p>`;
        }
    }

    filterByCategory(category) {
        this.markers.forEach(({ marker, data }) => {
            if (category === 'all' || data.type === category) {
                marker.addTo(this.map);
            } else {
                this.map.removeLayer(marker);
            }
        });

        const filtered = this.markers.filter(({ data }) => 
            category === 'all' || data.type === category
        );

        if (filtered.length > 0) {
            const bounds = L.latLngBounds(filtered.map(({ data }) => data.position));
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    filterByDistance(distance) {
        if (distance === 'all' || !this.currentLocation) {
            this.markers.forEach(({ marker }) => marker.addTo(this.map));
            return;
        }

        const maxDistance = parseInt(distance) * 1000;

        this.markers.forEach(({ marker, data }) => {
            const locationDistance = this.calculateDistance(
                this.currentLocation[0],
                this.currentLocation[1],
                data.position[0],
                data.position[1]
            );

            if (locationDistance <= maxDistance) {
                marker.addTo(this.map);
            } else {
                this.map.removeLayer(marker);
            }
        });
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // meters
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
        if (!query) return;

        const found = this.allLocations.find(loc => 
            loc.name.toLowerCase().includes(query) || 
            loc.description.toLowerCase().includes(query)
        );

        if (found) {
            this.map.setView(found.position, 15);
            const foundMarker = this.markers.find(({ data }) => data.id === found.id);
            if (foundMarker) {
                foundMarker.marker.openPopup();
            }
            this.showLocationDetails(found);
            this.showNotification(`Lokasi "${found.name}" ditemukan!`, 'success');
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
                this.showNotification('Gagal mengakses lokasi', 'danger');
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

        const userIcon = L.icon({
            iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=user&backgroundColor=ef4444',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        this.userMarker = L.marker(this.currentLocation, { icon: userIcon })
            .addTo(this.map)
            .bindPopup('<strong>Lokasi Anda</strong>');
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
            container.innerHTML = nearby.map(location => `
                <div class="location-item" onclick="petaPage.centerToLocation(${location.position[0]}, ${location.position[1]})">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${location.name}</h6>
                            <small class="text-muted">${location.category}</small>
                        </div>
                        <span class="badge bg-primary">${location.calculatedDistance} km</span>
                    </div>
                </div>
            `).join('');
        }
    }

    centerToLocation(lat, lng) {
        this.map.setView([lat, lng], 15);
    }

    showDirections(destLat, destLng) {
        if (!this.currentLocation) {
            this.showNotification('Aktifkan lokasi terlebih dahulu', 'warning');
            this.getUserLocation();
            return;
        }

        // Check if Leaflet Routing Machine is available
        if (typeof L.Routing === 'undefined') {
            this.showNotification('Fitur routing tidak tersedia. Silakan muat ulang halaman.', 'danger');
            return;
        }

        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        this.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(this.currentLocation[0], this.currentLocation[1]),
                L.latLng(destLat, destLng)
            ],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving'
            }),
            routeWhileDragging: true,
            showAlternatives: true,
            lineOptions: {
                styles: [{color: '#2c786c', opacity: 0.7, weight: 5}]
            },
            altLineOptions: {
                styles: [
                    {color: 'black', opacity: 0.15, weight: 9},
                    {color: 'white', opacity: 0.8, weight: 6},
                    {color: '#2c786c', opacity: 0.5, weight: 2}
                ]
            },
            createMarker: function(i, waypoint, n) {
                if (i === 0) {
                    return L.marker(waypoint.latLng, {
                        icon: L.icon({
                            iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=user&backgroundColor=ef4444',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    });
                } else {
                    return L.marker(waypoint.latLng, {
                        icon: L.icon({
                            iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=destination&backgroundColor=2c786c',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    });
                }
            }
        }).addTo(this.map);

        this.routingControl.on('routesfound', (e) => {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            const container = document.getElementById('directionsPanel');
            if (container) {
                container.innerHTML = `
                    <div class="route-info">
                        <h6>Informasi Rute</h6>
                        <p><strong>Jarak:</strong> ${(summary.totalDistance / 1000).toFixed(1)} km</p>
                        <p><strong>Perkiraan Waktu:</strong> ${Math.round(summary.totalTime / 60)} menit</p>
                        <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-secondary btn-sm" onclick="petaPage.clearDirections()">
                                <i class="bi bi-x-circle"></i> Tutup Rute
                            </button>
                        </div>
                    </div>
                `;
            }
        });

        this.showNotification('Rute sedang dihitung...', 'info');
    }

    clearDirections() {
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
            this.routingControl = null;
        }
        const container = document.getElementById('directionsPanel');
        if (container) {
            container.innerHTML = '<p class="text-muted mb-0">Pilih destinasi untuk melihat rute</p>';
        }
        this.showNotification('Rute dihapus', 'info');
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
        this.clearDirections();
        this.updateLocationInfo('Klik marker di peta untuk melihat detail lokasi');
    }

    saveLocation(locationId) {
        const favorites = JSON.parse(localStorage.getItem('mapFavorites') || '[]');
        
        if (favorites.includes(locationId)) {
            this.showNotification('Sudah ada di favorit', 'info');
        } else {
            favorites.push(locationId);
            localStorage.setItem('mapFavorites', JSON.stringify(favorites));
            this.showNotification('Lokasi disimpan ke favorit!', 'success');
        }
    }

    showNotification(message, type) {
        const typeClasses = {
            success: 'alert-success',
            danger: 'alert-danger',
            warning: 'alert-warning',
            info: 'alert-info'
        };

        const alert = document.createElement('div');
        alert.className = `alert ${typeClasses[type]} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }
}

// Initialize
let petaPage;
document.addEventListener('DOMContentLoaded', () => {
    petaPage = new PetaPage();
});