# Placement Prep & AI Interview Coach

A comprehensive full-stack platform designed to help students master technical interviews, track DSA progress, and manage job applications—all in one place.

## 🚀 Key Modules

### 1. AI Interview Coach
- **Multi-Modal Analysis**: Practice with text or voice recording.
- **Instant AI Feedback**: Powered by Gemini/OpenAI to evaluate confidence, grammar, and technical correctness.
- **Simulated Interviews**: HR and Technical rounds with automated scoring.

### 2. DSA Tracker
- **Problem Management**: Store and categorize your solved Data Structures and Algorithms problems.
- **Progress Monitoring**: Keep a record of your coding journey and revisit complex problems easily.

### 3. Company Application Manager
- **End-to-End Tracking**: Manage your application status (Applied, Interview, Selected, Rejected).
- **Round-by-Round Breakdown**: Track individual interview rounds (Aptitude, Technical, HR).
- **Post-Interview Notes**: Record specific questions asked, mistakes made, and key learnings for future improvement.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (supports local, cloud, or In-Memory MongoDB).
- **AI Integration**: Google Gemini API & OpenAI API.

## 🏁 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.

### 2. Set Up API Keys
Open `backend/.env` and provide your keys:
```env
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

### 3. Installation
```bash
npm run install-all
```

### 4. Run
```bash
npm start
```

## 📂 Project Structure

- `frontend/`: Dashboard UI, simulation screens, and trackers.
- `backend/`: API services for Interviews, DSA, and Company tracking.
