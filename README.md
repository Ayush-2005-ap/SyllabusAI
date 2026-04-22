Awesome! Great progress today getting the full AI pipeline working. 

Here is a professionally structured, high-impact `README.md` for your GitHub repository. It covers the architecture, tech stack, and setup instructions.

***

# 🎓 SyllabusAI: The Intelligent Academic Powerhouse

**SyllabusAI** is a high-fidelity mobile application designed to transform messy syllabus PDFs into structured, actionable study plans. Using a multi-service architecture (Node.js, Python, and React Native), it leverages LLMs to automate subject management, topic extraction, and interactive learning.

---

## 🚀 Key Features

*   **📄 AI Syllabus Extraction**: Upload any PDF syllabus and let the Python/LangChain service automatically identify chapters, topics, difficulty levels, and estimated study hours.
*   **📅 Smart Scheduling**: An automated scheduling engine that maps out your entire semester based on syllabus depth and exam dates.
*   **🤖 AI Guru (Socratic Mode)**: A specialized chatbot that doesn't just give answers, but guides you through complex topics using Socratic questioning and diagnostic quizzes.
*   **⚡ Panic Mode**: A high-intensity study plan generator for those "I have an exam tomorrow" moments.
*   **🎨 Premium Glassmorphic UI**: A state-of-the-art dark theme built with React Native and Expo, featuring smooth micro-animations and a sleek "Stitch" design system.

---

## 🛠 Tech Stack

### Frontend (Mobile)
*   **Framework**: React Native with Expo (Router)
*   **State Management**: Context API
*   **Styling**: High-fidelity custom themes with Glassmorphism
*   **Storage**: Expo SecureStore (Auth) & Async Storage

### Backend (Orchestration)
*   **Runtime**: Node.js & Express
*   **Database**: MongoDB (Atlas)
*   **Authentication**: JWT (JSON Web Tokens)
*   **File Handling**: Multer for PDF uploads

### AI Service (Brain)
*   **Language**: Python 3.10+
*   **Framework**: Flask
*   **AI Engine**: LangChain & OpenAI (GPT-3.5/4o)
*   **PDF Parsing**: PyMuPDF

---

## 📂 Project Structure

```text
SyllabusAI/
├── mobile-clean/     # React Native / Expo Application
├── backend/          # Node.js Express API (Orchestration & Database)
└── ai-backend/       # Python Flask API (AI Topic Extraction)
```

---

## ⚙️ Setup Instructions

### 1. Backend (Node.js)
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5050
# MONGO_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_secret
# FLASK_AI_URL=http://your_local_ip
npm run dev
```

### 2. AI Backend (Python)
```bash
cd ai-backend
pip install -r requirements.txt
# Create a .env file with:
# OPENAI_API_KEY=your_key
# NODE_BACKEND_SECRET=your_shared_secret
python app.py
```

### 3. Mobile (Expo)
```bash
cd mobile-clean
npm install
# Update src/services/api.ts with your machine's IP address
npx expo start
```

---

## 📸 Preview
*(Insert your screenshots here! User the ones you just took of the Dashboard and extracted topics)*

---

## 🛡 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by Ayush Pandey**

***
