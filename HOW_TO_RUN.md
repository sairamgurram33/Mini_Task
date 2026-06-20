# 🚀 Complete Guide to Run the Project in VS Code

## ✅ Prerequisites

Before starting, make sure you have:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **VS Code** installed

---

## 📂 Step 1: Open Project in VS Code

1. Open **VS Code**
2. Click **File** → **Open Folder**
3. Navigate to: `C:\Users\saira\OneDrive\Desktop\oh21\task`
4. Click **Select Folder**

---

## 🔧 Step 2: Open Integrated Terminal in VS Code

**Method 1**: Press **`Ctrl + ` `** (backtick key)

**Method 2**: Menu → **Terminal** → **New Terminal**

You should see a terminal at the bottom of VS Code.

---

## 🗄️ Step 3: Start the Backend Server

In the VS Code terminal, run these commands **one by one**:

```bash
cd backend
```

```bash
npm install
```

```bash
node server.js
```

✅ **You should see**:
```
✓ Database connected
✓ Server running on http://localhost:5000
```

⚠️ **Keep this terminal running!** Don't close it.

---

## 🎨 Step 4: Start the Frontend Server (New Terminal)

1. **Open a NEW terminal** in VS Code:
   - Click the **`+`** button in the terminal panel
   - Or press **`Ctrl + Shift + ` `**

2. In the **NEW terminal**, run these commands:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

✅ **You should see**:
```
VITE v4.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Note**: Vite might use port **5173** instead of 3000. That's fine!

---

## 🌐 Step 5: Open the Application

1. Look at your frontend terminal output
2. You'll see a URL like: **`http://localhost:5173`** (or 3000)
3. **Hold `Ctrl`** and **click the link** in VS Code terminal
4. Or manually open your browser and go to that URL

---

## 🎉 Step 6: Use the Application

### First Time? Register an Account:
1. You'll see the login page
2. Click **"Sign Up"** or **"Create Account"**
3. Enter:
   - **Username**: (your choice)
   - **Password**: (your choice)
4. Click **Register**

### Already Have Account? Login:
- **Username**: `testuser`
- **Password**: `password123`

---

## 📊 You Should Now See:

✅ **2 terminals running**:
- Terminal 1: Backend server (port 5000)
- Terminal 2: Frontend server (port 5173 or 3000)

✅ **Browser open** at `http://localhost:5173` (or 3000)

✅ **Dashboard** with premium design and animated task counter!

---

## 🛑 How to Stop the Servers

### Stop Frontend:
1. Click on the **frontend terminal**
2. Press **`Ctrl + C`**

### Stop Backend:
1. Click on the **backend terminal**
2. Press **`Ctrl + C`**

---

## 🔄 How to Restart Later

### Quick Restart (if dependencies already installed):

**Terminal 1 (Backend)**:
```bash
cd backend
node server.js
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

---

## 📋 Complete Command Reference

### Backend Commands
```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start server
node server.js

# Or use nodemon for auto-restart (if installed)
npm start
```

### Frontend Commands
```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 New Features You'll See

### ✨ Premium Task Counter
- Animated gradient border (shimmer effect)
- Pulsing number badges
- Slide-in animation
- **Location**: Dashboard page

### 🎯 Enhanced Filters
- Colorful filter buttons:
  - **Pending**: Orange
  - **In Progress**: Cyan
  - **Completed**: Green
- Hover effects with shadows

### 💎 Modern Task Cards
- Gradient borders
- Priority badges (Low/Medium/High)
- Status indicators
- Smooth animations

---

## ❓ Troubleshooting

### Port Already in Use?

**Backend (port 5000)**:
```bash
# Find and kill process
netstat -ano | findstr :5000
# Then kill it using Task Manager
```

**Frontend (port 5173)**:
```bash
# Find and kill process
netstat -ano | findstr :5173
# Or Vite will auto-select another port
```

### Can't See Changes?
1. **Hard refresh browser**: `Ctrl + Shift + R`
2. **Clear cache**: `Ctrl + Shift + Delete`
3. **Restart Vite**: `Ctrl + C` then `npm run dev`

### Database Issues?
```bash
# Backend will auto-create database.sqlite
# If issues, delete backend/database.sqlite and restart
```

### npm install fails?
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rmdir /s /q node_modules
npm install
```

---

## 🗂️ Project Structure
```
task/
├── backend/                 # Backend API
│   ├── server.js           # ⚡ Main entry point
│   ├── .env                # 🔐 Environment variables
│   ├── config/             # Database & JWT config
│   ├── controllers/        # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── database.sqlite     # SQLite database (auto-created)
│
├── frontend/               # Frontend React App
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   ├── index.css      # 🎨 Premium styles
│   │   ├── pages/         # Login, Dashboard, AddTask
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API calls
│   │   └── context/       # Auth context
│   ├── index.html         # HTML template
│   └── vite.config.js     # Vite configuration
│
└── *.md                    # Documentation files
```

---

## 🎯 Quick Test

After starting both servers:

1. ✅ Backend health check: http://localhost:5000
2. ✅ Frontend app: http://localhost:5173 (or port shown in terminal)
3. ✅ Register/Login
4. ✅ Create a task
5. ✅ See the animated task counter!

---

## 📞 Need Help?

Check these files:
- `README.md` - Main documentation
- `PROJECT_INDEX.md` - Complete project overview
- `TASK_COUNTER_UPDATE.md` - Latest feature details
- `QUICK_START.md` - Quick reference

---

## 🔑 Database Credentials

- **Password**: `Sairam@2005`
- **Type**: SQLite3
- **Location**: `backend/database.sqlite`

---

## 🌐 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 (or 3000) | ✅ Running |
| Backend API | http://localhost:5000 | ✅ Running |

---

**Happy Coding! 🚀**
