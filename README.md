# 🌍 Traveloop - Your Ultimate Travel Planning Companion

<div align="center">

![Traveloop Logo](https://img.shields.io/badge/Traveloop-v1.0.0-yellow?style=for-the-badge&logo=traveldot)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Backend-Supabase-green?style=for-the-badge&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Project-Odoo%20Hackathon-purple?style=for-the-badge)

**Plan your perfect trip with AI-powered travel planning**

</div>

---

## 📋 Table of Contents

- [About Traveloop](#about-traveloop)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Upcoming Features](#upcoming-features)
- [License](#license)
- [Contributing](#contributing)
- [Copyright](#copyright)
- [Support](#support)

---

## 🌟 About Traveloop

**Traveloop** is a modern, AI-powered travel planning web application built for the **Odoo Hackathon 2026**. It helps travelers plan, organize, and manage their trips with ease.

> *"Your journey begins with a single click. Let Traveloop handle the rest."*

### 🎯 Our Mission

To make travel planning **simple**, **accessible**, and **enjoyable** for everyone - from solo backpackers to family vacationers.

### 👥 Target Users

- Solo travelers
- Families and groups
- Adventure enthusiasts
- Weekend explorers
- Digital nomads

---

## ✨ Features

### Current Features (v1.0)

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure login/signup with Supabase Auth |
| 🏠 **Dashboard** | Beautiful dashboard with trip overview, weather widget, countdown timers |
| ✈️ **Trip Creation** | Create trips with custom dates, cover photos, and descriptions |
| 🗺️ **Interactive Maps** | Select destinations using OpenStreetMap integration |
| 📍 **Destination Recommendations** | AI-powered suggestions for popular Indian destinations |
| 🗓️ **Itinerary Builder** | Add cities/stops with dates and plan your journey |
| 🎯 **Activity Management** | Add activities to each stop with categories and costs |
| 💰 **Budget Tracker** | Track trip expenses and manage budget |
| 🎒 **Packing Checklist** | Create and manage packing lists |
| 📝 **Travel Notes** | Keep travel journal and important notes |
| 🔗 **Trip Sharing** | Share your itinerary with friends and family |

### 🔮 Upcoming Features (v2.0)

We have exciting features planned for the future:

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI Trip Planner** | AI-powered recommendations based on preferences | Coming Soon |
| 🌤️ **Weather Integration** | Real-time weather forecasts for destinations | Coming Soon |
| 💱 **Currency Converter** | Multi-currency support for international trips | Coming Soon |
| 👥 **Collaborative Planning** | Plan trips with friends in real-time | Coming Soon |
| 📱 **PWA Support** | Install as a mobile app | Coming Soon |
| 🏨 **Hotel Booking** | Integration with hotel booking APIs | Coming Soon |
| ✈️ **Flight Tracking** | Flight price alerts and tracking | Coming Soon |
| 🎖️ **Achievements** | Gamification with travel badges | Coming Soon |

---

## 🛠️ Tech Stack

### Frontend

```
React 18          - UI Framework
Vite              - Build Tool
Tailwind CSS      - Styling
Framer Motion     - Animations
React Router      - Navigation
Recharts          - Data Visualization
Lucide React      - Icons
Leaflet           - Maps (OpenStreetMap)
```

### Backend

```
Supabase          - Authentication & Database
PostgreSQL        - Relational Database
Supabase Realtime - Real-time features
```

### Development Tools

```
Git               - Version Control
ESLint            - Code Linting
npm/yarn          - Package Manager
```

---

## 🏗️ Architecture Overview

### Frontend Architecture (React + Vite)

The frontend follows a **component-based architecture** with organized modular structure. The app uses client-side routing with React Router and is optimized for performance with Vite's build system.

**Key Highlights:**
- Single Page Application (SPA) approach
- Client-side routing for seamless navigation
- Responsive design for all devices
- Optimized for performance
- Smooth animations and transitions using Framer Motion

### Backend Architecture (Supabase)

The backend uses **Supabase** as a complete backend solution providing authentication, database, and storage services powered by PostgreSQL.

**Database Schema:**

| Table | Purpose |
|-------|---------|
| `trips` | Store trip information (name, dates, description) |
| `trip_stops` | Destinations/cities in each trip |
| `activities` | Activities at each stop with costs |
| `packing_items` | Packing list items with categories |
| `notes` | Travel notes and journal entries |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Git installed

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/shyamraoshiva778-afk/Travel-loop.git
cd Traveloop
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL scripts in `sql-files/` folder
3. Get your URL and anon key

#### 5. Run the Application
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
Traveloop/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── dashboard/   # Dashboard widgets
│   │   ├── ui/         # UI elements
│   │   └── effects/    # Visual effects
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateTrip.jsx
│   │   ├── TripDetails.jsx
│   │   └── ...
│   ├── lib/            # Utilities
│   │   ├── supabase.js
│   │   ├── helpers.js
│   │   └── places.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── sql-files/          # Database scripts
├── package.json
└── README.md
```

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Traveloop Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting a pull request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Copyright

```
Copyright (c) 2026 Traveloop. All rights reserved.

This project is developed as part of the Odoo Hackathon 2026.

Unauthorized copying, distribution, or use of this software, via any medium,
is strictly prohibited without the prior written consent of the copyright holder.

This software and its documentation are proprietary and confidential.
```

---

## 🙏 Acknowledgments

- **Odoo** - For organizing the amazing hackathon
- **Supabase** - For providing excellent backend infrastructure
- **OpenStreetMap** - For free map data
- **Unsplash** - For beautiful destination images
- **All contributors** - For their hard work and dedication

---

## 📞 Support

If you have any questions or need help, feel free to:

- 📧 Email: traveloop@team.com
- 💬 Open an issue on GitHub

---

<div align="center">

**Made with ❤️ by the Traveloop Team**

*Odoo Hackathon 2026* 🏆

</div>