import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CreateProfile from "./pages/CreateProfile";
import SkillBoard from "./pages/SkillBoard";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      <Header />

      <div className="flex flex-1">
        {/* Sidebar always rendered when authenticated, visibility controlled by CSS */}
        {isAuthenticated && <Sidebar />}

        <main className="flex-1 flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />

              <Route
                path="/board"
                element={
                  <ProtectedRoute>
                    <SkillBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-profile"
                element={
                  <ProtectedRoute>
                    <CreateProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for 404 - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
