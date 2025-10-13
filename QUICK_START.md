# 🚀 Quick Start Guide

Get SkillSwap up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Step 2: Set Up Environment Variables

### Server (.env)
Create `server/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (.env)
Create `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and database name in your server `.env`
7. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for development)

## Step 4: Run the Application

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
✅ Server running at http://localhost:5000

**Terminal 2 - Frontend App:**
```bash
cd client
npm run dev
```
✅ App running at http://localhost:5173

## Step 5: Test the App

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" to create an account
3. Complete your profile
4. Browse the Skill Board
5. Add your first skill!

## 🔍 Verify Everything Works

### Test Backend Health
Open http://localhost:5000/api/health in browser
Should see: `{"status":"ok","message":"SkillSwap API is running"}`

### Check Redux DevTools
1. Install Redux DevTools browser extension
2. Open browser DevTools → Redux tab
3. See auth, skills, and UI state

## 🛠️ Development Commands

### Backend
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start in production mode

### Frontend
- `npm run dev` - Start dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Sample User Flow

1. **Sign Up** → Enter name, email, password
2. **Create Profile** → Add skills to teach/learn
3. **Skill Board** → Browse all skills
4. **Add Skill** → Post a new skill
5. **Dashboard** → View your profile and skills

## ⚠️ Common Issues

**MongoDB Connection Failed**
- Check connection string in server `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has read/write permissions

**Port 5000 Already in Use**
- Change PORT in server `.env` to 5001
- Update VITE_API_URL in client `.env` accordingly

**CORS Errors**
- Verify CLIENT_URL in server `.env` = http://localhost:5173
- Check VITE_API_URL in client `.env` = http://localhost:5000/api

## 🎉 You're Ready!

Start building and exchanging skills! 

For detailed documentation, see [README.md](./README.md)
