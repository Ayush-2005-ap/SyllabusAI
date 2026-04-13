# SyllabusAI — Phase-Wise Development Plan
> **Version:** 1.0 | **Author:** Ayush Pandey | **Stack:** React Native + Expo · Node.js + Express · Python + Flask · MongoDB · Claude API · LangChain (Python) · ChromaDB

---

## Quick Reference

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React Native + Expo (Expo Go for demo) |
| Navigation | Expo Router — Stack (auth) + Drawer (main app) |
| Global State | Context API (AuthContext · SubjectContext · AppContext) |
| Local Storage | AsyncStorage (schedule cache, preferences) |
| Secure Storage | Expo SecureStore (JWT token) |
| Networking | Axios (with JWT interceptor) |
| Animations | React Native Reanimated + Animated API |
| Backend | Node.js + Express |
| AI Backend | Python + Flask |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| AI / LLM | Claude API — `claude-sonnet-4-20250514` |
| RAG | LangChain (Python) via Flask |
| Vector DB | ChromaDB |
| PDF Parsing | PyMuPDF + pdfplumber |
| File Uploads | Multer |
| Deployment | Render (backend + separate Flask service) |

### Design System Tokens
| Token | Value |
|---|---|
| Background | `#0A0F1E` |
| Primary Accent | `#4A90D9` |
| Text Primary | `#F0F4FF` |
| Text Secondary | `#8899AA` |
| Success | `#2ECC71` |
| Warning | `#F5A623` |
| Panic Accent | `#E74C3C` |
| Card Background | `rgba(255,255,255,0.05)` |
| Card Border | `1px rgba(255,255,255,0.1)` |
| Border Radius (cards) | `16px` |
| Border Radius (buttons) | `12px` |
| Border Radius (inputs) | `8px` |
| Font | Inter (expo-font) |
| Base Spacing Unit | `8px` |

### Golden Rules — Never Violate
- Never call Claude API from the mobile app directly — all AI via Express backend
- Never store JWT in AsyncStorage — always Expo SecureStore
- Never leave a list without FlatList + React.memo on list items
- Never leave a handler passed as prop unwrapped in useCallback
- All PDF processing is async — always show loading states
- ChromaDB namespaces: `{userId}_{subjectId}_syllabus` and `{userId}_{subjectId}_pyq`
- Panic Mode overrides chatbot personality globally via AppContext
- Every screen wrapped in SafeAreaView + StatusBar configured
- Mobile app never calls Flask directly — all requests go Node.js → Flask
- All AI processing lives in Flask only — Node.js is data + auth only

---

## Project Structure (Full)

```
syllabusai/
├── mobile/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── splash.tsx
│   │   │   ├── onboarding.tsx
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── (drawer)/
│   │   │   ├── home.tsx
│   │   │   ├── subjects/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── add.tsx
│   │   │   │   └── [id].tsx
│   │   │   ├── schedule.tsx
│   │   │   ├── chat.tsx
│   │   │   └── profile.tsx
│   │   └── _layout.tsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        (GradientButton, InputField, LoadingOverlay, Badge)
│   │   │   ├── subjects/      (SubjectCard, TopicItem, PDFUploader)
│   │   │   ├── schedule/      (ScheduleBlock, WeekStrip, ConfidenceModal)
│   │   │   ├── chat/          (ChatBubble, ChatInput, SettingsDrawer, QuizCard)
│   │   │   └── panic/         (PanicOverlay, PanicQueue, CountdownTimer)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── SubjectContext.tsx
│   │   │   └── AppContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSubjects.ts
│   │   │   └── usePanicMode.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── formatters.ts
│   │   └── types/
│   │       ├── auth.types.ts
│   │       ├── subject.types.ts
│   │       └── schedule.types.ts
│   └── assets/
│       └── fonts/
├── backend/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── subject.routes.js
│   │   ├── topic.routes.js
│   │   ├── schedule.routes.js
│   │   ├── chat.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── subject.controller.js
│   │   ├── topic.controller.js
│   │   ├── schedule.controller.js
│   │   └── chat.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Topic.js
│   │   ├── Schedule.js
│   │   └── ChatSession.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── services/
│   │   └── flaskBridge.js   (Axios calls to Flask endpoints)
│   ├── uploads/
│   └── server.js
├── ai-backend/              (Python + Flask)
│   ├── routes/
│   │   ├── extract.py
│   │   ├── pyq.py
│   │   ├── chat.py
│   │   ├── quiz.py
│   │   └── panic.py
│   ├── services/
│   │   ├── extractor.py
│   │   ├── pyq_analyzer.py
│   │   ├── rag_chat.py
│   │   ├── quiz_generator.py
│   │   └── scheduler.py
│   ├── vector_store.py      (ChromaDB operations)
│   ├── requirements.txt
│   ├── .env
│   └── app.py
└── DEVELOPMENT_PLAN.md
```

