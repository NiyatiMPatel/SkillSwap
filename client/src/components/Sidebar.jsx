import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeSidebar } from '../store/slices/uiSlice';
import { Home, Grid, User, X } from 'lucide-react';

/**
 * Sidebar Component
 * - Side navigation with links
 * - Responsive: overlay on mobile, persistent on desktop
 * - Shows different links based on auth state
 */
const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navLinks = [
    { to: '/board', label: 'Skill Board', icon: Grid, authRequired: false },
    { to: '/dashboard', label: 'Dashboard', icon: Home, authRequired: true },
    { to: '/profile', label: 'Profile', icon: User, authRequired: true },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !link.authRequired || isAuthenticated
  );

  const isActive = (path) => location.pathname === path;

  // Close sidebar on mobile only after navigation
  const handleLinkClick = () => {
    // Only close on mobile screens
    if (window.innerWidth < 1024) {
      dispatch(closeSidebar());
    }
  };

  return (
    <>
      {/* Mobile overlay - only show when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* Sidebar - visible on desktop, toggleable on mobile */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 lg:sticky lg:top-16 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={() => dispatch(closeSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer - Phase 2 placeholder */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {/* TODO Phase 2: Add messaging/notifications here */}
              SkillSwap v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
