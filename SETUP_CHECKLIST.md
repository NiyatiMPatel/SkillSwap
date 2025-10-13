# ✅ SkillSwap MVP - Setup Checklist

Use this checklist to get your SkillSwap application running.

## 📋 Pre-Setup Requirements

- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn installed
- [ ] MongoDB Atlas account created
- [ ] Code editor (VS Code recommended)
- [ ] Git installed (optional)

## 🗄️ MongoDB Atlas Setup

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create a free account
- [ ] Create a new cluster (Free tier M0)
- [ ] Wait for cluster to be created (~5 minutes)
- [ ] Click "Connect" button
- [ ] Add IP Address: Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
- [ ] Create Database User:
  - Username: `skillswap_user`
  - Password: (generate strong password)
  - Save credentials securely
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<username>` and `<password>` in connection string

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```
- [ ] All dependencies installed successfully
- [ ] No error messages

### 2. Environment Configuration
- [ ] Copy `server/.env.example` to `server/.env`
- [ ] Open `server/.env` in editor
- [ ] Update the following:
  ```env
  PORT=5000
  NODE_ENV=development
  MONGODB_URI=<your_mongodb_connection_string>
  JWT_SECRET=<generate_random_32_char_string>
  JWT_EXPIRES_IN=7d
  CLIENT_URL=http://localhost:5173
  ```
- [ ] Save the file

### 3. Generate JWT Secret
Use one of these methods:
```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Online tool
# Visit: https://www.grc.com/passwords.htm
```
- [ ] JWT_SECRET generated and added to .env

### 4. Test Backend Connection
```bash
cd server
npm run dev
```
Expected output:
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
```
- [ ] Server started without errors
- [ ] MongoDB connection successful
- [ ] Server running on http://localhost:5000

### 5. Test API Health Endpoint
- [ ] Open browser: http://localhost:5000/api/health
- [ ] Should see: `{"status":"ok","message":"SkillSwap API is running"}`

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd client
npm install
```
- [ ] All dependencies installed successfully
- [ ] No error messages

### 2. Environment Configuration
- [ ] Copy `client/.env.example` to `client/.env`
- [ ] Open `client/.env` in editor
- [ ] Verify contents:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
- [ ] Save the file

### 3. Test Frontend Dev Server
```bash
cd client
npm run dev
```
Expected output:
```
VITE vX.X.X  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```
- [ ] Dev server started without errors
- [ ] Server running on http://localhost:5173

### 4. Open Application in Browser
- [ ] Navigate to http://localhost:5173
- [ ] SkillSwap welcome page loads
- [ ] No console errors in browser DevTools

## 🧪 Functional Testing

### Test 1: Sign Up Flow
- [ ] Click "Sign Up" button
- [ ] Fill in the form:
  - Name: Test User
  - Email: test@example.com
  - Password: test123456
  - Confirm Password: test123456
- [ ] Click "Sign Up"
- [ ] Success toast appears
- [ ] Redirected to "Create Profile" page

### Test 2: Profile Creation
- [ ] Add name: Test User
- [ ] Add bio: "I'm testing SkillSwap!"
- [ ] Add skill to teach: "JavaScript"
- [ ] Add skill to learn: "Python"
- [ ] Click "Complete Profile"
- [ ] Success toast appears
- [ ] Redirected to Skill Board

### Test 3: Skill Board
- [ ] Skill Board page loads
- [ ] Empty state or existing skills display
- [ ] Click "Add Skill" button
- [ ] Fill in skill form:
  - Title: "React.js Fundamentals"
  - Description: "I can teach React basics and hooks"
  - Category: Technology
  - Type: Teach this skill
- [ ] Click "Add Skill"
- [ ] New skill appears on board
- [ ] Success toast appears

### Test 4: Filtering
- [ ] Use search box - type "React"
- [ ] Skills filter correctly
- [ ] Select category filter
- [ ] Skills filter by category
- [ ] Select skill type filter (Teach/Learn)
- [ ] Skills filter by type
- [ ] Click "Clear" button
- [ ] All filters reset

### Test 5: Dashboard
- [ ] Click "Dashboard" in sidebar
- [ ] Dashboard loads with stats
- [ ] Profile summary displays
- [ ] Posted skills display
- [ ] All data is correct

