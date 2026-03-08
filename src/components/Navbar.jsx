import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar({ user, profile, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-primary-600 bg-primary-50"
        : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
    }`;

  return (
    <nav className="bg-white shadow-base sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rose-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">UP</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 hidden sm:inline">
              UrbanPlanner
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/explore" className={navLinkClass("/explore")}>
              Explore
            </Link>

            {profile?.role === "builder" && (
              <>
                <Link to="/builder" className={navLinkClass("/builder")}>
                  Builder Portal
                </Link>
                <Link
                  to="/builder-dashboard"
                  className={navLinkClass("/builder-dashboard")}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center space-x-3">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-amber-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-950 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-sm text-neutral-600">
                  {profile?.role === "builder" ? "Builder" : "User"}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-200">
            <Link to="/" className={`block ${navLinkClass("/")} mt-2`}>
              Home
            </Link>
            <Link
              to="/explore"
              className={`block ${navLinkClass("/explore")} mt-2`}
            >
              Explore
            </Link>

            {profile?.role === "builder" && (
              <>
                <Link
                  to="/builder"
                  className={`block ${navLinkClass("/builder")} mt-2`}
                >
                  Builder Portal
                </Link>
                <Link
                  to="/builder-dashboard"
                  className={`block ${navLinkClass("/builder-dashboard")} mt-2`}
                >
                  Dashboard
                </Link>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              )}

              {user && (
                <button
                  onClick={onLogout}
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
