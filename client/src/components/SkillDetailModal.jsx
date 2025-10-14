import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  GraduationCap,
  BookOpen,
  MessageCircle,
  Users as UsersIcon,
} from "lucide-react";
import { closeModal } from "../store/slices/uiSlice";
import { connectWithUser } from "../store/slices/skillsSlice";

/**
 * SkillDetailModal Component
 * - Shows detailed information about a skill
 * - Displays all teachers and learners
 * - Provides connect and message options (Phase 2 placeholders)
 * - Closable via overlay, X button, or ESC key
 * - Smooth open and close animations
 */
const SkillDetailModal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, modalContent } = useSelector((state) => state.ui);

  // Handle ESC key press - hook must be called before any conditional returns
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        dispatch(closeModal());
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch, isModalOpen]);

  // Prevent body scroll when modal is open - hook must be called before any conditional returns
  useEffect(() => {
    if (!isModalOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Early return AFTER all hooks
  if (!isModalOpen || modalContent?.type !== "skillDetail") {
    return null;
  }

  const skill = modalContent.data;
  const { name, teachers, learners, teachersCount, learnersCount } = skill;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };

  const handleConnect = (userId) => {
    dispatch(connectWithUser({ userId }));
  };

  const handleMessage = (userId) => {
    // TODO Phase 2: Open messaging interface
    console.log("Message user:", userId);
  };

  const handleRequestSwap = () => {
    // TODO Phase 2: Request skill swap
    console.log("Request skill swap for:", name);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-detail-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2
              id="skill-detail-title"
              className="text-2xl font-bold text-gray-900"
            >
              {name}
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                <span>{teachersCount + learnersCount} participants</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Teachers</span>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {teachersCount}
                </p>
              </div>
              <div className="card p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Learners</span>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {learnersCount}
                </p>
              </div>
            </div>
          </div>

          {/* Teachers List */}
          {teachers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                </div>
                Available Teachers
              </h3>
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="card p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {teacher.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMessage(teacher.id)}
                          className="px-3 py-2 text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors flex items-center gap-2"
                          aria-label={`Message ${teacher.name}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                        <button
                          onClick={() => handleConnect(teacher.id)}
                          className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                          aria-label={`Connect with ${teacher.name}`}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learners List */}
          {learners.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                People Learning
              </h3>
              <div className="space-y-3">
                {learners.map((learner) => (
                  <div
                    key={learner.id}
                    className="card p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                          {learner.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {learner.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {learner.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMessage(learner.id)}
                          className="px-3 py-2 text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors flex items-center gap-2"
                          aria-label={`Message ${learner.name}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                        <button
                          onClick={() => handleConnect(learner.id)}
                          className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                          aria-label={`Connect with ${learner.name}`}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleRequestSwap}
              className="w-full btn-primary py-3 text-base"
            >
              Request Skill Swap
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              💡 Messaging and skill swap features coming in Phase 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;
