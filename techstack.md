# SyllabusAI — Tech Stack

> Complete technology stack for SyllabusAI: AI-Powered Personal Academic OS for College Students

---

## Mobile (Frontend)

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React Native + Expo | Cross-platform iOS/Android mobile app |
| Language | TypeScript | Type-safe frontend code |
| Navigation | Expo Router | File-based routing for all screens |
| Stack Navigation | Expo Router Stack Screen | Auth flow (Splash → Onboarding → Login → Signup) |
| Drawer Navigation | Expo Router Drawer | Main app (Home, Subjects, Schedule, Chat, Profile) |
| Global State | Context API | AuthContext, SubjectContext, AppContext |
| Local Cache | AsyncStorage | Offline schedule cache, user preferences, chatbot settings |
| Secure Storage | Expo SecureStore | JWT token storage |
| HTTP Client | Axios | All API calls to Node.js backend with JWT interceptor |
| Animations | React Native Reanimated | Swipe gestures, Panic Mode overlay, card animations |
| Animations (simple) | Animated API | Modal slide-ups, confidence rating, timer bar |
| File Picker | expo-document-picker | Syllabus PDF and PYQ PDF upload |
| Fonts | expo-font (Inter) | Consistent typography across all screens |
| Splash Screen | expo-splash-screen | Branded SyllabusAI splash |
| Status Bar | expo-status-bar | Dark theme status bar per screen |
| Safe Area | react-native-safe-area-context | SafeAreaView on every screen |
| Performance | React.memo + useCallback + useMemo | FlatList optimization, memoized components |

---

## Main Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js | JavaScript server runtime |
| Framework | Express.js | REST API, routing, middleware |
| Language | JavaScript (ES6+) | Backend logic |
| Database | MongoDB Atlas | Subjects, topics, schedules, users, PYQ data |
| ODM | Mongoose | MongoDB schema modeling and queries |
| Authentication | JWT (jsonwebtoken) | Stateless auth tokens |
| Password Hashing | bcrypt | Secure password storage |
| File Uploads | Multer | PDF file handling before forwarding to Flask |
| AI Bridge | Axios | Internal calls from Node.js to Flask AI service |
| Environment | dotenv | Environment variable management |
| CORS | cors | Cross-origin request handling |
| Deployment | Render (free tier) | Node.js backend hosting |

---

## AI Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Python 3.11+ | AI/ML service runtime |
| Framework | Flask | Lightweight REST API for AI endpoints |
| Language | Python | AI, ML, and data processing |
| RAG Framework | LangChain (Python) | PDF loading, chunking, retrieval, prompt chaining |
| LLM | Claude API (claude-sonnet-4-20250514) | Topic extraction, RAG responses, quiz generation |
| LLM Client | anthropic (Python SDK) | Claude API integration |
| Vector Database | ChromaDB | Per-subject vector store for syllabus and PYQ embeddings |
| Embeddings | LangChain Embeddings | Text chunking and vector embedding pipeline |
| PDF Parsing | PyMuPDF (fitz) | Primary PDF text extraction |
| PDF Parsing (fallback) | pdfplumber | Complex PDF table and layout extraction |
| Streaming | Flask SSE (flask-sse) | Stream chatbot responses to Node.js in real time |
| Environment | python-dotenv | Environment variable management |
| Deployment | Render (separate service) | Flask AI backend hosting |

---

## Flask AI Service — Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| /extract-topics | POST | Receive syllabus PDF, run LangChain extraction, return structured topics JSON |
| /analyze-pyq | POST | Receive PYQ PDFs, extract questions, map to topics, return probability scores |
| /embed | POST | Chunk syllabus/PYQ content and store in ChromaDB |
| /chat | POST | Receive query + subject context, run RAG pipeline, return response |
| /chat/stream | POST | Same as /chat but streams response via SSE |
| /quiz | POST | Receive topic + quiz type + difficulty, generate questions |
| /panic-topics | POST | Filter and rank topics by exam probability for Panic Mode |
| /predicted-paper | POST | Generate predicted question paper from PYQ analysis |

---

## Infrastructure & DevOps

| Layer | Technology | Purpose |
|---|---|---|
| Main Backend Hosting | Render (free tier) | Node.js Express service |
| AI Backend Hosting | Render (free tier, separate service) | Python Flask service |
| Database Hosting | MongoDB Atlas (free tier) | Cloud MongoDB cluster |
| Vector DB | ChromaDB (persistent, on Render) | Embedded vector store with disk persistence |
| Mobile Demo | Expo Go | Live demo on physical device |
| Version Control | Git + GitHub | Source control |
| API Testing | Postman / Thunder Client | Backend endpoint testing |

---

## Communication Architecture

```
React Native App (Expo)
         |
         | Axios (auth, data, schedule)
         ↓
Node.js + Express  ←——→  MongoDB Atlas
         |
         | Axios (AI tasks only)
         ↓
Python + Flask  ←——→  ChromaDB
         |
         | anthropic Python SDK
         ↓
    Claude API
```

**Rule:** Mobile app never calls Flask directly. All requests go through Node.js, which forwards AI tasks to Flask internally.

---

## ChromaDB Namespace Strategy

| Namespace | Content |
|---|---|
| `{userId}_{subjectId}_syllabus` | Chunked syllabus PDF embeddings |
| `{userId}_{subjectId}_pyq` | Chunked PYQ question embeddings |

---

## Context API Structure

| Context | State Managed |
|---|---|
| AuthContext | user object, JWT token, login(), logout(), isAuthenticated |
| SubjectContext | subjects[], activeSubject, topics[], addSubject(), updateTopic() |
| AppContext | panicMode, panicSubjectId, chatbotSettings{persona, language, difficulty, avatarId}, activeSemester |

---

## Key Libraries Summary

### Mobile
```
expo, expo-router, expo-secure-store, expo-document-picker
expo-font, expo-splash-screen, expo-status-bar
react-native-reanimated, react-native-safe-area-context
@react-native-async-storage/async-storage
axios, typescript
```

### Node.js Backend
```
express, mongoose, jsonwebtoken, bcrypt
multer, axios, cors, dotenv
```

### Python Flask Backend
```
flask, flask-sse, anthropic, langchain
langchain-anthropic, langchain-community
chromadb, pymupdf, pdfplumber
python-dotenv, flask-cors
```

---

## Why This Stack

| Decision | Reason |
|---|---|
| React Native + Expo | Cross-platform, fast iteration, large ecosystem |
| Two backends (Node + Flask) | Node.js for data/auth, Python for AI — each language used where it excels |
| Python for AI backend | LangChain + ChromaDB are far more mature in Python than JS |
| MongoDB over SQL | Flexible schema for complex nested data (topics, schedules, PYQ mappings) |
| ChromaDB over Pinecone | Free, open-source, runs on Render without external API costs |
| Claude over GPT-4 | Superior reasoning for structured extraction and RAG |
| Expo SecureStore over AsyncStorage for JWT | Security — sensitive tokens must never go in AsyncStorage |
| Context API over Redux | Sufficient for this app's state complexity, no boilerplate overhead |

---

*SyllabusAI — v2.0 | Ayush Pandey | E23CSEU2129 | Bennett University | April 2026*
