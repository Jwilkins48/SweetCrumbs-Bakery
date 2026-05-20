import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout and redirect to home page
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Left  */}
      <div className="navbar-start">
        {/* dropdown for mobile */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {/* Mobile dropdown */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/catalog">Shop</Link>
            </li>
            {user?.isAdmin && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            {user ? (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
                <li>
                  <Link to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {/* nav links */}
        <ul className="menu menu-horizontal px-1 hidden lg:flex">
          <li>
            <Link
              className="text-[.85rem] btn btn-outline rounded-lg"
              to="/catalog"
            >
              Shop
            </Link>
          </li>
          {user?.isAdmin && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-2xl font-bold title">
          Sweet Crumbs Bakery
        </Link>
      </div>

      {/* Right */}
      <div className="navbar-end gap-2">
        {user ? (
          <div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
            <Link to="/cart">Cart</Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm text-[.85rem]">
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-sm rounded-md text-[.85rem]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
