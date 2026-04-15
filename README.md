# 🏥 Medorc — Frontend

A modern, multi-role medical records management web application built with **React 19** and **Vite**. Medorc enables Patients, Doctors, Hospitals, and External users to securely manage, view, and share medical records through a clean and responsive interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles & Routes](#user-roles--routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)

---

## Overview

Medorc Frontend is the client-side application for the Medorc healthcare platform. It provides role-based dashboards and workflows for:

- **Patients** — Manage personal health records, emergency contacts, and account settings.
- **Doctors** — Access and create patient records, manage professional profiles.
- **Hospitals** — Administer patient records, profiles, and institutional settings.
- **External Users** — View authorized patient records and profiles.

---

## ✨ Features

- 🔐 **JWT-based Authentication** — Secure login/signup with token decoding via `jwt-decode`.
- 🧑‍💼 **Multi-Role Dashboards** — Separate, role-specific pages for Patient, Doctor, Hospital, and External users.
- 📁 **Medical Records Management** — Create, view, and manage detailed patient records.
- 📷 **QR Code Integration** — Generate and scan QR codes for quick patient record access using `qrcode.react` and `@yudiel/react-qr-scanner`.
- ☁️ **Cloudinary Media Uploads** — Profile images and media stored securely on Cloudinary.
- 🚨 **Emergency Contacts** — Patients can manage emergency contacts directly from their dashboard.
- 🤖 **Orby AI Chat** — Integrated AI chat assistant component for in-app support.
- 🔔 **Toast Notifications** — Real-time feedback using `react-toastify`.
- 🎞️ **Smooth Animations** — UI transitions powered by `framer-motion`.
- 🛡️ **XSS Protection** — User-generated content sanitized with `DOMPurify`.
- 📱 **Responsive Design** — Mobile-friendly layout built with Tailwind CSS v4.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Icons | Lucide React, React Icons |
| Media Storage | Cloudinary (`@cloudinary/react`, `@cloudinary/url-gen`) |
| QR Code | `qrcode.react`, `@yudiel/react-qr-scanner` |
| Auth | JWT (`jwt-decode`) |
| Notifications | React Toastify |
| Security | DOMPurify |
| Linting | ESLint 9 |

---

## 📁 Project Structure

```
medorc-frontend/
├── public/                   # Static assets
├── src/
│   ├── App.jsx               # Root component with all route definitions
│   ├── App.css               # Global app styles
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Base CSS / Tailwind directives
│   │
│   ├── Components/           # Shared reusable components
│   │   ├── BackButton.jsx
│   │   ├── EmergencyContacts.jsx
│   │   ├── Loading.jsx
│   │   ├── NavBar.jsx
│   │   ├── NavButton.jsx
│   │   ├── OrbyChat.jsx      # AI chat assistant
│   │   ├── OrbyClick.jsx
│   │   ├── PesonalDetails.jsx
│   │   ├── Profile.jsx
│   │   ├── ProfileChange.jsx
│   │   ├── RecordCard.jsx    # Medical record display card
│   │   └── UserCard.jsx
│   │
│   ├── Context/
│   │   └── AuthContext.jsx   # Global authentication state
│   │
│   ├── Pages/
│   │   ├── Login/            # Sign In & Sign Up flows
│   │   │   └── SignUp/       # Role-specific registration (Patient, Doctor, Hospital, External)
│   │   ├── Patient/          # Patient dashboard pages
│   │   ├── Doctor/           # Doctor dashboard pages
│   │   ├── Hospital/         # Hospital dashboard pages
│   │   ├── Extern/           # External user pages
│   │   └── Common/           # Shared pages (Record View, Patient Profile, etc.)
│   │
│   └── assets/               # Images and static assets
│
├── .env                      # Environment variables (not committed)
├── vite.config.js            # Vite + React + Tailwind configuration
├── eslint.config.js          # ESLint configuration
└── package.json
```

---

## 🧭 User Roles & Routes

### 🔑 Auth
| Route | Page |
|---|---|
| `/` | Sign In |
| `/SignUp` | Sign Up (role selection) |
| `/patient` | Patient Registration |
| `/sDoctor` | Doctor Registration |
| `/sHospital` | Hospital Registration |
| `/sExternal` | External User Registration |

### 👤 Patient
| Route | Page |
|---|---|
| `/patient/home` | Patient Home Dashboard |
| `/patient/profile` | Profile Settings |
| `/patient/security` | Account & Security |
| `/patient/emergency` | Emergency Contacts |
| `/patient/logs` | Activity Logs |
| `/patient/records` | My Records |
| `/patient/addrecord` | Add Medical Record |

### 🩺 Doctor
| Route | Page |
|---|---|
| `/doctor/home` | Doctor Dashboard |
| `/doctor/profile` | Doctor Profile |
| `/doctor/security` | Account & Security |
| `/doctor/records` | Patient Records |
| `/doctor/addrecord` | Add Record |
| `/doctor/patientbasicdetails` | Patient Basic Details |
| `/doctor/patientprofile` | Full Patient Profile |

### 🏨 Hospital
| Route | Page |
|---|---|
| `/hospital/home` | Hospital Dashboard |
| `/hospital/profile` | Hospital Profile |
| `/hospital/security` | Account & Security |
| `/hospital/records` | Patient Records |
| `/hospital/addrecord` | Add Record |
| `/hospital/patientbasicdetails` | Patient Basic Details |
| `/hospital/patientprofile` | Full Patient Profile |

### 🌐 External
| Route | Page |
|---|---|
| `/extern/home` | External User Home |
| `/extern/profile` | Profile |
| `/extern/security` | Account & Security |
| `/extern/records` | Patient Records |
| `/extern/patientbasicdetails` | Patient Basic Details |
| `/extern/patientprofile` | Full Patient Profile |

### 📄 Common
| Route | Page |
|---|---|
| `/recordview/:record_id` | View Individual Medical Record |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Medorc/medorc-frontend.git
cd medorc-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Cloudinary credentials (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in the root of the project with the following keys:

```env
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<your_cloud_name>/upload
VITE_CLOUDINARY_UPLOAD_PRESET=<your_upload_preset>
VITE_CLOUDINARY_CLOUD_NAME=<your_cloud_name>
```

> **Note:** All client-side environment variables must be prefixed with `VITE_` to be accessible in the app.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with ❤️ by the Medorc Team
