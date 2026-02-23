## SkillSwap – Peer-to-Peer Skills Exchange Platform

SkillSwap is a modern full-stack web application that enables users to exchange skills with one another. Users can teach what they know, learn what they need, and discover others based on shared interests.

The system is built using a **client-first architecture powered by Supabase**, eliminating the need for a traditional backend server while maintaining production-grade security and scalability.

---

🚀 **Tech Stack**

- **Frontend**
  - React (Vite)

  - Redux Toolkit

  - React Router

  - Supabase JS Client

- **Backend Infrastructure (Managed by Supabase)**
  - PostgreSQL Database

  - Supabase Auth (Email/Password)

  - Row Level Security (RLS)

  - SQL Functions (RPC)

  - Full-text search

  - Ready for Supabase Storage integration

---

🧠 **Architectural Philosophy**

SkillSwap is a **serverless full-stack application.**

The React frontend communicates directly with Supabase over HTTPS. There is no Node.js or Express server in between.

This design provides:

- Reduced operational complexity

- Built-in authentication and session management

- Secure database access via Row Level Security

- Strong data integrity through constraints and foreign keys

- Simplified deployment

All business rules are enforced at the database layer whenever possible.

---

🏗 **System Overview**

## 1. Authentication Layer

Supabase Auth handles:

- Email/password sign up

- Login sessions

- JWT-based access control

- Secure identity management

Each authenticated user automatically has a corresponding profile row in the database.

---

## 2. Database Schema

public.profiles

Represents application users.

| Column                | Description                    |
| --------------------- | ------------------------------ |
| `id`                  | UUID (references auth.users)   |
| `name`                | Display name                   |
| `email`               | Email address                  |
| `mobile`              | Optional contact               |
| `bio`                 | User description (≤ 500 chars) |
| `skills_to_teach`     | Array of skills user offers    |
| `skills_to_learn`     | Array of skills user wants     |
| `saved_skills`        | Bookmarked skill names         |
| `avatar_url`          | Optional profile image         |
| `is_profile_complete` | Boolean onboarding state       |
| `created_at`          | Timestamp                      |
| `updated_at`          | Timestamp                      |

Each user has exactly one profile (1:1 relationship with auth.users).

---

public.skills

Represents individual skill posts.

| Column          | Description               |
| --------------- | ------------------------- |
| `id`            | UUID                      |
| `title`         | Skill title               |
| `description`   | Description (≤ 500 chars) |
| `category`      | Skill category            |
| `skill_type`    | `'teach'` or `'learn'`    |
| `created_by`    | User ID                   |
| `creator_name`  | Snapshot of name          |
| `creator_email` | Snapshot of email         |
| `search_vector` | Full-text search column   |
| `created_at`    | Timestamp                 |
| `updated_at`    | Timestamp                 |

This allows flexible discovery and filtering.

---

🔐 **Security Model (RLS)**

Security is enforced directly in PostgreSQL using Row Level Security policies.

**Profiles**

- Users can read profiles (authenticated only)

- Users can insert their own profile

- Users can update/delete only their own profile

**Skills**

- Authenticated users can read skills

- Users can insert skills where created_by = auth.uid()

- Users can update/delete only their own skills

This ensures:

- No user can modify another user's data

- Frontend cannot bypass authorization rules

---

🔄 **Application Flow**

## 1. Sign Up

1.  User registers via email/password.

2.  Supabase creates an auth identity.

3.  A database trigger inserts a profile row.

4.  Client loads the profile and stores a normalized user object in Redux.

5.  If is_profile_complete is false → redirect to onboarding.

6.  Otherwise → redirect to skill board.

---

## 2. Sign In

1.  User logs in via signInWithPassword.

2.  Session is established.

3.  Profile is fetched.

4.  Redux is updated.

5.  User is redirected to the dashboard.

---

## 3. Profile Completion

Users complete:

- Name

- Bio

- Skills to teach

- Skills to learn

When submitted:

- Profile is updated

- `is_profile_complete` becomes true

- User gains access to full application features

---

📚 **Skills Discovery**

Users can:

- Create skill posts

- Browse all skills

- Filter by category

- Filter by skill type (teach/learn)

- Perform full-text search

- Bookmark skill names

---

🧩 **Database Functions (RPC)**

To keep business logic centralized and efficient, PostgreSQL functions are used.

`toggle_saved_skill(skill_name text)`

Toggles a skill name inside profiles.saved_skills for the current user.

`get_skill_categories()`

Returns all unique skills extracted from `skills_to_teach` and `skills_to_learn`.

`get_skills_overview(page int, page_size int)`

Aggregates:

- Teachers per skill

- Learners per skill

- Counts

- Pagination metadata

This enables a scalable skill marketplace view.

---

🗂 **Project Structure**

```
client/
└── src/
    ├── lib/
    │   └── supabaseClient.js
    ├── store/
    │   ├── authSlice.js
    │   ├── skillsSlice.js
    │   └── uiSlice.js
    ├── pages/
    │   ├── SignUp.jsx
    │   ├── SignIn.jsx
    │   ├── CreateProfile.jsx
    │   ├── Profile.jsx
    │   ├── SkillBoard.jsx
    │   └── Dashboard.jsx
    └── components/
        ├── ProtectedRoute.jsx
        ├── Header.jsx
        ├── Sidebar.jsx
        └── Skill components...
```

---

🖥 **Local Development**

1. Requirements

- Node.js (LTS)

- Supabase account

2. Environment Variables

Create client/.env:
  - VITE_SUPABASE_URL=your_project_url
  - VITE_SUPABASE_ANON_KEY=your_public_anon_key

Never expose the service role key in the frontend.

3. Run Locally

cd client
npm install
npm run dev

App runs at:

http://localhost:5173

---

🌍 **Production Deployment**

1. Apply supabase.sql once in Supabase SQL Editor.

2. Configure Auth settings and redirect URLs.

3. Build frontend:

npm run build

4. Deploy to Vercel, Netlify, or similar.

5. Add environment variables in hosting dashboard.

---

📈 **Scalability & Future Extensions**

SkillSwap is structured for growth.

Possible extensions:

- Admin roles via profiles.role

- Supabase Storage for avatar uploads

- Real-time messaging between users

- Matching algorithm for skill swaps

- Edge Functions for complex backend workflows

- Notification system

- Rate limiting and abuse protection

---

🛡 **Design Principles**

- Security first (RLS over client validation)

- Thin frontend, strong database layer

- Serverless infrastructure

- SQL for aggregation logic

- Explicit ownership constraints

- Minimal duplication of derived state

🎯 **Summary**

SkillSwap is a modern, secure, and scalable skills exchange platform built on:

- React for UI

- Redux Toolkit for state management

- Supabase for authentication and data

- PostgreSQL for relational integrity and aggregation

It demonstrates how a production-grade full-stack system can be built without maintaining a traditional backend server.
