# DhiMārga: Production-Grade AI Learning Navigator

> An intelligent, adaptive Learning Management System (LMS) that dynamically generates personalized learning paths based on a user's career goals, current XP, and semantic intent.

![Frontend](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3_%7C_Java_21-6DB33F?logo=spring)
![AI Tier](https://img.shields.io/badge/AI_Tier-FastAPI_%7C_Python-009688?logo=fastapi)
![Database](https://img.shields.io/badge/Database-PostgreSQL_%7C_Supabase-336791?logo=postgresql)

---

## Overview

**DhiMārga** (Sanskrit for "Path of Knowledge") is not a static course platform. It is a highly dynamic capability graph engine. Instead of forcing learners down a rigid curriculum, DhiMārga acts as a GPS for education:

1. It analyzes the learner's **Career Goal** and **Current XP**.
2. It evaluates their **Semantic Intent** (using HuggingFace NLP models).
3. It performs a **Deterministic Topological Sort** on available prerequisite nodes.
4. It calls **Google Gemini 1.5 Pro** to map out an optimal, personalized learning sequence.

## Key Features

- **Tier 3 AI Orchestration:** Dedicated Python/FastAPI microservice handling DistilBERT intent classification, semantic caching, and Gemini API structured output.
- **Capability Graph Validations:** Strict Directed Acyclic Graph (DAG) prerequisite checking guarantees learners never skip foundational concepts.
- **Gamification Ledger:** Event-sourced XP tracking, dynamic daily streaks, and real-time leaderboards.
- **Multi-Role RBAC:** Secure JWT-based authentication supporting `STUDENT`, `MENTOR`, and `ADMIN` roles.
- **Enterprise Security:** Full Supabase Row Level Security (RLS) enforcement and CORS protection.
- **Cloud Integrations:** Dynamic image and media storage powered by Cloudinary.

---

## Architecture

DhiMārga employs a microservice-oriented architecture designed for scalability:

1. **Client & Edge Layer (Tier 0 & 1):**
   - React 18 SPA built with Vite and styled with TailwindCSS.
   - Interactive UI/UX featuring guided React-Joyride dashboard tours.
2. **Java Core Domain (Tier 2):**
   - Spring Boot 3.x REST API handling transactional bounded contexts (Path Engine, Gamification XP, Auth).
3. **AI Orchestration Tier (Tier 3):**
   - Python/FastAPI service isolating intensive ML workloads (DistilBERT, Sentence-Transformers, Gemini generation).
4. **Data Vault (Tier 4):**
   - Supabase PostgreSQL handling relational models, strict foreign-key relationships, and RLS policies.

---

## Tech Stack

### Frontend

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** React Hooks, LocalStorage Cache
- **UI Components:** Lucide Icons, React-Joyride

### Backend (Core)

- **Framework:** Spring Boot 3 (Java 21)
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security (Stateless JWT)
- **Database:** PostgreSQL (Supabase)
- **Storage:** Cloudinary API

### Backend (AI Pipeline)

- **Framework:** FastAPI (Python)
- **Models:** HuggingFace `distilbert-base-uncased-mnli`, `all-MiniLM-L6-v2`
- **LLM:** Google Gemini 1.5 Pro (GenerativeAI SDK)

---

## Local Setup & Execution

### Prerequisites

- Java 21+
- Node.js (v18+)
- Python 3.10+ (For ML Pipeline)
- Maven

### 1. Backend (Spring Boot)

```bash
cd lms
# Configure application.properties or set environment variables:
# DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET, CLOUDINARY_*
./mvnw clean install
./mvnw spring-boot:run
```

_Backend runs on `http://localhost:8080`_

### 2. ML Pipeline (FastAPI)

```bash
cd MLPipeline
pip install -r requirements.txt
# Export GEMINI_API_KEY=your_key
python main.py
```

_ML Pipeline runs on `http://localhost:8000`_

### 3. Frontend (React)

```bash
cd lms-frontend
# Create .env file: VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev
```

_Frontend runs on `http://localhost:5173`_

---

## Deployment (Production)

DhiMārga is optimized for a decoupled cloud deployment:

- **Frontend:** Deployed globally on [Vercel](https://vercel.com).
- **Backend:** Containerized using a multi-stage `Dockerfile` and deployed on [Render](https://render.com).
- **Database:** Hosted serverlessly on [Supabase](https://supabase.com).

To deploy the backend, simply connect the repository to Render. The included `render.yaml` blueprint and multi-stage `Dockerfile` will automatically handle the build and deployment process.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You are free to:

- Use, share, and adapt the code for **personal or educational purposes**.
- Build upon it for non-commercial projects.

You are **not allowed to**:

- Use this project or its derivatives for **commercial purposes** (any activity intended for economic benefit, including selling, monetizing, or integrating into paid products/services).

For full details, see the [CC BY-NC 4.0 License](https://creativecommons.org/licenses/by-nc/4.0/).

---

_Built with ❤️ by Dhi_Pathikas for the future of education._
