# VIBE2FIX ⚡

> **Industrial-grade, single-vendor hardware & precision tech e-commerce platform.**  
> Crafted with a bespoke tactical dark UI, physical tactile 3D elevation, interactive fluid physics, and a fully functional zero-backend mock engine.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)

---

## ⚡ Overview

**Vibe2Fix** is an e-commerce platform designed specifically for hardware engineers, makers, audiophiles, and repair technicians. Built from the ground up to depart from generic "AI stock" aesthetics, it features a high-contrast matte dark interface with physical drop shadows, spring-physics wave simulations, and instant demo accessibility.

The application includes an autonomous **Zero-Backend Mock Mode** (`VITE_USE_MOCK_DATA=true`), allowing full end-to-end testing of customer storefronts, cart checkouts, order lifecycles, and admin operations directly in the browser via `localStorage` state persistence.

---

## ✨ Key Highlights & Design System

- **Tactical Dark Aesthetic**: Pure solid dark surfaces (`#0F0F10`, `#161619`, `#18181A`) with zero neon glow, zero blue saturation, and zero transparent glassmorphism edges.
- **Physical 3D Tactile Elevation**: Physical drop shadows (`0 3px 0 0 #000000`) for all primary action buttons, filter tabs, and control keycaps (`.btn-3d`, `.tab-3d`).
- **Interactive Fluid Waves**: Canvas 2D spring physics simulation powered by React Bits `Waves` on the landing hero for high-stakes visual impact.
- **Minimalist Floating Pill Navbar**: Floating curved header with keycap search indicator (`⌘K` / `Ctrl+K`), quick clear action, and smooth progressive scroll blur.
- **Tactile Bento Guarantees**: Elevated service cards highlighting Doorstep COD, Free Delivery on ₹500+, 7-Day Easy Returns, and Dedicated Hardware Lab Support.

---

## 🔬 Hardware Divisions

The platform catalogs 32 hardware specimens categorized into 6 specialized engineering divisions:

| Division | Code | Description & Specimens |
|---|---|---|
| **Audio & Sound** | `audio-sound` | Planar magnetic headphones, USB audio interfaces, balanced IEMs, studio monitors |
| **Smart Home** | `smart-home` | Zigbee 3.0 gateways, air quality monitors, smart plugs with energy telemetry |
| **Work & Study Tech** | `work-study` | 4K 60fps webcams, mechanical keyboards, ergonomic vertical mice, GaN desk chargers |
| **IoT & Embedded Dev** | `iot-development` | ESP32-S3 boards, Raspberry Pi Pico W kits, LoRa transceivers, logic analyzers |
| **Power & Battery** | `power-battery` | 24,000mAh GaN power banks, 18650 smart battery chargers, USB-C power meters |
| **Fix & Hardware Tools** | `fix-hardware-tools` | 64-in-1 precision screwdriver sets, smart soldering irons, silicone heat pads, digital calipers |

---

## 🚀 Storefront Features

- **Global Quick-Find (`⌘K` / `Ctrl+K`)**: Instant modal search with real-time querying across categories, specs, and titles.
- **Hardware Catalog & Filters**: Multi-criteria filtering by division, price range, stock status, ratings, and sorting (price, popularity, newest).
- **Specimen Detail Studio**:
  - Multi-angle high-resolution photo gallery
  - Technical specification telemetry grid
  - Stock level indicators with real-time quantity validation
  - Verified purchaser reviews with rating breakdown and interactive review submission modal
- **Cart & Dynamic Pricing**:
  - Live subtotal and tax calculation
  - Free delivery qualification progress bar (Free above ₹500, flat ₹50 otherwise)
  - Promotional coupon engine (e.g., `FIX10` for 10% off, `WELCOME50` for ₹50 off)
- **Streamlined Checkout**:
  - Delivery address form with validation
  - Multiple payment methods: **Cash on Delivery (COD)** and **Online Payment (Mock Gateway)**
  - Instant order dispatch with unique hardware tracking IDs