---

## Phase Overview

| Phase | Features | Complexity | Deliverable |
|---|---|---|---|
| **Phase 1** | Auth + Project Scaffold | Low | Functional login/signup with JWT, navigation skeleton |
| **Phase 2** | Subjects + PDF AI Extraction | Medium | Add subjects, upload syllabus, AI topic list |
| **Phase 3** | PYQ Analysis + Smart Scheduler | High | Exam probability scores, adaptive study schedule |
| **Phase 4** | RAG Chatbot + Quiz Mode | High | Streaming AI chat, 5-type quiz engine |
| **Phase 5** | Panic Mode + Dashboard + Admin | Medium | Full panic flow, heatmap dashboard, admin panel |

---

## Phase 1 — Foundation & Auth
> **Goal:** Running app skeleton with complete auth flow, navigation wired, contexts initialized.

### Features Covered
- Feature 1: Auth (Splash, Onboarding, Signup, Login)

### Backend Tasks

#### Setup
- [ ] `npm init` in `/backend`, install: `express mongoose bcryptjs jsonwebtoken dotenv cors multer`
- [ ] `server.js` — Express app, CORS, JSON middleware, route mounting, MongoDB connect
- [ ] `.env` — `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLAUDE_API_KEY`

#### Files to Create
| File | Responsibility |
|---|---|
| `models/User.js` | Mongoose schema: name, email, password (hashed), createdAt |
| `controllers/auth.controller.js` | `register()`, `login()`, `getMe()` |
| `routes/auth.routes.js` | `POST /register`, `POST /login`, `GET /me` |
| `middleware/auth.middleware.js` | `verifyToken()` — decodes JWT, attaches `req.user` |

#### API Endpoints
```
POST   /api/auth/register   { name, email, password }  -> { token, user }
POST   /api/auth/login      { email, password }         -> { token, user }
GET    /api/auth/me         (Bearer token)              -> { user }
```

### Mobile Tasks

#### Setup
- [ ] `npx create-expo-app@latest mobile --template blank-typescript`
- [ ] Install: `expo-router expo-font expo-splash-screen expo-secure-store @react-native-async-storage/async-storage axios react-native-reanimated`
- [ ] Configure `app.json` — scheme, fonts, splash screen

#### Files to Create
| File | Responsibility |
|---|---|
| `src/utils/colors.ts` | All design tokens as constants |
| `src/utils/spacing.ts` | 8px grid system constants |
| `src/types/auth.types.ts` | TypeScript interfaces: `User`, `AuthState`, `LoginPayload` |
| `src/services/api.ts` | Axios instance, base URL, JWT interceptor |
| `src/context/AuthContext.tsx` | `user`, `token`, `login()`, `logout()`, `register()`, auto-login on mount |
| `src/context/SubjectContext.tsx` | Stub — `subjects[]`, `addSubject()`, `fetchSubjects()` |
| `src/context/AppContext.tsx` | `panicMode`, `chatbotSettings`, `activeSemester` |
| `app/_layout.tsx` | Root layout — wrap all contexts, font loading, Expo Router config |
| `app/(auth)/splash.tsx` | Branded splash + Expo SplashScreen, animated logo entrance |
| `app/(auth)/onboarding.tsx` | 3-slide carousel (FlatList), progress dots, Skip + Get Started |
| `app/(auth)/login.tsx` | Email + password form, validation, Axios call, SecureStore save |
| `app/(auth)/signup.tsx` | Name + email + password + confirm, full validation, register API |
| `app/(drawer)/_layout.tsx` | Drawer navigator — Home, Subjects, Schedule, Chat, Profile |
| `app/(drawer)/home.tsx` | Skeleton home screen (greeting, placeholder cards) |

