# 🚀 Smart Job Matching & Precision Search

A prototype job–candidate matching platform that combines **semantic AI-powered search** with **strict structured filtering** for **high-precision matching**.
Built with **Node.js + Express + MongoDB** (backend) and **React + Vite** (frontend).

---

## ✨ Features

* 📄 Upload resumes (PDF/DOCX) → auto-extract **name, email, phone, skills, education**
* 👨‍💻 Store & search **candidates**
* 🏢 Store & search **job postings**
* 🔍 **Semantic search** (TF-IDF + cosine similarity) across free-text queries
* ✅ **Strict filtering** for precision (skills, location, experience, education, salary)
* 🎯 **IIT Precision Rule**: only full-time B.Tech/B.E/B.Sc undergraduates from IIT are returned if requested
* 🗣️ **Natural language query support**

  * *“python developers in Pune with 3+ years”*
  * *“only undergraduates from IIT skilled in python”*
  * *“remote frontend roles paying more than 20 LPA”*
* 🎨 React frontend with:

  * Candidate/Job search tabs
  * Structured filters
  * Resume upload + form auto-fill
  * “Why matched” badges + semantic score

---

## 🏗️ Architecture

```
backend/                  # Express + MongoDB
├─ models/                # Candidate.js, Job.js
├─ routes/                # candidateRoutes.js, jobRoutes.js
├─ utils/                 # resumeParser.js, semantic.js, queryParser.js
└─ server.js              # Entry point

frontend/                 # React + Vite
├─ src/
│  ├─ api/                # API calls
│  ├─ components/         # SearchBar, Filters, ResultCard, ResumeUpload, etc.
│  ├─ pages/              # Search.jsx, CreateCandidate.jsx
│  ├─ styles/             # globals.css
│  ├─ App.jsx, router.jsx, main.jsx
└─ vite.config.js
```

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
```
Health check:

```bash
GET http://localhost:5000/health
# → { "ok": true }
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Environment variables (`frontend/.env`):

```env
VITE_API=http://localhost:5000
```

Frontend runs at:
👉 [http://localhost:5173/](http://localhost:5173/)

---

## 🔍 Core APIs

### Candidates

* `POST /api/candidates` → create candidate
* `POST /api/candidates/upload` → upload resume, auto-extract fields
* `POST /api/candidates/search` → hybrid semantic + filter search
* `GET  /api/candidates` → list all

### Jobs

* `POST /api/jobs` → create job
* `POST /api/jobs/search` → hybrid semantic + filter search
* `GET  /api/jobs` → list all

---

## 🧠 Matching Logic

### Semantic Layer

* Uses **TF-IDF + cosine similarity** (`utils/semantic.js`)
* Adds `_semScore` to each result

### Filtering Layer

* Hard filters applied **before ranking**
* Examples:

  * `skills` → must include all
  * `experience_years >= X`
  * `salary_min >= LPA`
  * `location` match
  * `remote` flag
  * IIT precision (B.Tech/B.E/B.Sc + full-time + institution = IIT\*)
---

## 📄 Resume Parsing

* Upload **PDF/DOCX**
* Extracts:

  * Email, phone
  * Skills
  * Education
  * Raw resume text
* Implemented with `pdf-parse` & `mammoth`

---

## 🚀 Demo Script (for video)

1. **Start backend & frontend**

   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```
2. **Upload a resume** → fields auto-fill in Create Candidate page
3. **Save candidate** (with IIT UG education)
4. **Candidate search**

   * Query: *“only undergraduates from IIT skilled in python”* → ✅ IIT candidate appears
   * Query: *“python developers in Bangalore with 1+ years”* → ❌ 0-year candidates excluded
5. **Job search**

   * Seed job: *Frontend Engineer (React), Remote, 22–35 LPA*
   * Query: *“remote frontend roles paying more than 20 LPA”* → ✅ Job appears with badges
6. Show “why matched” badges + semantic score

---

## 📹 Demo Video

👉 Upload to YouTube/Drive and paste the link here:

```
[Demo Video Link](https://your-link-here.com)
```

---

## 📌 Deployment

* **Backend** → Render / Railway / Heroku + MongoDB Atlas
* **Frontend** → Netlify / Vercel
* Update `VITE_API` in frontend `.env` with deployed backend URL

---

## ✅ Assignment Coverage

* ✔️ Backend APIs (jobs + candidates + resume parsing)
* ✔️ Semantic + strict filter hybrid search
* ✔️ Precision logic (IIT rule, exp/salary filters)
* ✔️ Frontend search interface (tabs + filters + upload)
* ✔️ Natural language query parsing
* ✔️ Demo video requirement
* ✔️ README requirement
