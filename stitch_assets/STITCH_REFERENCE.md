# SyllabusAI — Stitch Design Reference
> Project ID: 15619917353899216181

---

## Design System

### Color Palette (Dark Mode)
| Token | Hex |
|---|---|
| background / surface | #0e1322 |
| primary | #a0caff |
| primary_container | #4f94dd |
| on_background / on_surface | #dee1f7 |
| tertiary (warning/deadline) | #ffb955 |
| tertiary_container | #c68200 |
| error (Panic Mode) | #ffb4ab |
| error_container | #93000a |
| surface_container | #1a1f2f |
| surface_container_high | #25293a |
| surface_container_highest | #2f3445 |
| surface_container_low | #161b2b |
| surface_container_lowest | #090e1c |
| outline | #8b919c |
| outline_variant | #414751 |
| secondary | #b1c8e9 |
| secondary_container | #314864 |

### Override Colors
- Primary Override: #4A90D9
- Tertiary Override: #F5A623
- Neutral Override: #0A0F1E

### Typography
- All fonts: **Inter** (headline, body, label)
- Display (3.5rem): Authoritative welcome states
- Headlines (1.75rem): Subject/course starts
- Body (1rem, line-height 1.6): Readable descriptions
- Labels (0.6875rem): ALL-CAPS, 0.05em letter-spacing for metadata

### Shape
- Roundness: ROUND_FULL
- Main course cards: 2rem radius
- Assignment cards: 1.5rem radius
- Buttons: 9999px (capsule)

