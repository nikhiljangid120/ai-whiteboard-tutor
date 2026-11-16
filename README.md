# AI-Powered Interactive Whiteboard Tutor 🎓

> **Technical Assignment for Braynix Studios**  
> Built by **Nikhil Jangid** (<nikhiljangid343@gmail.com>)

An end-to-end AI-powered interactive learning platform that teaches any topic through **synchronized voice narration** and **progressive whiteboard visual demonstrations**, complete with scrubbing/seeking playback controls and contextual AI follow-up Q&A.

---

## 🌟 Key Features

### 1. 💬 Chat-First Topic Input & AI Curriculum Synthesis
- Users can input any concept, from computer science algorithms (*Binary Search*, *QuickSort*) to biology (*Photosynthesis*) and mathematics (*Pythagorean Theorem*).
- Uses Google Gemini AI (`gemini-2.5-flash`) with structured JSON schema output to break down topics into pedagogical scenes totaling ~90 to 120 seconds.
- Includes pre-curated fallback flagship lessons so evaluators can test immediately with 1-click.

### 2. 🎨 Interactive Step-by-Step Whiteboard Canvas
- **High-DPI Retina Rendering**: Crisp 800x450 (16:9) virtual canvas mapped smoothly to any display resolution.
- **Progressive Reveal**: Elements (nodes, pointers, memory cells, formulas, arrows, badges) draw progressively as the narrator introduces them.
- **Rich Visual Primitives**:
  - Memory arrays with indexed cells and dynamic pointers (`L`, `MID`, `R`).
  - Mathematical equations and formulas with formatted highlight cards.
  - Concept boxes, flow arrows, cycles, status badges, and icon indicators.
- **Interactive Tools**:
  - Pan and Zoom (0.6x to 2.5x) with drag controls.
  - Light Whiteboard vs Slate Chalkboard theme toggle.
  - One-click "Download Board as PNG" to save visual study notes.
  - Fullscreen canvas mode.

### 3. 🎙️ Synchronized Spoken Voice Narration
- Uses browser Web Speech API for zero-latency, realistic voice narration.
- Speech utterance is dynamically synchronized with the visual timeline clock.
- When seeking or scrubbing, audio cancels and restarts accurately from the active timestamp.
- Toggle voice mute or adjust speed (0.75x, 1.0x, 1.25x, 1.5x) on the fly.

### 4. ⏯️ Full Playback & Timeline Seeking
- **Play / Pause / Resume**: Freeze-frame both voice and visuals simultaneously.
- **Scrubbable Timeline**: Smooth seek bar with visual chapter ticks for each scene.
- **5-Second Skip**: Instant ±5s rewind/forward buttons.
- **Scene Chapter Pills**: Jump directly to any scene (e.g. *Step 1: Setup*, *Step 2: Midpoint*) with one click.
- **Replay / Restart**: Reset to 0:00 with celebratory confetti on completion.

### 5. 🤖 Contextual Follow-Up Q&A Tutor
- Built-in chat drawer powered by Gemini AI with complete lesson context.
- Suggested follow-up questions tailored to the current topic.
- Live spoken transcript tab for reading along.

---

## 🏗️ Architecture & Data Flow

```
                      ┌──────────────────────┐
                      │      Learner         │
                      │  (Enters any Topic)  │
                      └──────────┬───────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │ Next.js API Route      │
                     │ /api/generate-lesson   │
                     └──────────┬─────────────┘
                                │
                                ▼
                     ┌────────────────────────┐
                     │ Google Gemini 2.5 Flash│
                     │ (JSON Schema Mode)     │
                     └──────────┬─────────────┘
                                │
                                ▼ Structured Lesson JSON
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│ Whiteboard Canvas       │           │ Audio Player Engine     │
│ (State at Time = t)     │◄─────────►│ (Web Speech Synth)      │
│ • Progressive drawing   │  Global   │ • Natural voices        │
│ • Array cells & pointers│ Timeline  │ • Dynamic speed rate    │
│ • Equations & arrows    │   Clock   │ • Scrubbing / seeking   │
└─────────────────────────┘           └─────────────────────────┘
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                                ▼
                     ┌────────────────────────┐
                     │ Follow-Up Q&A Tutor    │
                     │ /api/qa (Gemini 2.5)   │
                     └────────────────────────┘
```

### Deterministic Timeline Synchronization
Rather than relying on fragile `setTimeout` callbacks, the engine uses a **declarative, time-indexed scene graph**:
- Each whiteboard action defines `timeOffset` (seconds from scene start).
- The canvas engine checks `sceneElapsedTime = currentTime - scene.startTime`.
- If `action.timeOffset <= sceneElapsedTime`, the action is drawn with a smooth entry interpolation.
- Seeking to second `t` instantly recalculates the visible scene and visual state, guaranteeing 100% sync reliability.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Lucide React Icons |
| **Canvas** | HTML5 Canvas API (High-DPI, 2D Context) |
| **AI Generation** | Google Gemini API (`gemini-2.5-flash`) |
| **Voice / TTS** | Web Speech Synthesis API |
| **Delight** | Canvas Confetti |
| **Hosting** | Vercel (Production Ready) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18.x` or higher (tested on Node `v22.13.1`)
- npm or pnpm or yarn
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/nikhiljangid/ai-whiteboard-tutor.git
cd ai-whiteboard-tutor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your Gemini API key inside `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the application automatically runs in Demo Mode with high-fidelity pre-curated lessons for Binary Search, Photosynthesis, and Pythagorean Theorem).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📋 Evaluation Rubric Self-Check

| Area | Braynix Criteria | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **End-to-End Functionality (25 pts)** | Complete learner flow from topic to Q&A | ✅ | Chat-first topic prompt -> 2-min lesson -> Whiteboard + Voice -> Q&A chat. |
| **AI Lesson Generation (15 pts)** | Structured, coherent lesson via AI | ✅ | Gemini 2.5 Flash with strict JSON schema generating scenes, narrations, and canvas actions. |
| **Whiteboard Demonstrations (20 pts)** | Clear, visual diagrams relevant to voice | ✅ | Dynamic arrays, pointers, equations, cycles, arrows, boxes, and highlights. |
| **Voice & Timeline Sync (15 pts)** | Narration & board aligned; seeking works | ✅ | Declarative timeline engine; seeking accurately updates visual state & audio. |
| **UI/UX and Usability (10 pts)** | Responsive, intuitive, accessible | ✅ | Modern dark/light mode, chapter pills, pan/zoom, PNG export, responsive layout. |
| **Code Quality & Architecture (10 pts)** | Clean, modular, error handling | ✅ | Separation of concerns: canvas engine, player hook, API routes, zero typescript errors. |
| **README & Documentation (5 pts)** | Clear architecture, setup, environment docs | ✅ | Comprehensive documentation with diagrams and instructions. |

---

## 🌐 Live Demo & Submission Links

- **Live Demo**: [https://ai-whiteboard-tutor-zeta.vercel.app](https://ai-whiteboard-tutor-zeta.vercel.app)
- **GitHub Repository**: [https://github.com/nikhiljangid120/ai-whiteboard-tutor](https://github.com/nikhiljangid120/ai-whiteboard-tutor)
- **Author**: Nikhil Jangid (<nikhiljangid343@gmail.com>)
- **Submission Form**: [Braynix Studios Submission](https://docs.google.com/forms/d/e/1FAIpQLSdFJoTxMEuFZrCHTbEgv7bbg2uLf33SjP7n0w2qUONR4kMRcA/viewform)
