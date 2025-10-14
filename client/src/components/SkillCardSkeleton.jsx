/**
 * SkillCardSkeleton Component
 * Loading placeholder for skill cards
 */
const SkillCardSkeleton = () => {
  return (
    <div className="card p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Avatars */}
      <div className="flex gap-2 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  );
};

export default SkillCardSkeleton;