#### Key Implementation Notes
- `AuthContext` checks SecureStore on mount -> auto-login if valid token
- `api.ts` Axios interceptor reads from SecureStore async before every request
- Splash screen holds until fonts loaded + auth check complete
- Onboarding shown only on first launch (AsyncStorage flag)
- All forms use controlled `useState` + inline error `Text` components
- SafeAreaView + StatusBar (dark) on every screen

### Acceptance Criteria — Phase 1
- [ ] App launches with branded splash, transitions to onboarding (first time only)
- [ ] Signup creates user in MongoDB, returns JWT stored in SecureStore
- [ ] Login with correct credentials navigates to Drawer home
- [ ] Login with wrong credentials shows inline error message
- [ ] App relaunch with saved token skips auth and goes straight to home
- [ ] Logout clears SecureStore and returns to login screen
- [ ] All 3 contexts initialized and accessible throughout app

---

## Phase 2 — Subject Manager + AI Topic Extraction
> **Goal:** Students can add subjects, upload syllabus PDFs, and receive AI-extracted topic lists.

### Features Covered
- Feature 2: Subject Manager
- Feature 3: Syllabus PDF Upload + AI Topic Extraction

### Backend Tasks

#### New Dependencies
**Node.js:** no new AI deps — add `axios` call to Flask via `flaskBridge.js`

#### Files to Create
| File | Responsibility |
|---|---|
| `models/Subject.js` | name, code, professor, creditHours, examDate, overview, content, userId |
| `models/Topic.js` | name, description, difficulty, estimatedHours, pyqProbability, subjectId, userId |
| `controllers/subject.controller.js` | CRUD for subjects |
| `controllers/topic.controller.js` | `extractTopics()`, `updateTopic()`, `deleteTopic()` |
| `routes/subject.routes.js` | Subject REST endpoints |
| `routes/topic.routes.js` | Topic REST + `POST /extract` |
| `middleware/upload.middleware.js` | Multer config — PDF only, `/uploads/` destination |
| `services/flaskBridge.js` | Axios calls to Flask — `POST /extract-topics`, `/embed`, `/chat`, `/quiz` etc. |

#### API Endpoints
```
GET    /api/subjects                         -> subjects[]
POST   /api/subjects                         -> subject
GET    /api/subjects/:id                     -> subject
PUT    /api/subjects/:id                     -> updated subject
DELETE /api/subjects/:id                     -> { success }
POST   /api/topics/extract/:subjectId        -> topics[]   (multipart PDF)
GET    /api/topics/:subjectId                -> topics[]
PUT    /api/topics/:topicId                  -> updated topic
DELETE /api/topics/:topicId                  -> { success }
```

#### AI Extraction Flow (Flask: extractor.py)
1. Multer saves PDF to `/uploads/` on Node.js
2. Node.js forwards PDF to Flask `POST /extract-topics` via `flaskBridge.js`
3. Flask: PyMuPDF (fitz) parses PDF pages; pdfplumber as fallback for complex layouts
4. LangChain chunks text with RecursiveCharacterTextSplitter
5. Embed chunks → store in ChromaDB namespace `{userId}_{subjectId}_syllabus`
6. Claude API called with structured extraction prompt → returns JSON topics
7. Flask returns `[{ name, description, difficulty, estimatedHours }]` to Node.js
8. Node.js saves topics to MongoDB

### Mobile Tasks

