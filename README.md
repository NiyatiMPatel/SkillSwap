# 🎓 SkillSwap MVP

A peer-to-peer web application where users exchange skills (e.g., "I'll teach you React.js if you teach me guitar").

## 📋 Features

- **User Authentication**: Sign up and sign in with email or mobile number
- **Profile Management**: Create and update profiles with skills to teach and learn
- **Skill Board**: Browse, search, and filter available skills
- **Responsive Design**: Modern, mobile-friendly UI with Tailwind CSS
- **Real-time State Management**: Redux Toolkit with persistent auth
- **Secure API**: JWT-based authentication with protected routes

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## 📁 Project Structure

```
SkillSwap/
├── client/                 # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── api/           # Axios client & API calls
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store & slices
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env.example       # Environment variables template
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                # Backend Express API
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & error middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   └── server.js         # Entry point
│
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd "C:\Users\NIYATI PATEL\Documents\Vibe Coding\SkillSwap"
   ```

2. **Set up the Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Backend Environment**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_key
     JWT_EXPIRES_IN=7d
     CLIENT_URL=http://localhost:5173
     ```

4. **Set up the Frontend**
   ```bash
   cd ../client
   npm install
   ```

5. **Configure Frontend Environment**
   - Copy `.env.example` to `.env`
   - Update the API URL:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Dev Server** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   App will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Authenticate user
- `GET /me` - Get current user (protected)

### User Routes (`/api/users`)
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Skill Routes (`/api/skills`)
- `GET /` - Get all skills (with filters)
- `GET /:id` - Get single skill
- `POST /` - Create skill (protected)
- `PUT /:id` - Update skill (protected)
- `DELETE /:id` - Delete skill (protected)
- `GET /user/my-skills` - Get current user's skills (protected)

## 🔍 Redux DevTools

The app is configured with Redux DevTools in development mode. 

**To inspect state:**
1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Navigate to Redux tab
4. View state, actions, and time-travel debugging

## 🎨 Design System

### Colors
- **Primary**: Blue tones (#0ea5e9)
- **Success**: Green tones
- **Warning**: Yellow/Orange tones
- **Error**: Red tones

### Components
- Buttons: `btn-primary`, `btn-secondary`, `btn-ghost`
- Inputs: `input-field`
- Cards: `card`

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Request/response interceptors for token management
- Auto-logout on 401 errors
- Input validation on client and server
- CORS configuration
- Helmet security headers

## 📱 Responsive Design

The app is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚧 Future Enhancements (Phase 2)

- [ ] Direct messaging between users
- [ ] Session scheduling and calendar integration
- [ ] Skill ratings and reviews
- [ ] User avatars and profile pictures
- [ ] Skill categories with icons
- [ ] Advanced search and recommendations
- [ ] Email notifications
- [ ] Social media integration
- [ ] Video call integration

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure your MongoDB Atlas IP whitelist includes your current IP
- Verify connection string is correct in `.env`
- Check if MongoDB service is running

**Port Already in Use**
- Change PORT in server `.env` file
- Kill process using the port: `npx kill-port 5000`

**CORS Errors**
- Verify CLIENT_URL in server `.env` matches your frontend URL
- Check VITE_API_URL in client `.env`

**Redux State Not Persisting**
- Check browser localStorage
- Clear cache and restart

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👥 Contributing

This is an MVP project. Contributions, issues, and feature requests are welcome!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using React, Redux Toolkit, Express, and MongoDB**
