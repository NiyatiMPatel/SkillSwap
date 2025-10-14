import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSkillsOverview,
  fetchCategories,
  setSearchQuery,
  setCurrentPage,
} from "../store/slices/skillsSlice";
import SkillOverviewCard from "../components/SkillOverviewCard";
import SkillCardSkeleton from "../components/SkillCardSkeleton";
import SkillDetailModal from "../components/SkillDetailModal";
import EmptyState from "../components/EmptyState";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Skill Board Page - Enhanced Skills Overview
 * - Displays all unique skills from user profiles
 * - Interactive skill cards with save/request features
 * - Smart search (searches skill names and user bios)
 * - Category filtering
 * - Debounced search for performance
 * - Skeleton loaders for better UX
 * - Modal for detailed skill view
 */
const SkillBoard = () => {
  const dispatch = useDispatch();
  const { skillsOverview, categories, overviewLoading, searchQuery: globalSearchQuery, pagination } = useSelector(
    (state) => state.skills
  );

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch categories only once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch skills overview whenever page changes
  useEffect(() => {
    dispatch(fetchSkillsOverview({ page: pagination.currentPage, limit: 10 }));
  }, [dispatch, pagination.currentPage]);

  // Debounced search - updates Redux state after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);

  // Smart filter: searches skill names and user bios (client-side filtering on paginated data)
  const filteredSkills = useCallback(() => {
    return skillsOverview.filter((skill) => {
      // Search filter - searches skill name and participant names/emails
      const searchLower = globalSearchQuery.toLowerCase();
      const matchesSearch = 
        globalSearchQuery === '' ||
        skill.name.toLowerCase().includes(searchLower) ||
        skill.teachers.some(t => 
          t.name.toLowerCase().includes(searchLower) ||
          t.email.toLowerCase().includes(searchLower)
        ) ||
        skill.learners.some(l => 
          l.name.toLowerCase().includes(searchLower) ||
          l.email.toLowerCase().includes(searchLower)
        );

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || skill.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [skillsOverview, globalSearchQuery, selectedCategory])();

  // Pagination handlers
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    dispatch(setSearchQuery(""));
    setSelectedCategory("all");
  };

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Skills Overview</h1>
          <p className="text-gray-600 mt-1">
            Discover all available skills and connect with teachers and learners
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Smart Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills, teachers, or learners..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="input-field pl-10"
                  aria-label="Search skills"
                />
                {localSearchQuery && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-400">Searching...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Category filter */}
            <div className="sm:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.length > 1 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))
                ) : (
                  <option value="all">No categories yet</option>
                )}
              </select>
            </div>

            {/* Clear filters */}
            {(localSearchQuery || selectedCategory !== "all") && (
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

        {/* Skills Overview Grid */}
        {overviewLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkillCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredSkills.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <SkillOverviewCard key={index} skill={skill} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    pagination.hasPrevPage
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and adjacent pages
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            pageNumber === pagination.currentPage
                              ? 'bg-primary-600 text-white font-semibold'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-label={`Page ${pageNumber}`}
                          aria-current={pageNumber === pagination.currentPage ? 'page' : undefined}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === pagination.currentPage - 2 ||
                      pageNumber === pagination.currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="text-gray-400 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    pagination.hasNextPage
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-primary-600">{filteredSkills.length}</span> of {pagination.totalItems} skill
                {pagination.totalItems !== 1 ? "s" : ""} (Page {pagination.currentPage} of {pagination.totalPages})
              </p>
              {globalSearchQuery && (
                <p className="text-xs text-gray-500 mt-1">
                  Searching for: "{globalSearchQuery}"
                </p>
              )}
            </div>
          </>
        ) : localSearchQuery || selectedCategory !== "all" ? (
          <EmptyState
            title="No skills found"
            message="Try adjusting your search or filters. We search skill names, teachers, and learners."
          />
        ) : (
          <EmptyState
            title="No skills available yet"
            message="Skills will appear here when users add them to their profiles"
          />
        )}
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal />
    </div>
  );
};

export default SkillBoard;
