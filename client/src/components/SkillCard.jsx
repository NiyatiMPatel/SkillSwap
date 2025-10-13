import { User, Mail, Tag, Calendar } from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

/**
 * SkillCard Component
 * - Displays a single skill with title, description, and user info
 * - Shows skill type badge (teach/learn)
 * - Shows category tag
 */
const SkillCard = ({ skill, onClick }) => {
  const skillTypeBadge = skill.skillType === 'teach' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-blue-100 text-blue-700';

  return (
    <div
      className="card p-6 cursor-pointer"
      onClick={onClick}
    >
      {/* Header with title and badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {skill.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${skillTypeBadge}`}>
          {skill.skillType === 'teach' ? 'Teaching' : 'Learning'}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {skill.description}
      </p>

      {/* Category */}
      {skill.category && (
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">
            {skill.category}
          </span>
        </div>
      )}

      {/* User info */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {skill.userName}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {skill.userEmail}
            </span>
          </div>
        </div>

        {/* Timestamp */}
        {skill.createdAt && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(skill.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