#### Files to Create
| File | Responsibility |
|---|---|
| `src/types/subject.types.ts` | `Subject`, `Topic`, `DifficultyLevel` interfaces |
| `src/components/subjects/SubjectCard.tsx` | React.memo card: name, code, professor, exam date, progress ring |
| `src/components/subjects/TopicItem.tsx` | React.memo row: topic name, difficulty badge, hours, edit/delete |
| `src/components/subjects/PDFUploader.tsx` | expo-document-picker trigger, upload progress, loading state |
| `src/components/common/GradientButton.tsx` | Reusable primary button with gradient |
| `src/components/common/InputField.tsx` | Dark input with focus border, error state |
| `src/components/common/Badge.tsx` | Difficulty/probability colored badge |
| `src/components/common/LoadingOverlay.tsx` | Full-screen loading for AI processing |
| `app/(drawer)/subjects/index.tsx` | FlatList of SubjectCards, FAB to add |
| `app/(drawer)/subjects/add.tsx` | Add subject form — full validation |
| `app/(drawer)/subjects/[id].tsx` | Subject detail — tabbed: Topics, PYQ, Schedule, Chat |

#### SubjectContext Updates
- `fetchSubjects()` — GET `/api/subjects`, cache to AsyncStorage
- `addSubject()` — POST, update state + cache
- `deleteSubject()` — DELETE, update state + cache
- `uploadSyllabus()` — multipart POST to `/api/topics/extract/:id`
- `topics` — map of `subjectId -> Topic[]`

### Acceptance Criteria — Phase 2
- [ ] Add subject form validates all fields with inline errors
- [ ] Subjects list shows as FlatList with SubjectCard (React.memo)
- [ ] Subjects cached in AsyncStorage and available offline
- [ ] PDF picker opens, accepts only PDFs
- [ ] Loading overlay shown during AI processing
- [ ] Topics returned and displayed in review screen with difficulty badges
- [ ] Topics editable (name, difficulty, hours) and deletable inline
- [ ] ChromaDB namespace created: `{userId}_{subjectId}_syllabus`

---

## Phase 3 — PYQ Analysis Engine + Smart Scheduler
> **Goal:** Upload PYQ papers to get exam probability scores; generate adaptive study schedule.

### Features Covered
- Feature 4: PYQ Analysis Engine
- Feature 5: Smart Schedule Generator

### Backend Tasks

#### Files to Create
| File | Responsibility |
|---|---|
| `models/Schedule.js` | blocks[], subjectId, userId, weekStart, completedBlocks[], confidenceScores |
| `services/flaskBridge.js` | Axios calls to Flask `/analyze-pyq`, `/panic-topics`, `/predicted-paper` |
| `controllers/schedule.controller.js` | `generateSchedule()`, `getSchedule()`, `markComplete()`, `updateConfidence()` |
| `routes/schedule.routes.js` | Schedule REST endpoints |

#### Priority Score Formula
```
Priority Score = (difficulty × pyqProbabilityWeight) / daysRemaining

difficulty:           Hard=3, Medium=2, Easy=1
pyqProbabilityWeight: High=3, Medium=2, Low=1
```

#### Probability Scoring
- High: topic appears in ≥60% of PYQ papers
- Medium: 30–59%
- Low: <30%

#### Spaced Repetition Slots
- After studying a topic: add revision at Day+1, Day+3, Day+7

#### API Endpoints
```
POST   /api/topics/pyq/upload/:subjectId    -> enriched topics[]  (multipart, multi-file)
GET    /api/topics/pyq/prediction/:subjectId -> predicted questions[]
POST   /api/schedule/generate/:subjectId    -> schedule
GET    /api/schedule/:subjectId             -> schedule with blocks
PATCH  /api/schedule/complete/:blockId      -> { success }
PATCH  /api/schedule/confidence/:blockId    { rating: 1-5 } -> updated schedule
```

### Mobile Tasks

#### Files to Create
| File | Responsibility |
|---|---|
| `src/types/schedule.types.ts` | `ScheduleBlock`, `WeeklySchedule`, `ConfidenceRating` |
| `src/components/schedule/ScheduleBlock.tsx` | React.memo — swipeable, Reanimated pan gesture |
| `src/components/schedule/WeekStrip.tsx` | Horizontal week calendar, active day highlight |
| `src/components/schedule/ConfidenceModal.tsx` | Slide-up modal (Animated API), 1–5 star rating |
| `app/(drawer)/schedule.tsx` | WeekStrip + FlatList of ScheduleBlocks, offline cache |
| `app/(drawer)/subjects/[id].tsx` (PYQ tab) | Multi-PDF upload, frequency chart, probability badges |

