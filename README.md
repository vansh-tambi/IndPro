# TaskFlow - Minimalist Task Manager

TaskFlow is a lightweight, full-stack task management application. This project was built to showcase a clean, responsive web application structure using React for the frontend and Node.js with MongoDB for the backend. 

It features secure JWT authentication, real-time client-side task search, and drag-and-drop task card movement.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Axios, `@dnd-kit/core` (drag and drop), React Hot Toast
- **Backend**: Node.js, Express, MongoDB (with Mongoose), JWT, `bcryptjs` for password security

## 🌟 Key Features

- **JWT Auth Flow**: Register and login with secure password hashing. Token sessions are saved in `localStorage`.
- **Lightweight Drag & Drop**: Move task cards between board columns (To Do, In Progress, Completed) utilizing `@dnd-kit/core`.
- **Mobile Fallback**: Touch devices can transition task stages using accessible select dropdowns on cards.
- **Real-Time Filter**: A search bar filters tasks by title instantly on the client side.
- **Refined Dialog States**: Form inputs and buttons automatically disable during save requests to prevent conflicting actions.
- **Human Error Responses**: Direct, readable feedback for common errors (invalid passwords, missing fields, duplicate emails).

## 📂 Folder Layout

- `server/` — Contains Express server, models (User/Task), auth middleware, controllers, and routes.
- `client/` — Contains React workspace using pages, components, context, and services folders.

## 🚀 Setup & Installation

### 1. Prerequisite Settings
Set up a MongoDB Atlas cluster or start a local MongoDB instance.

### 2. Configure Environment Variables
Create a `.env` file in the `server/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your_jwt_signing_key_here
```

Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Backend Server
```bash
cd server
npm install
npm run dev
```

### 4. Run Frontend Client
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## ☁️ Deployment Instructions

### Backend (Render)
1. Push the code to a GitHub repository.
2. Log in to Render and create a new **Web Service**.
3. Point to the repository and set the Root Directory to `server`.
4. Configure build commands:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Under Environment variables, add `PORT`, `MONGODB_URI`, and `JWT_SECRET`.

### Frontend (Vercel)
1. Log in to Vercel and import your repository.
2. Select the `client` directory.
3. Add the environment variable `VITE_API_URL` pointing to your deployed Render API (e.g. `https://your-api.onrender.com/api`).
4. Vercel automatically detects Vite configurations and builds static files.

## 📐 Assumptions & Tradeoffs

1. **State Management**: Chose React's standard Context API for user sessions instead of Redux to avoid unnecessary boilerplate and keep architecture readable.
2. **Client-side Search**: Implemented filtering on the client side since the volume of tasks is small. This prevents server-side search query overload.
3. **dnd-kit Choice**: Used native `@dnd-kit/core` directly without complex coordinate sorting wrappers to keep drag interactions lightweight, clean, and bug-free.
4. **Mobile Responsiveness**: Retained a select dropdown on the task cards as HTML5 drag-and-drop can be unstable on mobile touchscreen devices.
