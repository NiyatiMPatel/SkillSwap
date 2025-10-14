import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, GraduationCap, BookOpen, Star, Clock, MessageCircle } from 'lucide-react';
import { toggleSavedSkillAsync, requestSession, connectWithUser } from '../store/slices/skillsSlice';
import { openModal } from '../store/slices/uiSlice';

/**
 * Enhanced SkillOverviewCard Component
 * - Displays a skill with teacher and learner information
 * - Interactive buttons: Save, Request Session, Connect
 * - Mini avatar carousel with tooltips
 * - Hover animations
 * - Used in SkillBoard overview section
 */
const SkillOverviewCard = ({ skill }) => {
  const dispatch = useDispatch();
  const { savedSkills } = useSelector((state) => state.skills);
  const { name, teachers, learners, teachersCount, learnersCount } = skill;
  
  const [hoveredUser, setHoveredUser] = useState(null);
  const isSaved = savedSkills.includes(name);
  
  const handleSaveSkill = (e) => {
    e.stopPropagation();
    dispatch(toggleSavedSkillAsync(name));
  };
  
  const handleRequestSession = (e) => {
    e.stopPropagation();
    dispatch(requestSession({ skillName: name }));
  };
  
  const handleConnect = (userId, e) => {
    e.stopPropagation();
    dispatch(connectWithUser({ userId }));
  };
  
  const handleCardClick = () => {
    dispatch(openModal({ type: 'skillDetail', data: skill }));
  };
  
  // Get first 3 participants for avatar display
  const displayTeachers = teachers.slice(0, 3);
  const displayLearners = learners.slice(0, 3);
  const moreTeachers = teachersCount > 3 ? teachersCount - 3 : 0;
  const moreLearners = learnersCount > 3 ? learnersCount - 3 : 0;

  return (
    <div 
      onClick={handleCardClick}
      className="card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl rounded-2xl"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name} skill`}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Header: Skill Name + Total Participants */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{name}</h3>
        <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          <Users className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {teachersCount + learnersCount}
          </span>
        </div>
      </div>

      {/* Teachers Section with Avatar Carousel */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-full">
              <GraduationCap className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {teachersCount} {teachersCount === 1 ? 'Teacher' : 'Teachers'}
            </span>
          </div>
        </div>
        {teachers.length > 0 ? (
          <div className="flex items-center gap-2 ml-8">
            {displayTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="relative group"
                onMouseEnter={() => setHoveredUser(`teacher-${teacher.id}`)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-white shadow-sm">
                  {teacher.name.charAt(0).toUpperCase()}
                </div>
                {/* Tooltip */}
                {hoveredUser === `teacher-${teacher.id}` && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                    <div className="font-semibold">{teacher.name}</div>
                    <div className="text-gray-300 text-xs">🧑‍🏫 Teacher</div>
                  </div>
                )}
              </div>
            ))}
            {moreTeachers > 0 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                +{moreTeachers}
              </div>
            )}
          </div>
        ) : (
          <p className="ml-8 text-sm text-gray-400 italic">No teachers yet</p>
        )}
      </div>

      {/* Learners Section with Avatar Carousel */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {learnersCount} {learnersCount === 1 ? 'Learner' : 'Learners'}
            </span>
          </div>
        </div>
        {learners.length > 0 ? (
          <div className="flex items-center gap-2 ml-8">
            {displayLearners.map((learner) => (
              <div
                key={learner.id}
                className="relative group"
                onMouseEnter={() => setHoveredUser(`learner-${learner.id}`)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-white shadow-sm">
                  {learner.name.charAt(0).toUpperCase()}
                </div>
                {/* Tooltip */}
                {hoveredUser === `learner-${learner.id}` && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                    <div className="font-semibold">{learner.name}</div>
                    <div className="text-gray-300 text-xs">🎓 Learner</div>
                  </div>
                )}
              </div>
            ))}
            {moreLearners > 0 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                +{moreLearners}
              </div>
            )}
          </div>
        ) : (
          <p className="ml-8 text-sm text-gray-400 italic">No learners yet</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleSaveSkill}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save skill'}
        >
          <Star className={`w-4 h-4 ${isSaved ? 'fill-yellow-500' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={handleRequestSession}
          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all duration-200 flex items-center justify-center gap-2"
          aria-label="Request session"
        >
          <Clock className="w-4 h-4" />
          Request
        </button>
      </div>

      {/* Popular Badge */}
      {teachersCount + learnersCount >= 5 && (
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-red-100 text-orange-700">
            🔥 Popular Skill
          </span>
        </div>
      )}
    </div>
  );
};

export default SkillOverviewCard;
