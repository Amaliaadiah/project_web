import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="navbar bg-[#fff0d7] shadow-md px-4 md:px-8">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-extrabold text-[#5e3a21] tracking-wide"
        >
          PawPals <span className="text-lg">🐾</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-none space-x-2">
        {user ? (
          <>
            {/* Admin */}
            {user.role === "admin" ? (
              <Link
                to="/admin"
                className={`btn btn-sm normal-case transition duration-200 ${
                  isActive("/admin")
                    ? "bg-[#8b5e3c] text-white border-[#8b5e3c]"
                    : "bg-[#fff0d7] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
                }`}
              >
                Kelola Adopsi
              </Link>
            ) : (
              <>
                <Link
                  to="/"
                  className={`btn btn-sm normal-case transition duration-200 ${
                    isActive("/")
                      ? "bg-[#8b5e3c] text-white border-[#8b5e3c]"
                      : "bg-[#fff0d7] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard"
                  className={`btn btn-sm normal-case transition duration-200 ${
                    isActive("/dashboard")
                      ? "bg-[#8b5e3c] text-white border-[#8b5e3c]"
                      : "bg-[#fff0d7] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
                  }`}
                >
                  Daftar Hewan
                </Link>
                <Link
                  to="/myadoptions"
                  className={`btn btn-sm normal-case transition duration-200 ${
                    isActive("/myadoptions")
                      ? "bg-[#8b5e3c] text-white border-[#8b5e3c]"
                      : "bg-[#fff0d7] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
                  }`}
                >
                  Status Adopsi
                </Link>
              </>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn btn-sm normal-case bg-[#fff0d7] text-[#8b5e3c] transition duration-200 hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`btn btn-sm normal-case transition duration-200 ${
                isActive("/login")
                  ? "bg-[#8b5e3c] text-white border-[#8b5e3c]"
                  : "bg-[#fff0d7] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`btn btn-sm normal-case transition duration-200 ${
                isActive("/register")
                  ? "bg-[#8b5e3c] text-white border-[#8b5e3c]"
                  : "bg-[#fff0d7] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white border border-[#8b5e3c]"
              }`}
            >
              Gabung
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
