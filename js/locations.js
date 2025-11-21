// Data lokasi lengkap Kediri
class LocationData {
    constructor() {
        this.allLocations = [];
        this.loadAllLocations();
    }

    loadAllLocations() {
        this.allLocations = [
            // WISATA ALAM
            {
                id: 1,
                name: "Gunung Kelud",
                type: "wisata",
                position: [-7.9345, 112.3182],
                category: "Wisata Alam",
                rating: 4.8,
                reviews: 1247,
                description: "Gunung berapi aktif dengan kawah yang menakjubkan dan pemandangan alam yang memukau. Cocok untuk pendakian dan fotografi.",
                price: "Rp 15.000 - 25.000",
                openHours: "06:00 - 18:00",
                distance: "25 km",
                image: "../images/destinations/gunung-kelud.jpg",
                facilities: ["Parkir", "Toilet", "Warung Makan", "Pemandu Wisata"],
                contact: "(0354) 123456"
            },
            {
                id: 2,
                name: "Air Terjun Dolo",
                type: "wisata",
                position: [-7.9123, 112.2845],
                category: "Wisata Alam",
                rating: 4.7,
                reviews: 956,
                description: "Air terjun dengan ketinggian 125 meter dikelilingi hutan yang asri. Suasana sejuk dan alami.",
                price: "Rp 12.000",
                openHours: "07:00 - 17:00",
                distance: "30 km",
                image: "../images/destinations/air-terjun-dolo.jpg",
                facilities: ["Parkir", "Toilet", "Area Piknik", "Warung"],
                contact: "(0851) 8067-3967"
            },
            {
                id: 3,
                name: "Pemandian Tirtoyoso",
                type: "wisata",
                position: [-7.8000, 112.1000],
                category: "Wisata Alam",
                rating: 4.1,
                reviews: 654,
                description: "Kolam renang alami dengan air yang sejuk dan pemandangan yang menenangkan.",
                price: "Rp 15.000 - 20.000",
                openHours: "07:00 - 17:00",
                distance: "15 km",
                image: "../images/destinations/pemandian-tirtoyoso.jpg",
                facilities: ["Kolam Renang", "Parkir", "Toilet", "Warung"],
                contact: "-"
            },

            // WISATA SEJARAH
            {
                id: 4,
                name: "Candi Surowono",
                type: "wisata",
                position: [-7.7896, 112.1567],
                category: "Wisata Sejarah",
                rating: 4.5,
                reviews: 654,
                description: "Candi peninggalan Kerajaan Majapahit dengan arsitektur yang masih terawat.",
                price: "Rp 10.000",
                openHours: "08:00 - 17:00",
                distance: "18 km",
                image: "../images/destinations/candi-surowono.jpg",
                facilities: ["Parkir", "Toilet", "Museum Kecil"],
                contact: "(0354) 691776"
            },
            {
                id: 5,
                name: "Monumen Simpang Lima Gumul",
                type: "wisata",
                position: [-7.8567, 112.0456],
                category: "Wisata Sejarah",
                rating: 4.7,
                reviews: 1892,
                description: "Monumen megah mirip Arc de Triomphe yang menjadi ikon Kediri.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "8 km",
                image: "../images/destinations/monumen-slg.jpg",
                facilities: ["Parkir", "Area Foto", "Food Court"],
                contact: "(0354) 2891400"
            },

            // WISATA KOTA
            {
                id: 6,
                name: "Alun-alun Kediri",
                type: "wisata",
                position: [-7.8215, 112.0169],
                category: "Wisata Kota",
                rating: 4.3,
                reviews: 2156,
                description: "Pusat kota dengan taman yang indah, cocok untuk bersantai dan berolahraga.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "0.5 km",
                image: "../images/destinations/alun-alun-kediri.jpg",
                facilities: ["Taman", "Area Bermain", "Food Court", "Toilet"],
                contact: "-"
            },
            {
                id: 7,
                name: "Taman Sekartaji",
                type: "wisata",
                position: [-7.8190, 112.0180],
                category: "Wisata Kota",
                rating: 4.4,
                reviews: 1234,
                description: "Taman kota yang asri dengan berbagai wahana permainan anak dan area bersantai.",
                price: "Gratis",
                openHours: "06:00 - 22:00",
                distance: "1.2 km",
                image: "../images/destinations/taman-sekartaji.jpg",
                facilities: ["Wahana Bermain", "Taman", "Food Court", "Toilet"],
                contact: "(0823) 3259-3259"
            },

            // KULINER
            {
                id: 8,
                name: "Tahu Takwa Legendaris",
                type: "kuliner",
                position: [-7.8189, 112.0177],
                category: "Makanan Khas",
                rating: 4.9,
                reviews: 892,
                description: "Tahu khas Kediri dengan tekstur kenyal dan rasa gurih yang khas. Dibuat dengan proses khusus.",
                price: "Rp 5.000 - 15.000",
                openHours: "08:00 - 21:00",
                distance: "0.8 km",
                image: "../images/kuliner/tahu-takwa.jpg",
                facilities: ["Tempat Makan", "Take Away", "Parkir"],
                contact: "(0354) 123456"
            },
            {
                id: 9,
                name: "Soto Ayam Lamongan Cak Har",
                type: "kuliner",
                position: [-7.8200, 112.0180],
                category: "Makanan Khas",
                rating: 4.7,
                reviews: 654,
                description: "Soto ayam dengan kuah bening khas Kediri, disajikan dengan sambal dan pelengkap lainnya.",
                price: "Rp 12.000 - 25.000",
                openHours: "06:00 - 22:00",
                distance: "1.1 km",
                image: "../images/kuliner/soto-kediri.jpg",
                facilities: ["Tempat Makan", "Take Away", "Parkir"],
                contact: "(0354) 234567"
            },
            {
                id: 10,
                name: "Warung Gethuk Mbok Darmi",
                type: "kuliner",
                position: [-7.8175, 112.0190],
                category: "Jajanan Tradisional",
                rating: 4.5,
                reviews: 432,
                description: "Jajanan tradisional dari pisang yang dihaluskan dengan rasa manis alami dan tekstur lembut.",
                price: "Rp 3.000 - 8.000",
                openHours: "07:00 - 18:00",
                distance: "1.3 km",
                image: "../images/kuliner/gethuk-pisang.jpg",
                facilities: ["Tempat Makan", "Take Away"],
                contact: "(0354) 345678"
            },
            {
                id: 11,
                name: "Stik Tahu Crispy",
                type: "kuliner",
                position: [-7.8195, 112.0165],
                category: "Jajanan Modern",
                rating: 4.4,
                reviews: 567,
                description: "Olahan tahu yang dibentuk stik dan digoreng crispy, cocok untuk camilan.",
                price: "Rp 8.000 - 15.000",
                openHours: "09:00 - 21:00",
                distance: "0.9 km",
                image: "../images/kuliner/stik-tahu.jpg",
                facilities: ["Take Away", "Delivery"],
                contact: "(0354) 456789"
            },

            // BUDAYA
            {
                id: 12,
                name: "Museum Airlangga",
                type: "budaya",
                position: [-7.8205, 112.0145],
                category: "Museum Budaya",
                rating: 4.4,
                reviews: 432,
                description: "Museum sejarah dan budaya Kediri yang menyimpan berbagai artefak peninggalan kerajaan.",
                price: "Rp 5.000",
                openHours: "08:00 - 16:00",
                distance: "1.5 km",
                image: "../images/destinations/museum-airlangga.jpg",
                facilities: ["Parkir", "Toilet", "Pemandu"],
                contact: "(0813) 5925-1997"
            },
            {
                id: 13,
                name: "Masjid Agung Kediri",
                type: "budaya",
                position: [-7.8220, 112.0150],
                category: "Wisata Religi",
                rating: 4.6,
                reviews: 876,
                description: "Masjid bersejarah dengan arsitektur yang megah dan lingkungan yang nyaman.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "1.8 km",
                image: "../images/destinations/masjid-agung-kediri.jpg",
                facilities: ["Parkir", "Mushola", "Perpustakaan"],
                contact: "(0878) 5045-9515"
            },

            // HOTEL & PENGINAPAN
            {
                id: 14,
                name: "Hotel Sahid Montana",
                type: "hotel",
                position: [-7.8198, 112.0193],
                category: "Penginapan",
                rating: 4.2,
                reviews: 543,
                description: "Hotel bintang 3 di pusat kota dengan fasilitas lengkap dan pelayanan profesional.",
                price: "Rp 350.000 - 800.000",
                openHours: "24 jam",
                distance: "1.2 km",
                image: "../images/hotels/sahid-montana.jpg",
                facilities: ["Restoran", "Kolam Renang", "WiFi", "Parkir"],
                contact: "(0354) 681333"
            },
            {
                id: 15,
                name: "Aston Hotel Kediri",
                type: "hotel",
                position: [-7.8250, 112.0200],
                category: "Penginapan",
                rating: 4.4,
                reviews: 789,
                description: "Hotel bintang 4 dengan kolam renang, spa, dan fasilitas meeting yang lengkap.",
                price: "Rp 500.000 - 1.200.000",
                openHours: "24 jam",
                distance: "2.1 km",
                image: "../images/hotels/aston-kediri.jpg",
                facilities: ["Restoran", "Spa", "Kolam Renang", "Fitness Center"],
                contact: "(0354) 7733999"
            },
            {
                id: 16,
                name: "Ibis Styles Kediri",
                type: "hotel",
                position: [-7.8230, 112.0220],
                category: "Penginapan",
                rating: 4.1,
                reviews: 456,
                description: "Hotel budget dengan desain modern dan fasilitas memadai untuk bisnis maupun liburan.",
                price: "Rp 300.000 - 600.000",
                openHours: "24 jam",
                distance: "2.3 km",
                image: "../images/hotels/ibis-styles.jpg",
                facilities: ["Restoran", "WiFi", "Business Center", "Parkir"],
                contact: "(0354) 3015888"
            },

            // TRANSPORTASI
            {
                id: 17,
                name: "Terminal Kediri",
                type: "transport",
                position: [-7.8167, 112.0234],
                category: "Transportasi",
                rating: 4.0,
                reviews: 234,
                description: "Terminal bus utama Kediri dengan berbagai jurusan dalam dan luar kota.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "2 km",
                image: "../images/transport/terminal-kediri.jpg",
                facilities: ["Tiket", "Waiting Room", "Toilet", "Warung"],
                contact: "(0354) 682123"
            },
            {
                id: 18,
                name: "Stasiun Kediri",
                type: "transport",
                position: [-7.8300, 112.0250],
                category: "Transportasi",
                rating: 4.1,
                reviews: 345,
                description: "Stasiun kereta api dengan layanan komuter dan jarak jauh ke berbagai kota.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "3.2 km",
                image: "../images/transport/stasiun-kediri.jpg",
                facilities: ["Tiket", "Waiting Room", "Toilet", "Kios"],
                contact: "(0354) 681005"
            },
            {
                id: 19,
                name: "Bandara Abdulrachman Saleh",
                type: "transport",
                position: [-7.9260, 112.7140],
                category: "Transportasi",
                rating: 4.3,
                reviews: 567,
                description: "Bandara domestik dengan penerbangan reguler ke Jakarta, Bali, dan kota besar lainnya.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "35 km",
                image: "../images/transport/bandara-abdulrachman.jpg",
                facilities: ["Check-in", "Waiting Lounge", "Cafe", "Parkir"],
                contact: "(0341) 491949"
            },

            // LAYANAN DARURAT
            {
                id: 20,
                name: "RS Baptis Kediri",
                type: "emergency",
                position: [-7.8234, 112.0156],
                category: "Layanan Darurat",
                rating: 4.3,
                reviews: 567,
                description: "Rumah sakit dengan layanan darurat 24 jam, rawat inap, dan spesialis lengkap.",
                price: "Bervariasi",
                openHours: "24 jam",
                distance: "1.8 km",
                image: "../images/emergency/rs-baptis.jpg",
                facilities: ["IGD", "Rawat Inap", "Apotek", "Laboratorium"],
                contact: "(0354) 681333"
            },
            {
                id: 21,
                name: "Polresta Kediri",
                type: "emergency",
                position: [-7.8200, 112.0120],
                category: "Layanan Darurat",
                rating: 4.2,
                reviews: 234,
                description: "Kantor polisi dengan layanan pengaduan 24 jam dan posko keamanan.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "1.5 km",
                image: "../images/emergency/polresta-kediri.jpg",
                facilities: ["Posko", "Layanan Pengaduan", "Parkir"],
                contact: "(0354) 682222"
            },
            {
                id: 22,
                name: "Pemadam Kebakaran",
                type: "emergency",
                position: [-7.8180, 112.0130],
                category: "Layanan Darurat",
                rating: 4.1,
                reviews: 123,
                description: "Pos pemadam kebakaran dengan layanan darurat 24 jam.",
                price: "Gratis",
                openHours: "24 jam",
                distance: "1.3 km",
                image: "../images/emergency/damkar-kediri.jpg",
                facilities: ["Mobil Pemadam", "Perlengkapan Darurat"],
                contact: "113"
            },

            // PUSAT BELANJA
            {
                id: 23,
                name: "Kediri Mall",
                type: "shopping",
                position: [-7.8180, 112.0200],
                category: "Pusat Belanja",
                rating: 4.3,
                reviews: 1234,
                description: "Pusat perbelanjaan modern dengan berbagai tenant ternama, food court, dan bioskop.",
                price: "Bervariasi",
                openHours: "10:00 - 22:00",
                distance: "1.3 km",
                image: "../images/shopping/kediri-mall.jpg",
                facilities: ["Toko Retail", "Food Court", "Bioskop", "Parkir"],
                contact: "(0354) 689999"
            },
            {
                id: 24,
                name: "Pasar Besar Kediri",
                type: "shopping",
                position: [-7.8170, 112.0180],
                category: "Pusat Belanja",
                rating: 4.1,
                reviews: 876,
                description: "Pasar tradisional dengan berbagai kebutuhan sehari-hari, bahan makanan, dan oleh-oleh.",
                price: "Terjangkau",
                openHours: "06:00 - 18:00",
                distance: "1.1 km",
                image: "../images/shopping/pasar-besar.jpg",
                facilities: ["Kios", "Parkir", "Toilet"],
                contact: "(0354) 682555"
            },
            {
                id: 25,
                name: "Kediri Plaza",
                type: "shopping",
                position: [-7.8190, 112.0210],
                category: "Pusat Belanja",
                rating: 4.0,
                reviews: 654,
                description: "Plaza dengan berbagai toko elektronik, pakaian, dan kebutuhan lainnya.",
                price: "Bervariasi",
                openHours: "09:00 - 21:00",
                distance: "1.5 km",
                image: "../images/shopping/kediri-plaza.jpg",
                facilities: ["Toko Retail", "ATM", "Parkir"],
                contact: "(0354) 683333"
            },

            // RESTORAN & CAFE
            {
                id: 26,
                name: "Restoran Sari Rasa",
                type: "kuliner",
                position: [-7.8192, 112.0172],
                category: "Restoran",
                rating: 4.5,
                reviews: 789,
                description: "Restoran dengan menu masakan Indonesia dan Chinese food, suasana nyaman dan bersih.",
                price: "Rp 50.000 - 150.000",
                openHours: "10:00 - 22:00",
                distance: "0.7 km",
                image: "../images/restaurants/sari-rasa.jpg",
                facilities: ["AC", "Parkir", "WiFi", "Take Away"],
                contact: "(0354) 682888"
            },
            {
                id: 27,
                name: "Cafe Bintang",
                type: "kuliner",
                position: [-7.8208, 112.0195],
                category: "Cafe",
                rating: 4.4,
                reviews: 567,
                description: "Cafe cozy dengan berbagai minuman kopi, makanan ringan, dan WiFi gratis.",
                price: "Rp 25.000 - 75.000",
                openHours: "07:00 - 23:00",
                distance: "1.4 km",
                image: "../images/restaurants/cafe-bintang.jpg",
                facilities: ["WiFi", "AC", "Outdoor Seating", "Parkir"],
                contact: "(0354) 683777"
            },
            {
                id: 28,
                name: "Warung Makan Sederhana",
                type: "kuliner",
                position: [-7.8178, 112.0168],
                category: "Restoran",
                rating: 4.2,
                reviews: 432,
                description: "Warung makan dengan masakan rumahan yang lezat dan harga terjangkau.",
                price: "Rp 15.000 - 40.000",
                openHours: "08:00 - 21:00",
                distance: "0.9 km",
                image: "../images/restaurants/warung-sederhana.jpg",
                facilities: ["Tempat Makan", "Take Away"],
                contact: "(0354) 684444"
            }
        ];
    }

    getLocationsByType(type) {
        if (type === 'all') {
            return this.allLocations;
        }
        return this.allLocations.filter(location => location.type === type);
    }

    getLocationById(id) {
        return this.allLocations.find(location => location.id === id);
    }

    searchLocations(query) {
        const lowerQuery = query.toLowerCase();
        return this.allLocations.filter(location => 
            location.name.toLowerCase().includes(lowerQuery) ||
            location.description.toLowerCase().includes(lowerQuery) ||
            location.category.toLowerCase().includes(lowerQuery)
        );
    }

    getPopularDestinations() {
        return this.allLocations
            .filter(loc => loc.rating >= 4.5)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
    }
}

// Initialize global location data
window.locationData = new LocationData();