#### Animation Requirements
- **Swipe-to-complete**: React Native Reanimated pan gesture on ScheduleBlock
- **Confidence modal slide-up**: `Animated.spring` translateY 300 -> 0
- **Subject card entrance**: Reanimated staggered fade+translateY on list mount

### Acceptance Criteria — Phase 3
- [ ] Upload multiple PYQ PDFs with year tags per subject
- [ ] Topics show updated probability badges (High/Medium/Low) after analysis
- [ ] Frequency bar chart renders per topic
- [ ] Predicted question paper generated by AI
- [ ] Schedule generated with correct priority ordering
- [ ] Swipe-to-complete works with spring animation
- [ ] Confidence modal slides up after marking complete
- [ ] Low confidence (1–2): extra revision slots added
- [ ] High confidence (4–5): revision slots removed
- [ ] Schedule cached in AsyncStorage

---

## Phase 4 — Customizable RAG Chatbot + Quiz Mode
> **Goal:** Fully functional AI chat with SSE streaming, personalized settings, and 5-type quiz engine.

### Features Covered
- Feature 6: Customizable RAG Chatbot
- Feature 7: Quiz Mode
- Feature 8: Confidence + Adaptive Rescheduling

### Backend Tasks

#### Files to Create
| File | Responsibility |
|---|---|
| `models/ChatSession.js` | messages[], subjectId, userId, settings{personality,language,difficulty} |
| `services/flaskBridge.js` | Axios bridge — forwards chat/quiz requests to Flask `/chat`, `/chat/stream`, `/quiz` |
| `routes/chat.routes.js` | Chat + quiz endpoints |
| `controllers/chat.controller.js` | `sendMessage()` SSE (proxied from Flask), `startQuiz()`, `submitAnswer()`, `endQuiz()` |

#### RAG Pipeline (Flask: rag_chat.py)
1. Node.js receives `{ message, subjectId, settings, history }` from mobile
2. Node.js forwards to Flask `POST /chat/stream` via `flaskBridge.js`
3. Flask: similarity search in ChromaDB `{userId}_{subjectId}_syllabus` (top-5 chunks)
4. Build dynamic system prompt with personality/language/difficulty/persona
5. If `panicMode === true`: override to Panic personality regardless of settings
6. Flask streams response via SSE; Node.js proxies SSE stream back to mobile
7. Node.js saves message pair to ChatSession in MongoDB

#### Quiz Question Types
| # | Type | Description |
|---|---|---|
| 1 | MCQ | 4 options, 1 correct, AI-generated from topic |
| 2 | True/False | Statement about topic concept |
| 3 | Fill in Blank | Key term removed from definition |
| 4 | Short Answer | Open-ended, AI-evaluated on submit |
| 5 | PYQ-Predicted | Sourced from `{userId}_{subjectId}_pyq` ChromaDB |

#### API Endpoints
```
POST   /api/chat/message              { subjectId, message, settings }  -> SSE stream
GET    /api/chat/history/:subjectId   -> messages[]
POST   /api/chat/quiz/start           { subjectId, topicId?, count:5 }  -> quiz session
POST   /api/chat/quiz/answer          { sessionId, questionId, answer } -> { correct, explanation }
GET    /api/chat/quiz/result/:sessionId -> { score, weakTopics, summary }
```

### Mobile Tasks

#### Files to Create
| File | Responsibility |
|---|---|
| `src/components/chat/ChatBubble.tsx` | React.memo — AI/user bubble, streaming token render |
| `src/components/chat/ChatInput.tsx` | Text input + send button + Quiz Me button |
| `src/components/chat/SettingsDrawer.tsx` | Slide-in panel — personality, language, difficulty, persona |
| `src/components/chat/QuizCard.tsx` | React.memo — question, answer options, animated timer bar |
| `app/(drawer)/chat.tsx` | FlatList of ChatBubbles, SSE connection, settings drawer |

#### Chatbot Settings (AsyncStorage per subject)
```json
{
  "personality": "Friendly | Strict | Socratic | Panic",
  "language": "English | Hindi | Hinglish",
  "difficulty": "Beginner | Intermediate | Advanced",
  "personaName": "string",
  "avatarIndex": 0
}
```

