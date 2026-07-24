# 🏥 Mediqo — Modern Clinic & Hospital Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Mediqo** is a full-stack, enterprise-grade Clinic & Hospital Management Portal designed to streamline healthcare workflows across three core operational roles: **Patients**, **Doctors**, and **Receptionists**. Featuring an AI Health Assistant powered by Google Gemini, automated invoice generation, real-time appointment scheduling, and digital prescription management.

---

## 🌟 Key Features

### 👤 Patient Portal
- **Dashboard & Stats**: Real-time overview of upcoming appointments, active prescriptions, and pending invoices.
- **Book Appointments**: Browse doctors filtered by medical speciality, view available time slots, consultation fees, and doctor credentials.
- **My Appointments**: Filter visits by status (Upcoming, Completed, Cancelled), view details, or cancel upcoming visits.
- **Digital Prescriptions**: View complete medical prescriptions including medications, dosage schedules, diagnosis, and downloadable PDF summaries.
- **Invoices & Billing**: Monitor billing history, itemized charges, discounts, tax, and payment status (Paid vs. Pending).
- **Profile Management**: Update contact information, emergency contacts, medical history, and age/gender profiles.

### 👨‍⚕️ Doctor Portal
- **Practice Analytics**: Daily consultation count, total patients served, and revenue highlights.
- **Schedule Management**: Manage appointment requests, approve or complete visits, view patient medical notes.
- **Digital Prescription Builder**: Create custom prescriptions with multi-drug dosage tables, instructions, and follow-up dates.
- **Availability Controls**: Toggle slot availability and set operational hours per weekday.
- **Patient History**: Access past medical records, diagnosis logs, and prior treatments.

### 👩‍💼 Receptionist Portal
- **Front-Desk Dashboard**: Hospital-wide overview of daily queues, active doctors, and unbilled visits.
- **Patient Registry**: Register walk-in patients, manage patient database, and update profiles.
- **Queue Management**: Book walk-in or phone appointments directly on behalf of any available doctor.
- **Billing & Invoice Generator**: Issue itemized bills with consultation fees, lab tests, medications, discounts, and payment methods (Credit Card, Cash, Apple Pay, Insurance).

### 🤖 AI Health Assistant (Gemini Powered)
- Interactive, multi-turn AI chatbot assisting patients with preliminary symptom checking, medical terminology explanations, and specialist recommendation guidance.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion (Animations), Lucide React Icons |
| **Backend** | Node.js, Express.js (REST API), TypeScript, Morgan, CORS |
| **Database** | MongoDB / Mongoose ODM (with in-memory fallback for immediate zero-config demo) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **AI Integration** | `@google/genai` (Google Gemini 2.5 API) |
| **Build Tools** | Vite, esbuild, tsx |

---

## 📁 Repository Folder Structure

```
mediqo/
├── server/                   # Express REST API Backend
│   ├── config/               # Database connection setup
│   ├── middleware/           # JWT auth & error handling middlewares
│   ├── models/               # Mongoose schemas (User, Appointment, Prescription, Bill)
│   ├── routes/               # API Endpoint routes (auth, patient, doctor, receptionist)
│   ├── services/             # Core business logic & database fallbacks
│   └── seed.ts               # Database seed script for initial demo data
├── src/                      # React Frontend Application
│   ├── assets/               # Medical assets & default doctor profiles
│   ├── components/           # Reusable UI & role-specific components
│   │   ├── doctor/           # Doctor UI components
│   │   ├── patient/          # Patient UI components
│   │   ├── receptionist/     # Receptionist UI components
│   │   └── ui/               # Shared UI elements (Modal, EmptyState, Badge)
│   ├── context/              # React Context (AuthContext)
│   ├── pages/                # Page views (Landing, Auth, Doctor, Patient, Receptionist)
│   └── routes/               # App Router & route guards
├── .env.example              # Environment variables template
├── metadata.json             # AI Studio applet manifest
├── package.json              # Monorepo scripts & dependencies
├── server.ts                 # Express entry point & Vite dev middleware integrator
└── vite.config.ts            # Vite configuration
```

---

## 🔐 Default Demo Credentials

You can test the system immediately using any of these pre-configured demo credentials:

| Role | Name | Email | Password |
|---|---|---|---|
| 👨‍⚕️ **Doctor** | Dr. James Wilson | `dr.james@mediqo.com` | `password123` |
| 👩‍⚕️ **Doctor** | Dr. Sarah Johnson | `dr.sarah@mediqo.com` | `password123` |
| 👩‍💼 **Receptionist** | Sarah Jenkins | `receptionist@mediqo.com` | `password123` |
| 👤 **Patient** | Alex Morgan | `patient@mediqo.com` | `password123` |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**: Package manager

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mediqo.git
cd mediqo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `.env` contains your parameters:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mediqo
JWT_SECRET=mediqo_jwt_secret_key_2026_super_secure
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000/api
GEMINI_API_KEY=your_optional_gemini_api_key
```

### 4. Seed Database (Optional)
To populate MongoDB with initial doctors, patients, and sample appointments:
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔌 API Endpoint Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new patient account.
- `POST /api/auth/login` — Authenticate user and return JWT + role details.
- `GET /api/auth/me` — Retrieve currently authenticated user profile.

### Patient (`/api/patient`)
- `GET /api/patient/doctors` — List all doctors with specialities and fee details.
- `GET /api/patient/appointments` — List current patient's appointments.
- `POST /api/patient/appointments` — Book a new appointment.
- `PATCH /api/patient/appointments/:id/cancel` — Cancel an appointment.
- `GET /api/patient/prescriptions` — List patient's prescriptions.
- `GET /api/patient/bills` — List patient's billing invoices.

### Doctor (`/api/doctor`)
- `GET /api/doctor/appointments` — List appointments assigned to the logged-in doctor.
- `PATCH /api/doctor/appointments/:id/status` — Update appointment status (`Confirmed`, `Completed`, `Cancelled`).
- `POST /api/doctor/prescriptions` — Generate a prescription for a patient visit.
- `GET /api/doctor/prescriptions` — View doctor's issued prescriptions.

### Receptionist (`/api/receptionist`)
- `GET /api/receptionist/dashboard` — Fetch front-desk metrics and queues.
- `GET /api/receptionist/patients` — List registered patient records.
- `POST /api/receptionist/patients` — Register a walk-in patient.
- `POST /api/receptionist/appointments` — Schedule a walk-in appointment.
- `POST /api/receptionist/bills` — Generate an itemized billing invoice.

---

## ☁️ Production Deployment Guide

### Deploying Backend (Render / Cloud Run)
1. Set Environment Variables on host platform:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<strong-random-secret>`
   - `PORT=3000`
2. Build command:
   ```bash
   npm run build
   ```
3. Start command:
   ```bash
   npm start
   ```

### Deploying Frontend (Vercel)
If serving frontend separately:
- Set Build Command: `npm run build`
- Output Directory: `dist`
- Set `VITE_API_URL` to your live API backend URL.

---

## 🛡️ Security Features
- **Password Hashing**: Passwords are securely hashed with `bcryptjs` salt rounds before persistence.
- **Role-Based Authorization (RBAC)**: Dedicated middlewares verify JWT signature and enforce role access (`PATIENT`, `DOCTOR`, `RECEPTIONIST`).
- **Data Sanitization**: Prevents sensitive user credentials or internal server details from being exposed to client responses.

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
