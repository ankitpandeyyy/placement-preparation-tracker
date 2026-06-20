# Project Customizations: Placement Preparation Tracker

These rules define the configuration, architecture, and deployment setup for the **Placement Preparation Tracker** project to maintain system memory across development sessions.

## 📁 Workspace Information
* **Local Project Directory:** `c:\Users\pc\.gemini\antigravity\scratch\my2nd project`
* **Local Portfolio Directory:** `c:\Users\pc\.gemini\antigravity\scratch\ankit_portfolio`
* **GitHub Repository:** `https://github.com/ankitpandeyyy/placement-preparation-tracker`

## ⚙️ Ports & Dev Config
* **React Frontend Port:** `5173` (Vite dev server)
* **Express Backend Port:** `5000` (Node server)
* **Local Database Connection:** Falls back to an in-memory database (`mongodb-memory-server`) and automatically seeds mock data if local MongoDB is offline.
* **Local Launcher:** Double-clicking `run-project.bat` in the project root starts the servers and opens the browser.

## 🚀 Deployed URLs
* **Vercel Frontend URL:** `https://frontend-teal-one-47.vercel.app`
* **GitHub Pages Portfolio URL:** `https://ankitpandeyyy.github.io/portfolio/`

## 🔧 Customized Code Features
* **Interview Rounds Enum**: Backend schema (`Company.js`) and frontend forms (`Companies.jsx`) include support for `'Communication Round'`, `'DSA Round'`, and `'Online Assessment'` in addition to the standard interview categories.
