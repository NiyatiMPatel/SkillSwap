import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySkills } from "../store/slices/skillsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import SkillCard from "../components/SkillCard";
import EmptyState from "../components/EmptyState";
import { BarChart3, Users, MessageSquare, TrendingUp, Star } from "lucide-react";

/**
 * Dashboard Page
 * - User profile summary
 * - Quick stats
 * - User's skills
 * - Quick navigation
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mySkills, savedSkills, loading } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchMySkills());
  }, [dispatch]);

  const stats = [
    {
      label: "My Skills",
      value: mySkills.length,
      icon: BarChart3,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Skills to Teach",
      value: user?.skillsToTeach?.length || 0,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Skills to Learn",
      value: user?.skillsToLearn?.length || 0,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Saved Skills",
      value: savedSkills.length,
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Messages",
      value: 0, // TODO Phase 2: Connect with messaging
      icon: MessageSquare,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your SkillSwap activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Profile Summary */}
        <div className="card p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Summary
            </h2>
            <Link
              to="/profile"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Edit Profile
            </Link>
          </div>

          <div className="space-y-4">
            {user?.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Skills I Can Teach
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.skillsToTeach && user.skillsToTeach.length > 0 ? (
                    user.skillsToTeach.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Skills I Want to Learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.skillsToLearn && user.skillsToLearn.length > 0 ? (
                    user.skillsToLearn.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 Placeholder */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Coming Soon: Messaging & Scheduling
          </h3>
          <p className="text-primary-700 text-sm">
            Soon you'll be able to message other users directly, schedule skill
            exchange sessions, and track your learning progress. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