### Design Principles
- **No borders**: Use background shifts for separation
- **Glassmorphism**: 5% white opacity + backdrop-blur 12px for floating elements
- **Ambient shadows**: 40px blur, 0px offset, 6% opacity (soft glow, not drop shadow)
- **Ghost borders**: outline_variant at 15% opacity for inputs
- **No pure black (#000)**: Always deep navy
- **No Material ripples**: Use scale 1.02x or fade-in transitions
- **Intentional asymmetry**: Assignment counts top-right, course titles bottom-left

### Buttons
- Primary: Gradient from #a0caff to #4f94dd
- Tertiary: Transparent bg, primary text, no border
- Radius: full (9999px capsule)

### Input Fields
- Background: surface_container_highest
- Bottom-only ghost border, illuminates to primary on focus
- AI Input: Glassmorphic with 1px gradient border (blue to transparent)

---

## Screen 1: Onboarding & Auth
**ID:** 402a41660b13485798a29b24edb8fc84
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0ujd_ilsfwutKroR4XrPyCSrcUP1PkB1gNf8LMD1tiP6ew1RgQ6DR2Mk8OllI0RYxy91QSkoDpU5naofpyQKsspHUwnMT6Vyre09NIFwHFAbRXF3pYNJKI59lu3kniN6EDxBfh1w7nLFq1Z_yzLhaF_PNAu6y1ul2t2dVl5iQPslFlt2yHNkaJPLtCC-u6DCQbq2J92r2fCYUbQCy7BFN5HszrYJRB7iR5G9oKkfj7KJgPh7r0uVSXWY32Q
**Size:** 780x7298 (tall scroll — contains multiple sub-screens)

### Content Structure:
- **Hero/Splash:** "SyllabusAI — Your unfair academic advantage"
- **Onboarding Slide 1:** "Upload syllabus" — Turn static PDFs into dynamic study paths
- **Onboarding Slide 2:** "AI predicts exams" — Analyze historical patterns
- **Onboarding Slide 3:** "Study smarter" — Automated schedules that adapt
- **Register Screen:** "Create your account — Join the next generation of top performers"
- **Login Screen:** "Welcome back" — with Forgot Password link
- **Footer badge:** "Secure Academic Workspace — Encrypted syllabus parsing & private AI"

---

## Screen 2: Home Dashboard
**ID:** 0ab77522678a455db82b10c2032c03c4
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0uiRKoH0slPLfnm7EyWiqiirijPOwV5H3Az_bf3_AIQm5UppC6dLJiLygOY-l5hnq-Q6q7whfc5zjBCcvsRlLIqVmw07Jetx0_nU4svtewEeCJCo4BpWstFDSnwAaBkiAWnx2eb1B7_EJ2tgsvvCZarK0h7Y6COFsYqaMVwIfeQI-ZJTechBhpbitwrf6egu9SLsCtSUID3T6stLeqGAAxpx_nLzZYo43GG6_gYEpkRUwchFiVU8pPD1gnqN
**Size:** 780x2872

### Content Structure:
- **Header:** "Fall 2024 Semester"
- **Greeting:** "Good morning, Ayush — You have 3 focus tasks for today."
- **Active Subjects Section:**
  - Advanced Thermodynamics — Midterm Preparation
  - Neural Networks — Architecture Design
  - Digital Ethics — Research Thesis
- **Today's Plan:**
  - Entropy & Second Law
  - Backpropagation Theory
- **Streak:** "7 Day Study streak maintained. Keep it up!"
- **Study Activity** heatmap section
- **Bottom Nav:** Home | Subjects | Schedule | Chat | Profile

---

## Screen 3: Subjects & Details
**ID:** c9c222cb449b4442acb87774539a4fcc
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0uiB1cD8rUd33NDw8CZQ62WXhviWZMOYeB8iUQh2pwsRQOBwjwQEq0doeVFKOU21vJ0gV5OaTvY_yG0XIuOR_2kBWuWlklFrecZbmb8l3CXQzsaScfLsM-MWzjBflKswmn3fzmD8VVs99lAtgnrVHn1zy_ff6RAFClZfdV-mDmnnpps0yIQF3OIJO4tNkhdR9rdmL2FyG54dzwQIDVKef6niIheG93rFR6hX7Z9V3a5LPyWn2SKJlhW_q0QB
**Size:** 780x4814

### Content Structure:
- **Title:** "Academic Inventory — Curating your Fall 2024 success path."
- **Subject Cards:**
  - Advanced Algorithms — Prof. Alistair Thorne (with Syllabus Depth indicator)
  - Neurolinguistics — Dr. Sarah Chen
  - Cybersecurity — Prof. Marcus Vane
- **Add Subject CTA:** "Expand Your Curriculum — Add a new course to let the Digital Dean curate your study strategy."
- **Subject Detail View (Advanced Algorithms):**
  - Complexity Analysis & Big O — with PYQ Weight
  - Dynamic Programming: Knapsack — with PYQ Weight
  - Graph Theory: Dijkstra's — with PYQ Weight
- **Footer:** "The Digital Dean — Curating your success"

---

## Screen 4: PYQ Analysis
**ID:** 83ff6adc7d294833a97ba20ad677e4a3
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0uj3hRFdBSADfZKL5ZlpC-qOx_5XktC2GaTpDWfr8gKcag3nAvMk6tt_AVbif0loBtsgLv7J7dj1mQA0tOZtPBYgt8pcLZTLwXbQIURqMg499J7w2vzq-4FXZOSJtJbeBhO62BjkP_7bFrkjrdyRisWDVyijy7e8kCw_rl7gxfelSoqJFfdhHGYE_lRMUKJNAsYP6TO63mExy3F94k0OWK__VUzrdCg-azSro-dDmukk-WX5OxMZHOpbiARc
**Size:** 780x5160

### Content Structure:
- **Header:** "Advanced Thermodynamics — PYQ Analysis & Prediction Engine"
- **Historical Data Repository:** "Select previous year papers for the AI to cross-reference patterns and weightage."
- **Pattern Insight (AI quote):** "70% of papers from the last 5 years prioritize Entropy and Second Law in the long-form section. Expect a calculation-heavy question this semester."
- **Topic Frequency Analysis:** Occurrence chart across selected PYQs (with Data Accuracy indicator)
- **AI-Predicted Paper (Fall 2024):**
  - "Derive the Maxwell-Boltzmann distribution and explain its significance in gas kinetics."
  - "Discuss the Gibbs-Duhem equation and its application to multicomponent systems."
  - "State the Third Law of Thermodynamics and the concept of Absolute Entropy."
- **CTA:** "Need more variations? Generate another set of predicted questions"

---

## Screen 5: Study Schedule
**ID:** d21816e5a028429aa269ae3336954ab9
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0ui-6J04kwtWmVfJV4NTuZS5_-v4QSsUc3_FsbkWjRvgnoLkxB4F_s36JOhlhLSPjO4QH8oUIur0hjRQLSnhLbv2JuqhewvowO_EKwUyR3P3q1qZL5k1MiKrw7BFDHmsxtV9nvN5Pra8M7BWKmyFsidVUUSOFB164O5UtwX5rKt7j5lz7XxjUarQc7nxgDNcJirB_1VlpXYvFicIwwjqGvu4O3VOFKQRw2nRzt__5tmj0D6SDXM_smbXuQOp
**Size:** 780x2434

### Content Structure:
- **Header:** "Schedule — Autumn Term • Week 8"
- **Today's Study Blocks:**
  - Advanced Thermodynamics — Entropy and the Second Law of Dynamics
  - Neurobiology Foundations — Synaptic Plasticity and Memory
  - Organic Chemistry Lab — Synthesis of Salicylic Acid
- **Review Session Modal:** "How confident are you with the Neurobiology Foundations topics discussed today?" (confidence rating 1-5)
- **Bottom Nav:** Home | Subjects | Schedule | Chat | Profile

---

## Screen 6: AI Guru Chat & Quiz
**ID:** afd5fb8937594d699a7fa4d357a8b149
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0uiR5t9XXw0rG8sikjcVIIDjjUXkbvWMVHO4U2ROLijxXqk1lFxUyDdKMq2_Tke7g_S8AgwpgU9qgx1OknQlr3HiOUxinKRDFRSXOA4VM07YYli-8lN7npkMcwQd4AdfehFX0aNK6RMM1iPMLv81-BfOqbsfivvTYwFIRMCkJY_j1lRaKyk5pmiFOAIIC4Xd4CbapghFXfCZZw_ibOQKTEsvwrcZx7yUOQGaBoSNsHKILlvqd-fqtiqxkX6-
**Size:** 780x1768

### Content Structure:
- **Chat Header:** "AI GURU"
- **AI Message:** "Welcome back! I've analyzed your recent notes on Schrodinger's Equation. Ready to run a quick diagnostic quiz or should we dive into the derivations?"
- **User Response:** "Let's try the diagnostic quiz first. I'm feeling a bit shaky on the probability density interpretations."
- **Quiz Question:** "What does the square of the absolute value of the wavefunction |psi(x,t)|^2 represent?"
  - Option with warning icon: Wave-Particle Duality
  - Option with check icon: Operators
- **Settings Panel:**
  - "The Digital Dean — Fall 2024"
  - Guru Personality selector
  - Difficulty Level selector
  - Links: Academic Settings, Notification Preferences, Archive, Panic Mode Settings

---

## Screen 7: Panic Mode Flow
**ID:** dd71ff71af6942568349c9e39f8df0bd
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0uh6QpNHA13V7OpgKyrgLUDz__nZS3daGSlbHr_1u5lTPfUHr-M1EkxYHe7_PIY7habcE8kglyUd311wMOJP4d5f5bR-0ICToO8TP6K5xR8nMeWdzxcvpBZoUhtBRHCH_gJU70bYvVSi0V5h2jsAtFcx9v_2Tw1YsN3-BCQJTUaGAKWm4WmXR88ZBnPxCVbgLX_6AkdhVxOCASSpUGj55UdacX17MnMVXsWIbDWluzAxmh5ur2vSEHR-TMP-
**Size:** 780x3916

### Content Structure:
- **Giant Header:** "PANIC MODE — Exam in 48h: Applied Thermodynamics"
- **AI Survival Strategy:** "Focus ONLY on Carnot cycles and Second Law applications. I've stripped your syllabus to the 14 essential concepts that account for 85% of previous exam questions."
- **Next Milestone:** "Chapter 4 Summary Review — Due in 2 hours"
- **Concise Deck:** "12 flashcards left for core mastery"
- **Panic Queue (priority-ordered tasks):**
  - Entropy Derivations — High Impact • 30 mins
  - Cycle Efficiency Calc — Medium • 45 mins
  - Phase Diagrams — Low • 15 mins
- **Environment: Focus Red** (red-accented theme override)

---

## Screen 8: Profile & Settings
**ID:** 50287bdd67a7419393e6b8f0dacd0bc5
**Screenshot:** https://lh3.googleusercontent.com/aida/ADBb0uiOldsyP8a20Zm-9hND16iW2PpMcKsBY7jKA9CQbKZmXZdbBTbHWGw6waE3v38H09m9O2Hb27Z3AVx7FPHRYNUU_4S6eKk7ckONR1ZxuYc8VMYm5BdeijYNKfpIQCUiJ2-T_2cPB3aF9XPZmgsSrmqPkd2SXJhvbkARGX93kks2YYZVSD4JhzofOadtERqQKndtFNod3q6SqWUzXtJnwXfq1NSsm0s5E71SRLmhQ1rOkNVKObNXuwWzT_2e
**Size:** 780x4626

### Content Structure:
- **Profile Header:** "Alex Harrington — Stanford University • Computer Science"
- **Stats Row:** 142 Total Hours | 6 Subjects | 24 Quizzes | 12 Day Streak
- **Academic Engine Section:**
  - AI Personality Profile: "The AI is currently set to Socratic Method. It will ask guiding questions rather than providing direct answers to improve long-term retention."
- **System Section**
- **Danger Zone:** "Panic Mode Settings — Configure how the app reacts when you fall behind 20%+ of your semester goals."
- **Control Center Links:** Academic Settings | Notification Preferences | Archive | Panic Mode Settings
- **Bottom Nav:** Home | Subjects | Schedule | Chat | Profile

---

## Bottom Navigation (Consistent Across All Screens)
| Icon | Label |
|---|---|
| home | Home |
| library_books | Subjects |
| calendar_month | Schedule |
| forum | Chat |
| person | Profile |