### Acceptance Criteria — Phase 4
- [ ] Chat screen loads with subject context and prior history
- [ ] Messages stream token-by-token from Claude via SSE
- [ ] Settings drawer slides in and changes personality/language/difficulty
- [ ] Settings persisted per-subject in AsyncStorage
- [ ] "Quiz Me" triggers quiz mode with 5 questions
- [ ] MCQ shows 4 options, timer counts down, correct answer highlighted
- [ ] Short answer evaluated by AI with explanation shown
- [ ] Quiz end screen shows score, weak topics list, "Study These Next" CTA
- [ ] Chat history maintained in AppContext during session

---

## Phase 5 — Panic Mode + Semester Dashboard + Admin Panel
> **Goal:** Complete Panic Mode, health dashboard, and admin panel.

### Features Covered
- Feature 9: Panic Mode
- Feature 10: Semester Health Dashboard
- Admin Panel (4 screens)

### Backend Tasks

#### Panic Mode Trigger Condition
```
IF (daysUntilExam <= 3) AND (incompleteTopics / totalTopics >= 0.30):
  panicMode = true
  generate panic schedule (High-probability topics only, hour-by-hour)
```

#### Admin API Endpoints
```
GET    /api/admin/users                   -> paginated users[]
GET    /api/admin/users/:id               -> user + subjects + stats
PATCH  /api/admin/users/:id/access        { premiumInsights: bool }
GET    /api/admin/content/queue           -> pending review items[]
PATCH  /api/admin/content/:id/approve     -> { success }
PATCH  /api/admin/content/:id/reject      -> { success }
GET    /api/admin/overview                -> { totalUsers, activeSubs, dailyQueries, health }
GET    /api/admin/ai-config               -> { model, temperature, contextWindow, maxTokens }
PATCH  /api/admin/ai-config               -> updated config
```

### Mobile Tasks

#### Files to Create
| File | Responsibility |
|---|---|
| `src/components/panic/PanicOverlay.tsx` | Full-screen red Reanimated entrance: withSpring scale 0.8->1.0 + opacity |
| `src/components/panic/PanicQueue.tsx` | Priority task list: High/Medium/Low impact badges, time estimates |
| `src/components/panic/CountdownTimer.tsx` | Live HH:MM:SS countdown to exam |
| `src/components/common/StudyHeatmap.tsx` | GitHub-style 52x7 grid, intensity from #0A0F1E -> #4A90D9 |
| `src/components/common/CompletionRing.tsx` | SVG circular progress ring per subject |
| `app/(drawer)/home.tsx` (complete) | Greeting, active subjects, heatmap, streak, panic trigger |
| `app/(drawer)/profile.tsx` | Stats row, AI personality info, settings, danger zone |

#### Panic Mode App-Wide Effect
1. `AppContext.panicMode = true` -> persisted in AsyncStorage
2. `PanicOverlay` animates in (Reanimated withSpring)
3. All accent colors switch from `#4A90D9` -> `#E74C3C` (read from AppContext)
4. Chatbot personality force-overridden to `'Panic'` in all chat requests
5. Home shows CountdownTimer + PanicQueue instead of normal dashboard

#### Dashboard Components
- **Completion rings**: SVG Circle with strokeDasharray animation per subject
- **Study heatmap**: Custom grid, cell color intensity based on study hours that day
- **Streak counter**: useMemo calc over session history, flame animation on increment
- **Weakest subject card**: useMemo over subjects sorted by avg confidence score asc
- **Stats row**: total hours, quizzes done, topics completed (from SubjectContext)

### Acceptance Criteria — Phase 5
- [ ] Panic Mode auto-triggers when exam within 3 days + 30%+ topics incomplete
- [ ] Red overlay entrance animation plays with spring physics (Reanimated)
- [ ] App-wide accent shifts to `#E74C3C` in Panic Mode
- [ ] Panic schedule shows only High-probability topics, hour-by-hour
- [ ] Chatbot personality overridden to Panic regardless of saved settings
- [ ] Countdown timer ticks live on home screen
- [ ] Home dashboard shows completion rings, heatmap, streak counter
- [ ] Weakest subject alert card appears on dashboard
- [ ] Profile screen shows real stats from backend
- [ ] Admin panel accessible with role-gating (all 4 screens functional)

