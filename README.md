# 🎓 SyllabusAI — AI-Powered Academic Assistant

SyllabusAI is a full-stack, AI-driven mobile application that transforms unstructured syllabus PDFs into structured learning systems and enables intelligent, context-aware Q&A using Retrieval-Augmented Generation (RAG).

Built using a **microservices architecture**, it integrates React Native, Node.js, and Python AI services to deliver a scalable and production-ready academic assistant.

---

## 🚀 Key Features

### 📄 AI-Powered Syllabus Extraction
Upload a syllabus PDF → automatically extract:
- Chapters & topics
- Difficulty levels
- Study weightage

### 🤖 AI Guru (Context-Aware Chat)
- Ask questions based on your syllabus
- Uses **RAG (Retrieval-Augmented Generation)**
- Context-aware, intelligent responses

### 📚 Topic Management
- Structured topic breakdown
- Track progress and completion

### 📅 Smart Study Planning *(Upcoming)*
- Dynamic scheduling based on syllabus complexity
- Deadline-aware planning

### ⚡ Panic Mode *(Upcoming)*
- Last-minute revision planner

---

## 🏗 Architecture (Microservices-Based)

```text
Mobile App (React Native / Expo)
        ↓
Node.js Backend (Express API)
        ↓
Python AI Service (Flask + LangChain)
        ↓
OpenAI API + Vector DB (ChromaDB)
```

---

## 🔹 Service Responsibilities

### 📱 Mobile (Client)
- UI/UX
- API communication
- Authentication handling

### ⚙️ Node.js Backend (Orchestrator)
- JWT Authentication
- Subject & topic management
- File upload handling (Multer)
- Connects mobile ↔ AI backend
- Secure communication (shared secret)

### 🧠 AI Backend (Flask)
- PDF parsing (PyMuPDF)
- Topic extraction
- Embeddings generation
- RAG-based chat responses
- Vector storage (ChromaDB)

---

## 🔥 Key Engineering Highlights

### ✅ Microservices Architecture
- Decoupled Node & Python services
- Independent deployment

### ✅ Cross-Service File Handling (Critical Fix)

**Initial issue:**
- File paths shared between services ❌

**Solution:**
- Implemented **file streaming via multipart/form-data** ✅
- Enabled cross-server compatibility

### ✅ AI Pipeline (RAG)
- OpenAI embeddings
- Stored in ChromaDB
- Context retrieval during chat

### ✅ Secure Communication
- JWT authentication
- Shared secret between Node ↔ Flask

### ✅ Production Deployment
- Node Backend → Render
- Flask AI → Render
- Env-based configs
- Debugged: API key issues, service communication failures, deployment bugs

### ✅ Error Handling & Debugging
- Improved error propagation
- Added structured logs
- Removed silent failures

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| 📱 Frontend | React Native (Expo + Router), Context API, SecureStore & AsyncStorage |
| ⚙️ Backend | Node.js + Express, MongoDB Atlas, JWT Authentication, Multer |
| 🧠 AI Backend | Python (Flask), LangChain, OpenAI API, PyMuPDF, ChromaDB |
| ☁️ Deployment | Render (Node + Flask), Environment variables, REST-based microservices |

---

## 📂 Project Structure

```text
SyllabusAI/
├── mobile-clean/     # React Native App
├── backend/          # Node.js API
└── ai-backend/       # Flask AI Service
```

---

## ⚙️ Setup Instructions

### 1️⃣ Node Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5050
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
FLASK_AI_URL=http://localhost:8000
NODE_BACKEND_SECRET=your_shared_secret
```

Run:

```bash
npm run dev
```

### 2️⃣ AI Backend

```bash
cd ai-backend
pip install -r requirements.txt
```

Create `.env`:

```env
OPENAI_API_KEY=your_openai_key
NODE_BACKEND_SECRET=your_shared_secret
```

Run:

```bash
python app.py
```

### 3️⃣ Mobile App

```bash
cd mobile-clean
npm install
npx expo start
```

Update API base URL in:

```text
src/services/api.ts
```

---

## 📸 Screenshots

*(Add your app screenshots here)*

---

## ⚠️ Known Limitations

- Render free tier → cold start delay (~30–50 sec)
- ChromaDB resets on redeploy (ephemeral storage)

---

## 🚀 Future Improvements

- Persistent vector DB
- Web dashboard
- Offline support
- Multi-subject AI memory
- Analytics

---

## 🧠 Learnings

- Microservice architecture design
- Cross-service file handling
- Production AI pipelines (RAG)
- Debugging real deployment issues
- End-to-end full-stack system building

---

## 🛡 License

MIT License

---

## 👨‍💻 Author

**Ayush Pandey**  
B.Tech CSE | Full-Stack + AI Developer

---

⭐ If you like this project, consider giving it a star!
