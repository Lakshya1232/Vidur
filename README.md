# Vidur

**AI-Powered Citizen Service & Grievance Platform**

Vidur is a digital citizen-service platform designed to help citizens discover government services, submit applications and grievances, track their status, and interact with an AI-powered guidance layer.

## 🚀 Key Features

- 🔐 Secure citizen registration and login
- 📧 Email OTP verification
- 🔑 JWT-based authentication
- 🏛️ Government service discovery
- 📝 Online service application workflow
- 📊 Application status tracking
- 📢 Grievance registration and tracking
- 🤖 AI-assisted grievance classification
- 👨‍💼 Admin/officer dashboard
- ✅ Grievance resolution workflow
- 🌐 Indian state and district selection
- 🌍 Multi-language interface support

## 🏗️ Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Argon2 Password Hashing

### Email & Authentication
- Resend Email API
- Email OTP verification
- JWT access tokens

## 🧩 System Architecture

```text
Citizen
   │
   ▼
React Frontend
   │
   ▼
FastAPI Backend
   │
   ├── Authentication
   ├── Government Services
   ├── Applications
   ├── Grievances
   └── Admin Operations
   │
   ▼
PostgreSQL Database