---

## Testing Checklist

### How to Run
```bash
# Terminal 1 — Node.js Backend
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CLAUDE_API_KEY, FLASK_AI_URL
npm install
node server.js         # runs on http://localhost:5000

# Terminal 2 — Flask AI Backend
cd ai-backend
cp .env.example .env   # fill in ANTHROPIC_API_KEY, NODE_BACKEND_SECRET
pip install -r requirements.txt
python app.py          # runs on http://localhost:5001

# Terminal 3 — Mobile
cd mobile
npm install
npx expo start         # scan QR with Expo Go
```

### End-to-End Test Flow Per Phase
| Phase | Test Sequence |
|---|---|
| 1 | Register -> Login -> Close app -> Reopen (auto-login) -> Logout |
| 2 | Add subject -> Upload PDF -> Wait for AI (~15s) -> Review topics -> Edit one -> Delete one |
| 3 | Upload 3 PYQs -> View probability badges -> Generate schedule -> Swipe complete -> Rate 2/5 confidence -> Verify extra revision slot added |
| 4 | Open chat (Advanced Algorithms) -> Ask question -> Watch stream -> Tap Quiz Me -> Answer 5 questions -> View end screen |
| 5 | Set exam date = today -> Reopen app -> Panic overlay appears -> View panic schedule -> Open chat -> Verify Panic personality active |

---

## Dependencies Reference

### Mobile (mobile/package.json)
```json
{
  "expo": "~51.0.0",
  "expo-router": "~3.5.0",
  "expo-font": "~12.0.0",
  "expo-splash-screen": "~0.27.0",
  "expo-secure-store": "~13.0.0",
  "expo-document-picker": "~12.0.0",
  "@react-native-async-storage/async-storage": "^1.23.0",
  "axios": "^1.7.0",
  "react-native-reanimated": "~3.10.0"
}
```

### Backend (backend/package.json)
```json
{
  "express": "^4.19.0",
  "mongoose": "^8.4.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "multer": "^1.4.5",
  "dotenv": "^16.4.0",
  "cors": "^2.8.5",
  "axios": "^1.7.0"
}
```

### AI Backend (ai-backend/requirements.txt)
```
flask
flask-cors
flask-sse
anthropic
langchain
langchain-anthropic
langchain-community
chromadb
pymupdf
pdfplumber
python-dotenv
```

---

## Environment Variables Reference

### backend/.env
```
MONGO_URI=
JWT_SECRET=
PORT=5000
FLASK_AI_URL=http://localhost:5001
```

### ai-backend/.env
```
ANTHROPIC_API_KEY=
CHROMA_PERSIST_PATH=./chroma_db
PORT=5001
NODE_BACKEND_SECRET=   # shared secret so only Node.js can call Flask
```

---

## Stitch Design Reference Files

| Screen | File |
|---|---|
| Onboarding & Auth | `stitch_assets/1_Onboarding_Auth.html` + `.png` |
| Home Dashboard | `stitch_assets/2_Home_Dashboard.html` + `.png` |
| Subjects & Details | `stitch_assets/3_Subjects_Details.html` + `.png` |
| PYQ Analysis | `stitch_assets/4_PYQ_Analysis.html` + `.png` |
| Study Schedule | `stitch_assets/5_Study_Schedule.html` + `.png` |
| AI Guru Chat & Quiz | `stitch_assets/6_AI_Guru_Chat_Quiz.html` + `.png` |
| Panic Mode Flow | `stitch_assets/7_Panic_Mode_Flow.html` + `.png` |
| Profile & Settings | `stitch_assets/8_Profile_Settings.html` + `.png` |
| Admin: Student Mgmt | `stitch_assets/Admin_Student_Management.html` |
| Admin: Content Review | `stitch_assets/Admin_Content_Review.html` |
| Admin: Global Overview | `stitch_assets/Admin_Global_Overview.html` |
| Admin: AI Settings | `stitch_assets/Admin_AI_Settings.html` |
| Design Tokens | `stitch_assets/STITCH_REFERENCE.md` |

---

*Last updated: April 2026 — SyllabusAI v1.0*