### Test 6: Profile Editing
- [ ] Click "Profile" in sidebar
- [ ] Profile page loads with existing data
- [ ] Edit bio
- [ ] Add new skill to teach
- [ ] Remove a skill to learn
- [ ] Click "Save Changes"
- [ ] Success toast appears
- [ ] Changes persist

### Test 7: Sign Out
- [ ] Click "Sign Out" button
- [ ] Success toast appears
- [ ] Redirected to Welcome page
- [ ] Auth state cleared

### Test 8: Sign In
- [ ] Click "Sign In" button
- [ ] Enter credentials:
  - Email: test@example.com
  - Password: test123456
- [ ] Click "Sign In"
- [ ] Success toast appears
- [ ] Redirected to Skill Board
- [ ] Previous data still there

### Test 9: Protected Routes
- [ ] Sign out if signed in
- [ ] Try to visit: http://localhost:5173/dashboard
- [ ] Should redirect to sign-in page
- [ ] After signing in, redirected back to dashboard

## 🔍 Redux DevTools Testing

- [ ] Install Redux DevTools browser extension
- [ ] Open browser DevTools (F12)
- [ ] Navigate to "Redux" tab
- [ ] See three slices: auth, skills, ui
- [ ] Perform an action (e.g., sign in)
- [ ] See action logged in Redux DevTools
- [ ] See state update in real-time

## 📱 Responsive Design Testing

### Mobile View (320px - 767px)
- [ ] Open DevTools → Toggle device toolbar
- [ ] Select iPhone or Android device
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Cards stack vertically
- [ ] All buttons are tappable

### Tablet View (768px - 1023px)
- [ ] Select iPad or tablet device
- [ ] Layout adjusts properly
- [ ] Sidebar behavior correct
- [ ] 2-column grid works

### Desktop View (1024px+)
- [ ] Full desktop view
- [ ] Sidebar persistent
- [ ] 3-column grid on skill board
- [ ] All features accessible

## 🔐 Security Testing

- [ ] Passwords are not visible in Redux DevTools
- [ ] JWT token stored in localStorage
- [ ] Protected API endpoints return 401 without token
- [ ] Cannot access other users' data
- [ ] Sign out clears all sensitive data

## ⚠️ Common Issues Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
- [ ] Verify connection string in server/.env
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Ensure database user credentials are correct
- [ ] Check if MongoDB cluster is running

### Issue: Port Already in Use
**Solution:**
- [ ] Change PORT in server/.env to 5001
- [ ] Update VITE_API_URL in client/.env
- [ ] Or kill process: `npx kill-port 5000`

### Issue: CORS Errors
**Solution:**
- [ ] Verify CLIENT_URL in server/.env = http://localhost:5173
- [ ] Verify VITE_API_URL in client/.env = http://localhost:5000/api
- [ ] Restart both servers

### Issue: Redux State Not Persisting
**Solution:**
- [ ] Check browser localStorage (DevTools → Application → Local Storage)
- [ ] Clear cache and hard reload
- [ ] Check for console errors

### Issue: 401 Errors After Some Time
**Expected behavior:**
- [ ] JWT token expires after 7 days (default)
- [ ] User should sign in again
- [ ] Auto-redirects to sign-in page

## ✅ Final Verification

- [ ] Backend server running without errors
- [ ] Frontend dev server running without errors
- [ ] All test flows completed successfully
- [ ] No console errors in browser
- [ ] Redux DevTools working
- [ ] Responsive design working
- [ ] Data persists across page refreshes

## 🎉 Success!

If all checkboxes are checked, your SkillSwap MVP is fully operational!

## 📚 Next Steps

1. **Explore the code:**
   - Read through components
   - Understand Redux flow
   - Study API endpoints

2. **Customize:**
   - Update colors in tailwind.config.js
   - Add your own logo
   - Modify welcome page content

3. **Deploy** (Optional):
   - Frontend → Netlify
   - Backend → Render/Railway
   - See deployment section in README.md

4. **Extend** (Phase 2):
   - Add messaging feature
   - Implement scheduling
   - Add user avatars
   - See ARCHITECTURE.md for extension points

## 📞 Need Help?

- Check README.md for detailed documentation
- See QUICK_START.md for setup guide
- Review ARCHITECTURE.md for technical details
- Check PROJECT_SUMMARY.md for feature overview

---

**Happy Coding! 🚀**
