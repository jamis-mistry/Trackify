import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:text-primary-100 transition tracking-wide">
        <img src="/trackify-logo.png" alt="Trackify" className="w-14 h-14 object-contain bg-white rounded-full p-0.5" />
        Trackify
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-sm">Welcome, <strong>{user.name}</strong></span>
            <span className="text-xs bg-primary-700 px-2 py-1 rounded capitalize shadow-sm">{user.role}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-danger rounded hover:bg-red-700 transition font-medium shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded bg-primary-700 hover:bg-primary-800 transition font-medium shadow-md hover:shadow-lg">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 rounded bg-secondary-600 hover:bg-secondary-700 transition font-medium shadow-md hover:shadow-lg">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