- **Order Tracking & Lifecycle**:
  - Status progression timeline: `Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`
  - Cancellation capability for pending orders
  - Direct refund request initiation for delivered hardware
- **Customer Account Portal**:
  - Order history with downloadable order receipts
  - Wishlist management with 1-click cart transfer
  - Refund tracker with admin resolution status

---

## 🛠️ Admin Management Suite (`/admin`)

An industrial operations dashboard built for single-vendor store management:

- **Collapsible Sidebar**: Generously spaced `w-72` sidebar with a single three-line toggle button.
- **Real-Time KPI Telemetry**: Total revenue, order throughput, customer registry size, and active refund requests.
- **Catalog & Inventory Control**: Search, category filters, in-line stock counter adjustments, and creation/editing of product specimens.
- **Order Dispatch Workflow**: Inspect order details, update shipping status through full fulfillment stages, and review payment proofs.
- **Refund Resolution Queue**: Review customer refund reasons, inspect attached failure reports, and approve or reject claims.
- **Customer Moderation**: Overview of registered accounts, order frequency, and account status toggles.
- **Promotions & Coupons**: Create, activate, and revoke discount codes with expiration dates and percentage/flat discounts.
- **Demo Reset Button**: One-click "Reset Demo Store Data" button in the admin sidebar to instantly refresh the sample catalog.

---

## 🔑 Demo Access Credentials

In Mock Mode (`VITE_USE_MOCK_DATA=true`), the sign-in screen provides **1-Click Demo Fill Buttons**:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Demo Customer** | `customer@vibe2fix.com` | `demo12345` | Storefront, Cart, Checkout, Order History, Refunds |
| **Store Admin** | `admin@vibe2fix.com` | `demo12345` | Full Admin Operations Suite (`/admin`) |

---

## 📦 Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom tactile 3D utilities
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **State Architecture**: React Context API (`AuthContext`, `CartContext`) + browser `localStorage`
- **Simulation**: HTML5 Canvas 2D Spring Physics Engine

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/lakshyakhanna17/Vibe2Fix-FE.git
cd Vibe2Fix-FE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_USE_MOCK_DATA=true
VITE_API_URL=http://localhost:5000
```
> **Note**: When `VITE_USE_MOCK_DATA=true`, no backend server is required. All operations run entirely in the browser with local persistence.

### 4. Start the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📂 Project Structure

```text
Vibe2Fix-FE/
├── public/                 # Static SVG icons and favicon
├── src/
│   ├── api/                # API client abstraction (switches between Axios and Mock)
│   ├── assets/             # Branding assets and product illustrations
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Floating pill header with ⌘K search
│   │   ├── Footer.jsx      # Tactile bento guarantee cards & navigation
│   │   ├── Waves.jsx       # Canvas 2D spring physics simulation
│   │   ├── ParticleHero.jsx# Hero showcase with telemetry LED & Waves
│   │   ├── ProductCard.jsx # Elevated product bento card
│   │   └── ...
│   ├── context/            # React Context providers (Auth, Cart)
│   ├── mock/               # Zero-backend mock engine
│   │   ├── mockData.js     # 32 curated hardware specimens & initial state
│   │   ├── mockStore.js    # LocalStorage CRUD operations & migration
│   │   └── mockApi.js      # Mock API adapter with network delay simulation
│   ├── pages/              # Storefront views (Catalog, Detail, Cart, Checkout, etc.)
│   ├── pages/admin/        # Admin management views (Dashboard, Products, Orders, etc.)
│   ├── routes/             # Protected and Admin route guards
│   ├── App.jsx             # Route definitions and global layouts
│   ├── index.css           # Tailwind custom utilities & tactile 3D classes
│   └── main.jsx            # Application entrypoint
├── index.html              # HTML shell
├── tailwind.config.js      # Tailwind configuration with hardware color palette
├── vite.config.js          # Vite build configuration
└── package.json            # Scripts & dependencies
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
