# TaskFlow - Minimalist Task Manager

TaskFlow is a lightweight, full-stack task management application built to showcase a clean, responsive board using React for the frontend and Node.js with MongoDB for the backend.

### Deployed Links
- **Frontend (Vercel)**: `https://your-frontend.vercel.app` (Placeholder)
- **Backend API (Render)**: `https://your-backend.onrender.com/api` (Placeholder)

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Axios, `@dnd-kit/core` for drag-and-drop, React Hot Toast
- **Backend**: Node.js, Express, MongoDB (Mongoose), jsonwebtoken, `bcryptjs` for password hashing

---

## 🚀 Local Setup & Installation

### 1. Configure Environment Variables
Create a `.env` file in the `server/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=supersecretkey_change_me
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Start Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ☁️ Deployment Instructions

### Backend (Render)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start` (Runs `node server.js`)
- **Environment Variables**: Add `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` (your deployed Vercel frontend link).

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_API_URL` pointing to your deployed Render API endpoint (e.g. `https://your-backend.onrender.com/api`).
- **Configuration**: Uses [client/vercel.json](client/vercel.json) to rewrite fallback routes for single-page routing refresh stability.

---

## 📐 Assumptions & Tradeoffs

1. **State Management**: Chose React's standard Context API for user sessions instead of Redux to keep architecture readable and free of boilerplate.
2. **Client-side Search**: Real-time filtering runs on the frontend tasks list to reduce backend payload and eliminate API query latency.
3. **Touch Support**: Maintained standard stage-change select boxes on cards so mobile touchscreen users can modify tasks without relying on touchscreen drag-and-drop coordinates.
4. **dnd-kit Choice**: Used native `@dnd-kit/core` without sortable wrappers to keep visual drag-and-drop simple, lightweight, and easy to maintain.

---

## 📋 Final Deployment Verification Checklist
- [ ] Backend starts and connects to MongoDB Atlas cluster.
- [ ] Frontend builds successfully and deploys on Vercel.
- [ ] User register and login operations work with secure local persistence.
- [ ] Real-time task title search operates on the board.
- [ ] Drag-and-drop updates task status column and syncs with the database.
- [ ] Screen refresh operates cleanly on dashboard without Vercel 404 errors.
- [ ] Responsive columns stack nicely on mobile viewports.
- [ ] Logout clears `localStorage` tokens and redirects to Login.
- [ ] Expired tokens (401 response) trigger automatic logout and redirect.
- [ ] Buttons and forms disable and show load spinners while saving.
