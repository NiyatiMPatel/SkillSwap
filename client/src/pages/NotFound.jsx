import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Search, ArrowLeft } from "lucide-react";

/**
 * NotFound (404) Page
 * - Displayed when user navigates to an unknown route
 * - Shows different navigation options based on auth status
 * - If authenticated: redirects to SkillBoard
 * - If not authenticated: redirects to Home
 */
const NotFound = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-[180px] font-bold text-gray-200 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-24 h-24 text-gray-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              {/* Authenticated User - Go to SkillBoard */}
              <Link
                to="/board"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              >
                <Home className="w-5 h-5" />
                Go to Skill Board
              </Link>
              <Link
                to="/dashboard"
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </>
          ) : (
            <>
              {/* Guest User - Go to Home */}
              <Link
                to="/"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Link>
              <Link
                to="/signin"
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Lost? Here are some helpful links:
          </p>
          <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/about"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              About
            </Link>
            {isAuthenticated && (
              <>
                <span className="text-gray-300">•</span>
                <Link
                  to="/board"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Skill Board
                </Link>
                <span className="text-gray-300">•</span>
                <Link
                  to="/profile"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
