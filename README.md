# TaskFlow Pro - Modern Task Management Portal

A cutting-edge full-stack task management application built with **React 18** (frontend) and **Node.js + Express** (backend), featuring a modern UI/UX design, enhanced animations, and robust database architecture.

---

## ✨ Features

### Core Functionality
- ✅ **Authentication System** - Secure JWT-based user registration and login
- ✅ **Task Management** - Create, update, delete, and organize tasks
- ✅ **Advanced Filtering** - Filter by status, search by keywords, sort by date
- ✅ **Real-time Statistics** - Interactive dashboard with completion rates and progress tracking
- ✅ **Priority System** - Assign Low, Medium, or High priority to tasks
- ✅ **Due Date Management** - Set and track task deadlines

### Modern UI/UX
- ✅ **Glassmorphism Design** - Beautiful backdrop-blur effects and transparency
- ✅ **Smooth Animations** - Powered by Framer Motion for fluid interactions
- ✅ **Dark Mode Support** - Persistent theme switching with elegant transitions
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ✅ **Interactive Components** - Hover effects, loading states, and micro-interactions
- ✅ **Toast Notifications** - Real-time feedback with React Hot Toast

### Enhanced User Experience
- 🎨 **Modern Color Palette** - Carefully selected gradients and color schemes
- 📱 **Progressive Enhancement** - Works seamlessly across all screen sizes
- 🔄 **Loading States** - Skeleton screens and smooth loading animations
- 💫 **Micro-interactions** - Delightful hover effects and button animations
- 🎯 **Intuitive Navigation** - Clean, modern navigation with active states

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Framer Motion, React Router, React Icons, React Hot Toast |
| **Backend** | Node.js, Express, JWT Authentication, bcryptjs |
| **Database** | SQLite3 (with MySQL-like interface for easy migration) |
| **Styling** | Modern CSS with CSS Custom Properties, Glassmorphism, Gradients |
| **Development** | Hot Module Replacement, ESLint, Modern JavaScript |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### 1. Clone & Setup

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs on **http://localhost:5000**  
The SQLite database is automatically created on first run with proper schema.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:3000**

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK(length(title) <= 100),
  description TEXT NOT NULL CHECK(length(description) >= 20),
  status TEXT NOT NULL CHECK(status IN ('Pending', 'In Progress', 'Completed')),
  priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
  due_date DATE NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔌 API Documentation

Base URL: `http://localhost:5000`

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | `{ name, email, password }` |
| POST | `/auth/login` | User login | `{ email, password }` |
| GET | `/auth/me` | Get current user | - |

### Task Endpoints

| Method | Endpoint | Description | Body | Query Params |
|--------|----------|-------------|------|-------------|
| GET | `/tasks` | Get user tasks | - | `status`, `search`, `sort`, `page`, `limit` |
| GET | `/tasks/stats` | Get dashboard stats | - | - |
| POST | `/tasks` | Create new task | `{ title, description, status, priority?, dueDate? }` | - |
| PUT | `/tasks/:id` | Update task status | `{ status }` | - |
| DELETE | `/tasks/:id` | Delete task | - | - |

### Example Requests

#### Create a Task
```json
POST /tasks
Authorization: Bearer <jwt_token>
{
  "title": "Build Authentication System",
  "description": "Implement JWT-based authentication with secure password hashing and user registration/login flows",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2024-02-15"
}
```

#### Filter Tasks
```bash
GET /tasks?status=In Progress&search=auth&sort=desc&page=1&limit=6
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo to Purple gradient (`#6366f1` → `#7c3aed`)
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Error**: Red (`#ef4444`)
- **Info**: Blue (`#3b82f6`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Scale**: xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px)

### Spacing
- **Scale**: 0.25rem increments from 1 (4px) to 32 (128px)
- **Consistent**: All components use the spacing scale

### Animations
- **Fast**: 150ms ease-out (micro-interactions)
- **Normal**: 300ms ease-out (standard transitions)
- **Slow**: 500ms ease-out (page transitions)

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=task_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend Configuration (vite.config.js)

The frontend is configured with Vite for optimal development experience:
- Hot Module Replacement (HMR)
- Automatic proxy to backend API
- Optimized build process

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1400px

---

## 🎯 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Responsive images with lazy loading
- **Caching**: Efficient caching strategies for static assets
- **Bundle Analysis**: Optimized bundle size

---

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use process manager (PM2) for production
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to CDN or static hosting
3. Configure routing for SPA

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Sanitized outputs
- **CORS Configuration**: Proper cross-origin resource sharing

---

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests (when available)
cd frontend && npm test
```

---

## 📈 Future Enhancements

- [ ] **Real-time Collaboration** - WebSocket integration
- [ ] **File Attachments** - Upload and manage task files
- [ ] **Team Management** - Multi-user workspaces
- [ ] **Calendar Integration** - Sync with external calendars
- [ ] **Mobile Apps** - React Native companion apps
- [ ] **Advanced Analytics** - Productivity insights and reporting
- [ ] **Notifications** - Email and push notifications
- [ ] **Third-party Integrations** - Slack, Trello, GitHub integration

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the API documentation for integration help

---

*Built with ❤️ using modern web technologies*
