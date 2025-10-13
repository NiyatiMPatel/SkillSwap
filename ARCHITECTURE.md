# 🏗️ SkillSwap Architecture

## Overview

SkillSwap follows a modern **MERN stack** architecture with clean separation of concerns.

## Tech Stack Decisions

### Why Redux Toolkit?
- ✅ Simplified Redux setup with createSlice
- ✅ Built-in async handling with createAsyncThunk
- ✅ Immutable state updates with Immer
- ✅ Redux DevTools integration
- ✅ Easy to extend for Phase 2 (messaging, notifications)

### Why Axios over Fetch?
- ✅ Request/response interceptors for auth tokens
- ✅ Automatic JSON transformation
- ✅ Better error handling
- ✅ Request cancellation support
- ✅ Progress tracking (future file uploads)

### Why Vite over Create React App?
- ✅ Lightning-fast HMR (Hot Module Replacement)
- ✅ Smaller bundle sizes
- ✅ Native ES modules
- ✅ Better dev experience
- ✅ Faster builds

## Frontend Architecture

### State Management Flow

```
User Action → Component
     ↓
Dispatch Redux Action (async thunk)
     ↓
Axios Client (with interceptors)
     ↓
Backend API
     ↓
Redux Reducer updates state
     ↓
Component re-renders
```

### Redux Store Structure

```javascript
{
  auth: {
    user: { id, name, email, ... },
    token: "jwt_token",
    isAuthenticated: true,
    loading: false,
    error: null
  },
  skills: {
    skills: [...],
    mySkills: [...],
    filters: { category, skillType, search },
    loading: false,
    error: null
  },
  ui: {
    isSidebarOpen: true,
    isModalOpen: false,
    theme: "light"
  }
}
```

### Component Hierarchy

```
App
├── Header (always visible)
├── Sidebar (authenticated only)
└── Routes
    ├── Public Routes
    │   ├── Welcome
    │   ├── About
    │   ├── SignUp
    │   └── SignIn
    └── Protected Routes
        ├── CreateProfile
        ├── SkillBoard
        ├── Dashboard
        └── Profile
```

### Axios Interceptor Flow

**Request Interceptor:**
```
Request → Add Auth Token → Send to Server
```

**Response Interceptor:**
```
Response → Check Status
    ├── 200-299: Success → Return data
    ├── 401: Unauthorized → Logout & Redirect
    └── 4xx/5xx: Error → Format error → Reject
```

## Backend Architecture

### API Layer Structure

```
server.js (Entry Point)
    ↓
Middleware (CORS, Helmet, Body Parser)
    ↓
Routes → Controllers → Models → Database
```

### Request Flow

```
Client Request
    ↓
Express Route
    ↓
Auth Middleware (if protected)
    ↓
Controller (business logic)
    ↓
Mongoose Model (data layer)
    ↓
MongoDB Atlas
    ↓
Response back to client
```

### Database Schema

**User Model:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  mobile: String (unique),
  password: String (hashed),
  bio: String,
  skillsToTeach: [String],
  skillsToLearn: [String],
  isProfileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Skill Model:**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  skillType: "teach" | "learn",
  createdBy: ObjectId (ref: User),
  userName: String,
  userEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

### Sign Up
```
1. User fills sign-up form
2. Frontend validates input
3. POST /api/auth/signup
4. Backend checks for duplicate user
5. Hash password with bcrypt
6. Create user in MongoDB
7. Generate JWT token
8. Return token + user data
9. Frontend stores in localStorage & Redux
10. Redirect to Create Profile
```

### Sign In
```
1. User fills sign-in form
2. Frontend validates input
3. POST /api/auth/signin
4. Backend finds user by email/mobile
5. Compare password with bcrypt
6. Generate JWT token
7. Return token + user data
8. Frontend stores in localStorage & Redux
9. Redirect to Skill Board
```

### Protected Routes
```
1. User requests protected resource
2. Axios interceptor adds token to header
3. Backend auth middleware verifies token
4. If valid: Continue → If invalid: 401
5. Frontend interceptor catches 401
6. Logout user & redirect to sign-in
```

## Security Measures

### Backend
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token with expiration
- ✅ Auth middleware on protected routes
- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ MongoDB injection prevention (Mongoose)

### Frontend
- ✅ Token stored in localStorage (HTTP-only cookies for production)
- ✅ Auto-logout on 401
- ✅ Protected routes with React Router
- ✅ Input validation before API calls
- ✅ XSS prevention via React's built-in escaping

## Performance Optimizations

### Frontend
- Code splitting with React.lazy (future)
- Memoization with useMemo/useCallback (where needed)
- Debounced search input
- Optimized Redux selectors
- Tailwind CSS purging in production

### Backend
- MongoDB indexes on frequently queried fields
- Lean queries for better performance
- Pagination support (ready to add)
- Connection pooling

## Scalability Considerations

### Current MVP
- Single server instance
- Stateless JWT auth
- Direct MongoDB connection

### Future Scaling (Phase 2+)
- Load balancing with multiple server instances
- Redis for session management & caching
- CDN for static assets
- Database read replicas
- WebSocket server for real-time messaging
- Message queue (RabbitMQ/Redis) for async tasks

## Error Handling Strategy

### Frontend
1. Form validation errors → Show inline
2. API errors → Toast notifications
3. Network errors → Retry mechanism
4. Global errors → Error boundary (future)

### Backend
1. Validation errors → 400 with message
2. Auth errors → 401 with message
3. Not found → 404 with message
4. Server errors → 500 with generic message
5. All errors logged to console

## Testing Strategy (Future)

### Frontend
- Unit tests: Components with React Testing Library
- Integration tests: Redux actions/reducers
- E2E tests: Critical user flows with Cypress

### Backend
- Unit tests: Controllers and utilities with Jest
- Integration tests: API endpoints with Supertest
- Database tests: Mock MongoDB with mongodb-memory-server

## Deployment Architecture

```
Frontend (Netlify)
    ↓ HTTPS
API Gateway
    ↓
Backend (Render/Railway)
    ↓
MongoDB Atlas
```

## Phase 2 Extensions

### Messaging System
```
New Redux Slice: messaging
New Backend: WebSocket server
New Model: Message
New Components: Chat UI
```

### Scheduling System
```
New Redux Slice: scheduling
New Backend Routes: /api/sessions
New Model: Session
Integration: Calendar API
```

---

**This architecture provides a solid foundation for the MVP while remaining flexible for future enhancements.**
