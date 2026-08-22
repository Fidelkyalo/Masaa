# MASAA — Intelligent Scheduling & Productivity Platform

![MASAA Platform](public/logo.png)

> **MASAA** ("It's About Time!") is a full-stack, cross-platform productivity platform combining dynamic calendar scheduling, task management, goal tracking, AI automated briefings, voice scheduling, and workflow automation.

---

## 🌐 Live Cloud Deployment Architecture

```
[Users] → Vercel (Frontend SPA) → Render.com (Express REST API Backend)
```

- **Frontend (Vercel)**: `https://masaa-app.vercel.app`
- **Backend API (Render)**: `https://masaa-backend.onrender.com/api/v1`
- **GitHub Repository**: `https://github.com/Fidelkyalo/Masaa`

---

## ⚡ Core Features

- 📅 **Interactive Multiview Calendar**: Month, Week, Day, Agenda, and Year views with custom theme palettes.
- 🔐 **Role-Based Access Control (RBAC)**: Client Portal vs System Admin Console (`masaa.admin@gmail.com`).
- 🔑 **Google SSO & Auth**: Google One-Tap account picker & instant registration.
- 📱 **Device & Google Contact Syncing**: Web Contacts API + Google Contacts auto-sync.
- 🎙️ **Voice Assistant Scheduler**: Web Speech API for natural language hands-free event creation.
- ⚡ **Workflow Automation Engine**: Trigger-action rule builder for custom calendar workflows.
- 🧠 **LLM AI Assistant**: Predictive schedule analyzer, burnout shield & morning briefing generator.
- 🎟️ **QR Ticket Registration**: Automated event registration links with instant QR pass generation.
- 📱 **Mobile Native App (`masaa-mobile/`)**: Cross-platform React Native companion app.

---

## 🛠️ Project Structure

```
Masaa/
├── src/                        # Frontend React 19 + Vite Application
│   ├── components/             # UI Components (Admin, Auth, Calendar, Contacts, AI, Voice)
│   ├── masaa-app.jsx           # Main App Controller
│   └── index.css               # Design System & Theme Engine
├── masaa-backend/              # Express REST API Server
│   ├── routes/                 # Auth, Events, Tasks, Goals, Admin, Integrations, Developer APIs
│   ├── services/               # AI Engine & Third-Party Service Adapters
│   ├── db.js                   # Persistent Database Storage
│   └── server.js               # Express Server Entry Point
├── masaa-mobile/               # React Native Cross-Platform Mobile App
├── vercel.json                 # Vercel Deployment Configuration
├── render.yaml                 # Render.com Blueprint Deployment Configuration
└── MASAA_SETUP_GUIDE.md        # Comprehensive Setup & Deployment Documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Frontend
```bash
cd masaa-app
npm install
npm run dev
```

### 2. Backend REST API
```bash
cd masaa-backend
npm install
npm run dev
```

---

## 🔑 Demo & Admin Credentials

- **System Admin Login**: `masaa.admin@gmail.com` | Password: `Admin123`
- **Google Sign-In**: Click "Continue with Google" on the login screen to sign in with Google SSO.

---

## 📄 Documentation

- [MASAA Setup & Deployment Guide](MASAA_SETUP_GUIDE.md)
- [Backend REST API Specification](MASAA_BACKEND_SPEC.md)
- [Mobile Strategy & Architecture](MASAA_MOBILE_STRATEGY.md)
- [Deliverables Summary](MASAA_DELIVERABLES_SUMMARY.md)

---

Developed with ❤️ for the MASAA Platform.
