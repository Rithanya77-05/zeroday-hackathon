# CampusLink - Centralized Student Utility Hub

A comprehensive web application that streamlines essential student services within a college campus, improving communication, accessibility, and daily productivity for both students and administrators.

## 🚀 Features

### ✅ Core Features Implemented

1. **Campus Announcements Feed** 
   - ✅ Admin posts important updates (events, exams, holidays)
   - ✅ Students view announcements with category/date sorting
   - ✅ **Local Storage Integration** - All announcements stored locally
   - ✅ Full CRUD operations (Create, Read, Update, Delete)
   - ✅ Priority levels and expiry dates

2. **Lost & Found Section**
   - ✅ Backend API ready for item reporting/searching
   - ✅ Image upload support and location tracking
   - ✅ Smart filters by category and date

3. **Mini Timetable Scheduler**
   - ✅ Backend API for weekly schedule management
   - ✅ Calendar/grid format support
   - ✅ Edit/delete class options

4. **Hostel Complaint Registration**
   - ✅ Complaint filing system (water, electricity, cleaning, etc.)
   - ✅ Status tracking: pending, in-progress, resolved
   - ✅ Admin-controlled status updates

5. **User Authentication System**
   - ✅ Student and admin login/signup
   - ✅ Role-based access control
   - ✅ JWT-based secure session management

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Local Storage for announcements
- React Toastify for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)

### Installation & Setup

1. **Clone and navigate to project:**
```bash
cd CampusLink
```

2. **Install server dependencies:**
```bash
npm install
```

3. **Install client dependencies:**
```bash
cd client
npm install
cd ..
```

4. **Environment Setup:**
Update `.env` file with your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb://localhost:27017/campuslink
JWT_SECRET=your_jwt_secret_here
```

5. **Start the application:**
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Server
npm run server

# Terminal 2 - Client  
npm run client
```

6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Key Features Showcase

### 🔔 Announcements with Local Storage
- **Create**: Admins can create announcements with categories, priorities, and expiry dates
- **Read**: Students view filtered and sorted announcements
- **Update**: Admins can edit existing announcements
- **Delete**: Admins can remove announcements
- **Local Storage**: All announcements persist in browser storage
- **Real-time Filtering**: Search by title/content, filter by category/priority

### 👥 User Roles
- **Students**: View announcements, manage timetable, file complaints, use lost & found
- **Admins**: All student features + create/manage announcements, handle complaints

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time notifications
- Mobile-friendly layout

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (Admin)
- `PUT /api/announcements/:id` - Update announcement (Admin)
- `DELETE /api/announcements/:id` - Delete announcement (Admin)

### Lost & Found
- `GET /api/lost-found` - Get all items
- `POST /api/lost-found` - Report new item
- `PUT /api/lost-found/:id/claim` - Claim item

### Timetable
- `GET /api/timetable` - Get student timetable
- `POST /api/timetable` - Create/update timetable

### Complaints
- `GET /api/complaints` - Get complaints
- `POST /api/complaints` - File new complaint
- `PUT /api/complaints/:id/status` - Update status (Admin)

## 🎯 Demo Credentials

**Admin Account:**
- Email: admin@campus.edu
- Password: admin123

**Student Account:**
- Email: student@campus.edu  
- Password: student123

## 📂 Project Structure

```
CampusLink/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # File storage
│   └── server.js        # Express server
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   └── App.tsx      # Main app component
│   └── public/
├── package.json         # Server dependencies
└── README.md
```

## ✨ Special Features

1. **Local Storage Integration**: Announcements are automatically saved to browser local storage for offline access
2. **Real-time Updates**: Instant UI updates when creating/editing/deleting announcements
3. **Smart Filtering**: Advanced search and filter capabilities
4. **Role-based Access**: Different interfaces for students and admins
5. **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Getting Started Fast

Just run these commands:

```bash
cd CampusLink
npm install
cd client && npm install && cd ..
npm run dev
```

Then visit http://localhost:3000 and start using CampusLink!

---

**CampusLink** - Connecting Campus Life 🎓
