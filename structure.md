# 📁 Struktur Proyek Kedir Navigasi

**Dokumentasi lengkap tentang struktur folder, file, dan organisasi proyek.**

## Hierarki Direktori Lengkap

\`\`\`
kedir-navigasi/
│
├── 📁 public/                      # Static Assets & Public Files
│   ├── 🖼️ apple-icon.png          # Apple device icon (180x180)
│   ├── 🖼️ icon-dark-32x32.png    # Dark mode favicon (32x32)
│   ├── 🖼️ icon-light-32x32.png   # Light mode favicon (32x32)
│   ├── 🖼️ icon.svg               # SVG icon (scalable)
│   ├── 🖼️ placeholder-logo.png   # Placeholder logo (PNG)
│   ├── 🖼️ placeholder-logo.svg   # Placeholder logo (SVG)
│   ├── 🖼️ placeholder-user.jpg   # Placeholder user avatar
│   ├── 🖼️ placeholder.jpg        # Generic placeholder image
│   └── 🖼️ placeholder.svg        # Generic placeholder SVG
│
├── 📁 pages/                       # HTML Pages & Routes
│   ├── 📄 index.html              # Homepage
│   ├── 📄 wisata.html             # Tourism destinations page
│   │   Content: Destination listing, filtering, detailed info
│   │   Styling: css/wisata.css
│   │   Scripts: js/script.js, js/locations.js
│   │
│   ├── 📄 kuliner.html            # Culinary/food guide page
│   │   Content: Food categories, restaurants, recipes
│   │   Styling: css/kuliner.css
│   │   Scripts: js/script.js
│   │
│   ├── 📄 peta.html               # Interactive map page
│   │   Content: Google Maps integration, location markers
│   │   Styling: css/peta.css
│   │   Scripts: js/peta.js, js/map.js, js/location-service.js
│   │
│   ├── 📄 budaya.html             # Culture & history page
│   │   Content: Historical info, cultural events, traditions
│   │   Styling: css/budaya.css
│   │   Scripts: js/script.js
│   │
│   ├── 📄 tentang.html            # About page
│   │   Content: About Kota Kediri, team info, mission/vision
│   │   Styling: css/tentang.css
│   │   Scripts: js/script.js
│   │
│   ├── 📄 kontak.html             # Contact page
│   │   Content: Contact form, emergency numbers, FAQs
│   │   Styling: css/kontak.css
│   │   Scripts: js/script.js
│   │
│   ├── 📄 service.html            # Service worker offline page
│   │   Content: Offline fallback content
│   │   Purpose: Displayed when offline
│   │
│   └── 📁 restaurant/              # Individual restaurant pages
│       ├── 📄 soto-ayam-lamongan-cak-har.html
│       │   Content: Soto Ayam restaurant details
│       │   Styling: css/soto-ayam.css
│       │   Scripts: js/soto-ayam.js
│       │
│       ├── 📄 tahu-takwa.html
│       │   Content: Tahu Takwa restaurant details
│       │   Styling: css/tahu-takwa.css
│       │   Scripts: js/tahu-takwa.js
│       │
│       └── 📄 warung-gethuk-mbok-darmi.html
│           Content: Warung Gethuk restaurant details
│           Styling: css/warung-gethuk.css
│           Scripts: js/warung-gethuk.js
│
├── 📁 css/                        # Stylesheets (CSS)
│   ├── 🎨 style.css              # Main global stylesheet
│   │   Purpose: Base styles, reset, common utilities
│   │   Size: ~50KB
│   │   Includes: Reset, typography, grid system
│   │
│   ├── 🎨 index.css              # Homepage specific styles
│   │   Purpose: Homepage layout and components
│   │   Features: Hero section, featured destinations, CTA
│   │
│   ├── 🎨 wisata.css             # Destinations page styles
│   │   Purpose: Destination listing and detail page
│   │   Features: Cards, filters, search bar
│   │   Components: Destination cards, grid, modal
│   │
│   ├── 🎨 kuliner.css            # Culinary page styles
│   │   Purpose: Food guide page styling
│   │   Features: Food cards, category tabs, ratings
│   │   Components: Food item cards, review section
│   │
│   ├── 🎨 peta.css              # Map page styles
│   │   Purpose: Interactive map styling
│   │   Features: Map controls, marker styling, infobox
│   │   Components: Map container, search, filters
│   │
│   ├── 🎨 budaya.css            # Culture page styles
│   │   Purpose: History and culture content styling
│   │   Features: Timeline, gallery, event cards
│   │
│   ├── 🎨 tentang.css           # About page styles
│   │   Purpose: About page styling
│   │   Features: Team section, stats, testimonials
│   │
│   ├── 🎨 kontak.css            # Contact page styles
│   │   Purpose: Contact form and info styling
│   │   Features: Form styling, contact cards, map
│   │
│   ├── 🎨 animations.css        # Animation library
│   │   Purpose: Reusable animations and transitions
│   │   Animations: Fade, slide, bounce, pulse, etc.
│   │   Usage: Apply animation classes to elements
│   │
│   ├── 🎨 responsive.css        # Mobile responsiveness
│   │   Purpose: Media queries and responsive design
│   │   Breakpoints:
│   │   - Mobile: < 576px
│   │   - Tablet: 576px - 768px
│   │   - Desktop: 768px - 1200px
│   │   - Large: > 1200px
│   │
│   ├── 🎨 404.css              # 404 error page styles
│   │   Purpose: Error page styling
│   │   Features: Error message, navigation suggestions
│   │
│   ├── 🎨 soto-ayam.css        # Individual item page
│   ├── 🎨 tahu-takwa.css       # Individual item page
│   ├── 🎨 warung-gethuk.css    # Individual item page
│   │   Purpose: Individual restaurant/item details
│   │   Features: Hero image, description, map, reviews
│   │
│   └── 🎨 globals.css          # Tailwind & global styles
│       Purpose: Tailwind CSS configuration, theme
│       Includes: CSS variables, theme colors
│
├── 📁 js/                         # JavaScript Files
│   ├── 🔧 script.js              # Main JavaScript file
│   │   Size: ~100KB
│   │   Purpose: Core functionality for all pages
│   │   Features:
│   │   - Navigation menu toggle
│   │   - Mobile menu handling
│   │   - Common utility functions
│   │   - Event listeners
│   │   - Form validation
│   │   - Smooth scrolling
│   │
│   ├── 🔧 map.js                # Google Maps integration
│   │   Size: ~50KB
│   │   Purpose: Map functionality and utilities
│   │   Features:
│   │   - Initialize Google Maps
│   │   - Add markers
│   │   - Infowindows
│   │   - Route calculation
│   │   - Clustering
│   │
│   ├── 🔧 peta.js               # Map page specific script
│   │   Size: ~40KB
│   │   Purpose: Map page functionality
│   │   Features:
│   │   - Load destinations on map
│   │   - Filter by category
│   │   - Search functionality
│   │   - Get directions
│   │   - Street View
│   │
│   ├── 🔧 location-service.js   # Geolocation service
│   │   Size: ~15KB
│   │   Purpose: Handle user location
│   │   Features:
│   │   - Get current GPS location
│   │   - Calculate distance
│   │   - Address lookup
│   │   - Geofencing
│   │
│   ├── 🔧 locations.js          # Location data
│   │   Size: ~30KB
│   │   Purpose: Destination coordinates and data
│   │   Format: JavaScript object with destination info
│   │   Usage: Loaded by map and location services
│   │
│   ├── 🔧 soto-ayam.js          # Individual page script
│   ├── 🔧 tahu-takwa.js         # Individual page script
│   ├── 🔧 warung-gethuk.js      # Individual page script
│   │   Purpose: Specific functionality for item pages
│   │   Features: Gallery, reviews, booking, share
│   │
│   └── 📦 bootstrap.bundle.min.js # Bootstrap framework
│       Size: ~130KB
│       Purpose: Bootstrap UI components and utilities
│       Version: Latest minified
│
├── 📁 config/                    # Configuration Files
│   └── ⚙️ config-website.json    # Main configuration
│       Size: ~200KB
│       Format: JSON
│       Purpose: Centralized configuration
│       Contains:
│       {
│         "website": {             # Website metadata
│           "name": "Kediri Tourism",
│           "description": "...",
│           "theme": { colors }
│         },
│         "contact": {             # Contact information
│           "office": { address, phone, email },
│           "social": { links },
│           "hours": { business hours },
│           "emergency": [ numbers ],
│           "faq": [ questions/answers ]
│         },
│         "team": [ members ],     # Team members info
│         "destinations": [        # Tourism destinations (10+)
│           { id, name, category, image, rating, details }
│         ],
│         "categories": [ ],       # Destination categories
│         "culinary": {            # Food & restaurant info
│           "highlights": [ ],
│           "categories": [ ],
│           "items": [ ] (100+ items)
│         }
│       }
│
├── 📁 server/                    # Backend API & Server
│   └── 📁 api/                   # API endpoints
│       └── 🔌 gemini.js          # Gemini AI integration
│           Size: ~10KB
│           Purpose: AI content generation
│           Features:
│           - Generate descriptions
│           - Summarize content
│           - Translate content
│           - Content enhancement
│
├── 📁 components/                # React Components
│   ├── 🎯 theme-provider.tsx    # Theme provider wrapper
│   │   Purpose: Manage app theme (light/dark)
│   │   Features: Theme context, provider setup
│   │
│   └── 📁 ui/                    # shadcn/ui Components (~60 components)
│       ├── 🔘 button.tsx
│       ├── 📇 card.tsx
│       ├── 📋 accordion.tsx
│       ├── 🚨 alert.tsx
│       ├── 👤 avatar.tsx
│       ├── 🏷️ badge.tsx
│       ├── 🗺️ breadcrumb.tsx
│       ├── ⚙️ button-group.tsx
│       ├── 📅 calendar.tsx
│       ├── 🎠 carousel.tsx
│       ├── 📊 chart.tsx
│       ├── ☑️ checkbox.tsx
│       ├── 📂 collapsible.tsx
│       ├── 🔍 command.tsx
│       ├── 📋 context-menu.tsx
│       ├── 💬 dialog.tsx
│       ├── 📱 drawer.tsx
│       ├── 📉 dropdown-menu.tsx
│       ├── 🔲 empty.tsx
│       ├── 🏷️ field.tsx
│       ├── 📝 form.tsx
│       ├── 🎯 hover-card.tsx
│       ├── 📦 input-group.tsx
│       ├── 🔐 input-otp.tsx
│       ├── ⌨️ input.tsx
│       ├── 📍 item.tsx
│       ├── ⌨️ kbd.tsx
│       ├── 🏷️ label.tsx
│       ├── 📊 menubar.tsx
│       ├── 🧭 navigation-menu.tsx
│       ├── ◀▶ pagination.tsx
│       ├── 💭 popover.tsx
│       ├── 📊 progress.tsx
│       ├── 🔘 radio-group.tsx
│       ├── 📐 resizable.tsx
│       ├── 📜 scroll-area.tsx
│       ├── 🎯 select.tsx
│       ├── ➖ separator.tsx
│       ├── 📂 sheet.tsx
│       ├── 📂 sidebar.tsx
│       ├── ⬜ skeleton.tsx
│       ├── 🎚️ slider.tsx
│       ├── ⚙️ sonner.tsx
│       ├── 🔄 spinner.tsx
│       ├── 🔛 switch.tsx
│       ├── 📋 table.tsx
│       ├── 📑 tabs.tsx
│       ├── 📝 textarea.tsx
│       ├── 🔔 toast.tsx
│       ├── 🔔 toaster.tsx
│       ├── 🔘 toggle-group.tsx
│       ├── 🔘 toggle.tsx
│       ├── ❓ tooltip.tsx
│       ├── 📱 use-mobile.tsx
│       └── 🔔 use-toast.ts
│
├── 📁 app/                       # Next.js App Directory
│   ├── 📄 layout.tsx             # Root layout component
│   │   Size: ~2KB
│   │   Purpose: App shell and layout wrapper
│   │   Includes:
│   │   - HTML document structure
│   │   - Font imports (Geist, Geist Mono)
│   │   - Metadata configuration
│   │   - Analytics integration
│   │   - Theme provider wrapper
│   │
│   └── 🎨 globals.css           # Global Tailwind styles
│       Size: ~5KB
│       Purpose: Tailwind CSS configuration and theme
│       Features:
│       - Color variables (light/dark mode)
│       - Typography settings
│       - Responsive design setup
│       - CSS custom properties
│
├── 📁 hooks/                     # React Custom Hooks
│   ├── 🎣 use-mobile.ts         # Mobile detection hook
│   │   Purpose: Detect if user on mobile device
│   │   Returns: boolean (true = mobile)
│   │
│   ├── 🎣 use-mobile.tsx        # Mobile detection component
│   │   Alternative TypeScript version
│   │
│   └── 🎣 use-toast.ts          # Toast notification hook
│       Purpose: Show toast notifications
│       Usage: useToast().toast({ title, description })
│
├── 📁 lib/                       # Utility Library
│   └── 🔧 utils.ts              # Helper functions
│       Size: ~2KB
│       Functions:
│       - cn() - Tailwind class merging utility
│       - formatDate() - Date formatting
│       - calculateDistance() - Distance calculation
│       - Other helpers
│
├── 📁 etc/                       # Server Configuration
│   └── 📁 nginx/                # Nginx web server config
│       ├── ⚙️ nginx.conf        # Main nginx config
│       │   Purpose: Web server setup
│       │   Features:
│       │   - Server block configuration
│       │   - Proxy settings
│       │   - Caching rules
│       │   - Compression settings
│       │
│       └── 🔒 security.conf     # Security headers
│           Purpose: Security best practices
│           Headers:
│           - X-Frame-Options (clickjacking protection)
│           - X-Content-Type-Options (MIME sniffing)
│           - Content-Security-Policy (XSS prevention)
│           - Strict-Transport-Security (HTTPS)
│
├── 📁 logs/                      # Application Logs
│   └── 📋 error.log             # Error log file
│       Purpose: Error tracking and debugging
│       Format: Structured error entries with timestamps
│
├── 📁 styles/                    # Additional Styles
│   └── 🎨 globals.css           # Additional global styles
│
├── 🔌 sw.js                     # Service Worker
│   Size: ~15KB
│   Purpose: PWA functionality
│   Features:
│   - Offline caching
│   - Background sync
│   - Push notifications
│   - Asset versioning
│   - Cache strategy (Cache-first, Network-first)
│
├── 🤖 robots.txt                # SEO Robots configuration
│   Purpose: Control search engine crawling
│   Content: Allow/disallow paths for bot access
│
├── 🗺️ sitemap.xml               # XML Sitemap
│   Purpose: SEO and search engine indexing
│   Format: XML with page URLs and metadata
│   Content: All website pages with last-mod date
│
├── ❌ 404.html                  # 404 error page
│   Size: ~5KB
│   Purpose: Custom 404 page
│   Features:
│   - Error message
│   - Navigation suggestions
│   - Search functionality
│   - Quick links to main sections
│
├── 📴 offline.html              # Offline fallback page
│   Size: ~3KB
│   Purpose: Shown when offline and content not cached
│   Content: Offline notice with tips
│
├── 🏠 index.html                # Homepage
│   Size: ~20KB
│   Purpose: Main landing page
│   Sections:
│   - Hero section with CTA
│   - Featured destinations
│   - Culinary highlights
│   - Quick links to main sections
│   - Footer
│
├── 📦 package.json              # NPM dependencies
│   Size: ~5KB
│   Purpose: Project metadata and dependencies
│   Includes:
│   {
│     "name": "kedir-navigasi",
│     "version": "2.0.0",
│     "scripts": {
│       "start": "vercel dev",
│       "build": "vercel build",
│       "deploy": "vercel deploy --prod"
│     },
│     "dependencies": [ ... ]
│   }
│
├── 🔒 pnpm-lock.yaml            # PNPM lockfile
│   Purpose: Lock npm dependency versions
│   Format: YAML
│   Purpose: Ensure reproducible installs
│
├── ⚙️ tsconfig.json             # TypeScript configuration
│   Size: ~1KB
│   Purpose: TypeScript compiler options
│   Includes:
│   - Compiler settings
│   - Path aliases
│   - Module resolution
│   - Strict mode settings
│
├── 📦 next.config.mjs           # Next.js configuration
│   Size: ~2KB
│   Purpose: Next.js framework setup
│   Features:
│   - Image optimization
│   - API routes config
│   - Build settings
│   - React compiler setup
│
├── 🎨 postcss.config.mjs        # PostCSS configuration
│   Purpose: CSS processing setup
│   Plugins: Tailwind, Autoprefixer
│
├── ⚙️ vercel.json               # Vercel deployment config
│   Size: ~1KB
│   Purpose: Vercel platform configuration
│   Includes:
│   - Build command
│   - Install command
│   - Output directory
│   - Environment variables
│
├── 📋 components.json           # shadcn/ui config
│   Size: ~1KB
│   Purpose: Configure shadcn/ui components
│   Includes: Component paths, aliases, imports
│
├── 📚 structure.md              # This file (Project structure documentation)
│
├── 📚 README.md                 # Main project documentation (1000+ lines)
│
├── 📚 TECH-STACK.md             # Technology stack documentation
│
├── 🔐 .env.local                # Local environment variables
│   Purpose: Development secrets and config
│   Variables:
│   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
│   - GEMINI_API_KEY
│   - Database credentials
│
└── 🔐 .gitignore               # Git ignore patterns
    Purpose: Exclude files from version control
    Excludes:
    - node_modules/
    - .env.local
    - build/
    - dist/
    - .next/
\`\`\`

---

## 📊 File Statistics

### By Type

| Type | Count | Size |
|------|-------|------|
| HTML Pages | 10 | ~100KB |
| CSS Stylesheets | 13 | ~200KB |
| JavaScript | 10 | ~500KB |
| React Components | 70+ | ~300KB |
| Config Files | 8 | ~50KB |
| Image Assets | 10+ | ~2MB |
| **Total** | **~150** | **~3MB** |

### Directory Size

| Directory | Size | Purpose |
|-----------|------|---------|
| pages/ | ~100KB | HTML pages |
| css/ | ~200KB | Styling |
| js/ | ~500KB | Functionality |
| components/ | ~300KB | React components |
| public/ | ~2MB | Static assets |
| config/ | ~200KB | Configuration |
| **Total** | **~3MB** | - |

---

## 🔄 Data Flow

### Page Load Flow

\`\`\`
1. User visits website
   ↓
2. index.html loaded (or specific page)
   ↓
3. CSS files load (style.css + page-specific CSS)
   ↓
4. JavaScript files load (script.js + page-specific JS)
   ↓
5. config-website.json loaded dynamically
   ↓
6. External APIs called (Google Maps, Gemini)
   ↓
7. Service Worker registers (offline support)
   ↓
8. DOM rendered and interactive
\`\`\`

### Configuration Flow

\`\`\`
config-website.json
    ↓
JavaScript reads config
    ↓
Data processing & transformation
    ↓
DOM population
    ↓
CSS applied
    ↓
Display to user
\`\`\`

---

## 🏗️ Component Hierarchy

### Layout Structure

\`\`\`
HTML Root
├── Head
│   ├── Meta tags
│   ├── Title
│   └── Links (CSS, fonts)
│
└── Body
    ├── Header
    │   ├── Logo/Brand
    │   ├── Navigation
    │   └── Search
    │
    ├── Main Content
    │   ├── Page-specific content
    │   ├── Sections
    │   └── Cards/Components
    │
    ├── Sidebar (optional)
    │   └── Filters/Info
    │
    └── Footer
        ├── Links
        ├── Contact info
        └── Social media
\`\`\`

---

## 📈 Performance Metrics

### File Size Optimization

- **Minified CSS:** ~50KB (gzipped)
- **Minified JS:** ~150KB (gzipped)
- **Images:** Optimized WebP format
- **Total Size:** < 2MB (with assets)

### Page Load Time

- **First Contentful Paint (FCP):** < 2s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1

---

## 🔒 Security Structure

### Protected Data

- No sensitive data in frontend code
- API keys in environment variables
- Sensitive operations on backend only
- User data encrypted in transit

### Validation Layers

1. Frontend validation (UX)
2. Backend validation (Security)
3. Database constraints (Data integrity)
4. API rate limiting (DDoS protection)

---

## 🚀 Deployment Structure

### Production Build

\`\`\`
Build Process:
npm run build
    ↓
Compile Next.js/React
    ↓
Optimize assets
    ↓
Generate static files
    ↓
Output to .vercel/output
    ↓
Deploy to Vercel CDN
\`\`\`

### File Organization Post-Deploy

- Static assets → CDN (cached globally)
- API routes → Serverless functions
- HTML → Vercel edge network
- Service Worker → Browser cache

---

## 📝 Important Files Reference

### Must Read First

1. **README.md** - Project overview and docs
2. **STRUCTURE.md** - This file (directory structure)
3. **TECH-STACK.md** - Technologies and versions
4. **package.json** - Dependencies and scripts

### Configuration Files

1. **config-website.json** - Main configuration (200KB)
2. **.env.local** - Environment variables
3. **next.config.mjs** - Next.js settings
4. **vercel.json** - Deployment config

### Entry Points

1. **index.html** - Homepage entry
2. **app/layout.tsx** - Next.js root layout
3. **js/script.js** - Main JavaScript
4. **css/style.css** - Main styles

---

## 🔧 Maintenance Checklist

### Regular Maintenance

- [ ] Update npm dependencies monthly
- [ ] Review and fix console errors
- [ ] Monitor Google Analytics
- [ ] Check Lighthouse scores
- [ ] Test on mobile devices
- [ ] Verify SEO elements
- [ ] Check broken links
- [ ] Update content/images

### Monthly Tasks

- [ ] Update destination information
- [ ] Add new culinary items
- [ ] Check Google Maps integration
- [ ] Review user feedback
- [ ] Update team info if needed
- [ ] Check security vulnerabilities

### Quarterly Tasks

- [ ] Full website audit
- [ ] Performance optimization review
- [ ] Update dependencies
- [ ] Review and update content
- [ ] Check all integrations
- [ ] Update sitemap

---

*Last Updated: November 2025*  
*Version: 2.0.0*
\`\`\`

---
