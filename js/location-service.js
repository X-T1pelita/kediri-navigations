// Location Service for GPS and Navigation
class LocationService {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
        this.isTracking = false;
        this.destination = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLocationSupport();
    }

    setupEventListeners() {
        document.addEventListener('destinationSelected', (event) => {
            this.setDestination(event.detail);
        });

        document.addEventListener('startNavigation', (event) => {
            this.startNavigation(event.detail);
        });
    }

    checkLocationSupport() {
        if (!navigator.geolocation) {
            this.showError('Browser Anda tidak mendukung geolocation');
            return false;
        }
        return true;
    }

    async requestPermission() {
        return new Promise((resolve, reject) => {
            if (!this.checkLocationSupport()) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                    this.handlePositionUpdate(position);
                    resolve(position);
                },
                error => {
                    this.handleLocationError(error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }

    startTracking() {
        if (!this.checkLocationSupport() || this.isTracking) return;

        this.isTracking = true;
        
        this.watchId = navigator.geolocation.watchPosition(
            position => {
                this.handlePositionUpdate(position);
                this.updateNavigation(position);
                this.checkProximityAlerts(position);
            },
            error => {
                this.handleLocationError(error);
                this.stopTracking();
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );

        this.dispatchEvent('trackingStarted', { tracking: true });
    }

    stopTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        this.isTracking = false;
        this.dispatchEvent('trackingStopped', { tracking: false });
    }

    handlePositionUpdate(position) {
        this.currentPosition = position;
        
        this.updatePositionDisplay(position);
        
        this.dispatchEvent('positionUpdated', { position: position });
        
        if (this.destination) {
            this.updateRouteToDestination(position);
        }
    }

    updatePositionDisplay(position) {
        const coords = position.coords;
        
        const locationElement = document.getElementById('currentLocation');
        if (locationElement) {
            locationElement.innerHTML = `
                <i class="bi bi-geo-alt-fill text-primary"></i>
                Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}
                <small class="text-muted">(Akurasi: ±${Math.round(coords.accuracy)}m)</small>
            `;
        }

        this.updateNearbyAttractions(coords);
    }

    setDestination(destination) {
        this.destination = destination;
        this.dispatchEvent('destinationSet', { destination: destination });
    }

    clearDestination() {
        this.destination = null;
        this.dispatchEvent('destinationCleared');
    }

    startNavigation(destination) {
        this.setDestination(destination);
        this.startTracking();
        this.dispatchEvent('navigationStarted', { 
            destination: destination,
            startTime: new Date()
        });
    }

    stopNavigation() {
        this.stopTracking();
        this.clearDestination();
        this.dispatchEvent('navigationStopped');
    }

    updateNavigation(position) {
        if (!this.destination) return;

        const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        const distance = this.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            this.destination.lat,
            this.destination.lng
        );

        const eta = this.calculateETA(position, distance);

        this.dispatchEvent('navigationUpdated', {
            distance: distance,
            eta: eta,
            currentLocation: currentLocation
        });
    }

    calculateETA(position, distance) {
        const averageSpeed = position.coords.speed || 30;
        const remainingTimeHours = distance / 1000 / averageSpeed;
        const eta = new Date(Date.now() + remainingTimeHours * 3600000);
        
        return {
            time: eta,
            remainingMinutes: Math.round(remainingTimeHours * 60),
            remainingDistance: Math.round(distance / 1000 * 10) / 10
        };
    }

    checkProximityAlerts(position) {
        if (!this.destination) return;

        const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        const distanceToDestination = this.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            this.destination.lat,
            this.destination.lng
        );

        if (distanceToDestination < 500) {
            this.dispatchEvent('approachingDestination', {
                distance: distanceToDestination,
                destination: this.destination
            });
        }

        this.checkNearbyPOIs(currentLocation);
    }

    async checkNearbyPOIs(currentLocation) {
        const nearbyPOIs = await this.findNearbyPOIs(currentLocation);
        
        nearbyPOIs.forEach(poi => {
            this.dispatchEvent('nearbyPOI', {
                poi: poi,
                distance: poi.distance
            });
        });
    }

    async findNearbyPOIs(location) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: "SPBU Terdekat",
                        type: "service",
                        distance: 500
                    },
                    {
                        id: 2,
                        name: "Rest Area",
                        type: "service",
                        distance: 1200
                    }
                ]);
            }, 1000);
        });
    }

    async updateNearbyAttractions(coords) {
        try {
            const nearby = await this.findNearbyAttractions(coords);
            
            const attractionsElement = document.getElementById('nearbyAttractions');
            if (attractionsElement && nearby.length > 0) {
                const closest = nearby[0];
                attractionsElement.textContent = 
                    `Destinasi terdekat: ${closest.name} (${closest.distance} km)`;
            }

            this.dispatchEvent('nearbyAttractionsUpdated', { attractions: nearby });
        } catch (error) {
            console.error('Error finding nearby attractions:', error);
        }
    }

    async findNearbyAttractions(coords) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: "Alun-alun Kediri",
                        distance: 0.5,
                        type: "wisata"
                    },
                    {
                        id: 2,
                        name: "Tahu Takwa Legendaris",
                        distance: 0.8,
                        type: "kuliner"
                    }
                ]);
            }, 500);
        });
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
        
        this.showError(message);
        this.dispatchEvent('locationError', { error: message });
    }

    showError(message) {
        console.error('Location Service Error:', message);
        
        const errorElement = document.getElementById('locationError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail: detail });
        document.dispatchEvent(event);
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c * 1000; // Return in meters
    }

    formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        } else {
            return `${(meters / 1000).toFixed(1)} km`;
        }
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours} j ${minutes} m`;
        } else {
            return `${minutes} menit`;
        }
    }
}

// Initialize Location Service
document.addEventListener('DOMContentLoaded', () => {
    window.locationService = new LocationService();
});