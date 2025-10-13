import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSkills, setFilters, clearFilters, createSkill } from '../store/slices/skillsSlice';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search, Filter, Plus, X } from 'lucide-react';

/**
 * Skill Board Page
 * - Displays all available skills
 * - Filter by category and skill type
 * - Search functionality
 * - Create new skill (authenticated users)
 */
const SkillBoard = () => {
  const dispatch = useDispatch();
  const { skills, filters, loading } = useSelector((state) => state.skills);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    title: '',
    description: '',
    category: 'General',
    skillType: 'teach',
  });

  useEffect(() => {
    dispatch(fetchSkills(filters));
  }, [dispatch, filters]);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    
    if (!newSkill.title.trim() || !newSkill.description.trim()) {
      return;
    }

    const result = await dispatch(createSkill(newSkill));
    
    if (createSkill.fulfilled.match(result)) {
      setShowCreateModal(false);
      setNewSkill({
        title: '',
        description: '',
        category: 'General',
        skillType: 'teach',
      });
      dispatch(fetchSkills(filters));
    }
  };

  const categories = ['all', 'Technology', 'Arts', 'Music', 'Languages', 'Sports', 'Cooking', 'General'];

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skill Board</h1>
            <p className="text-gray-600 mt-1">
              Discover skills to learn and opportunities to teach
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Skill
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category filter */}
            <div className="sm:w-48">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill type filter */}
            <div className="sm:w-48">
              <select
                value={filters.skillType}
                onChange={(e) => handleFilterChange('skillType', e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="teach">Teaching</option>
                <option value="learn">Learning</option>
              </select>
            </div>

            {/* Clear filters */}
            {(filters.search || filters.category !== 'all' || filters.skillType !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="btn-ghost flex items-center gap-2 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Skills grid */}
        {loading ? (
          <LoadingSpinner message="Loading skills..." />
        ) : skills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onClick={() => {
                  // TODO Phase 2: Open skill detail modal
                  console.log('View skill:', skill);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No skills found"
            message="Try adjusting your filters or be the first to add a skill!"
            action={
              isAuthenticated && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Add Your First Skill
                </button>
              )
            }
          />
        )}

        {/* Results count */}
        {!loading && skills.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {skills.length} skill{skills.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Create Skill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Skill</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSkill.title}
                  onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., React.js Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows="4"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Describe what you can teach or want to learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="input-field"
                >
                  {categories.filter(c => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to *
                </label>
                <select
                  value={newSkill.skillType}
                  onChange={(e) => setNewSkill({ ...newSkill, skillType: e.target.value })}
                  className="input-field"
                >
                  <option value="teach">Teach this skill</option>
                  <option value="learn">Learn this skill</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillBoard;
