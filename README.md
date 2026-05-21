# 🌊 SERVIRE - Home Service Platform

> A complete, production-ready React application connecting verified professionals with customers across Pakistan. Built with React Router, Context API, and modern UI/UX practices.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?logo=react-router)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

**[View Live Application](https://your-vercel-url.vercel.app)**

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [Assignment Requirements](#assignment-requirements)
- [What I Learned](#what-i-learned)
- [Author](#author)

---

## 🎯 Project Overview

**Servire** (derived from "Service" + "Fire" - symbolizing passionate service) is a comprehensive home service platform that connects customers with verified professionals including electricians, plumbers, cleaners, AC technicians, carpenters, and many more.

This project was developed as a React assignment demonstrating multi-page application architecture, client-side routing, and dynamic data fetching.

---

## ✨ Features

### Core Features (Assignment Requirements)
| Feature | Status | Description |
|---------|--------|-------------|
| Multi-page React App | ✅ | Complete SPA with 12+ routes |
| React Router Navigation | ✅ | Navbar, Links, Dynamic routes |
| User List Page | ✅ | Workers directory with 105+ professionals |
| User Details Page | ✅ | Full profile with portfolio & reviews |
| Loading States | ✅ | Spinners, Skeleton cards, Shimmer effects |
| Error States | ✅ | Error boundaries, fallback UI, retry buttons |
| API Integration | ✅ | Mock API with loading simulation |
| Deployment | ✅ | Ready for Vercel/Netlify |

### Bonus Features (Exceeded Expectations)
- 🤖 **Hoori AI Chatbot** - Smart assistant for navigation and FAQs
- 🌓 **Dark/Light Theme** - Smooth theme switching with localStorage
- 🚨 **Emergency SOS System** - 24/7 emergency response simulation
- 💖 **Favorites/Wishlist** - Save and manage favorite professionals
- 📊 **Smart City Analytics** - Real-time platform statistics dashboard
- 👑 **Admin Panel** - Employee and worker management
- 🎨 **Portfolio Gallery** - Masonry layout with before/after slider
- 📱 **Fully Responsive** - Mobile-first design
- 🎉 **Confetti & Animations** - Celebratory effects on booking

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **React Router DOM v6** | Navigation & routing |
| **Context API** | State management (theme, auth, favorites) |
| **CSS-in-JS** | Dynamic styling with theme variables |
| **Custom Hooks** | useDebounce, useApp, useTheme |
| **Error Boundaries** | Graceful error handling |

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/servire-app.git
cd servire-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
Dependencies to Install
bash
npm install react-router-dom
main.jsx Setup
jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
🚀 Deployment
Deploy to Vercel (Recommended)
Option 1: Vercel CLI

bash
npm install -g vercel
vercel --prod
Option 2: GitHub + Vercel

Push code to GitHub

Go to vercel.com

Import your repository

Framework preset: Create React App (or Vite)

Build command: npm run build

Output directory: build or dist

Click Deploy

vercel.json (for SPA routing)
json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
Deploy to Netlify
bash
npm run build
# Drag and drop the build folder to Netlify
📚 Assignment Requirements Checklist
Part 1 ✅
Build a React application

Plan the structure of a multi-page React app

Implement basic routing for navigation between pages

Fetch and display user data using API (JSONPlaceholder equivalent)

Create a User List page that displays users

Allow navigation to user details page using React Router

Part 2 & Deploy ✅
Complete details page

Add loading and error states

Deploy to Vercel 

Share live URL

Write README

🧠 What I Learned
Technical Skills
React Router v6: Dynamic routes, nested routes, protected routes, useParams, useNavigate, NavLink

Context API: Global state management for theme, auth, and favorites

Custom Hooks: Created useDebounce for search optimization

Error Handling: Error Boundaries, try-catch patterns, fallback UI

Performance: useCallback, useEffect optimization, debounced search

CSS-in-JS: Dynamic theming with CSS variables

Deployment: Vercel/Netlify configuration for SPA routing

Soft Skills
Planning multi-page application architecture

Breaking down complex UI into reusable components

Managing state across deeply nested components

Creating smooth user experiences with loading skeletons

Building for production with error resilience

👩‍💻 Author
name  ARIKA AHSAN



GitHub: ARIKA AHSAN
arikaahsan107-ui


LinkedIn: ARIKA AHSAN


📄 License
MIT License - feel free to use this project for learning and portfolio purposes.

Made with 🌊 in Pakistan