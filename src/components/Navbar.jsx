import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectRole, selectIsAuthenticated, selectEmail, logout } from "../store/authSlice"; // ✅ FIXED import
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const email = useSelector(selectEmail); // ✅ FIXED: Simple and clean!

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          🛍️ Product Catalog
        </Link>
      </div>

      {/* Navigation Links - Only show when authenticated */}
      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/">🏠 Home</Link>
          
          {/* ROLE-BASED: Only show "Create Product" for manager/admin */}
          {(role === 'manager' || role === 'admin') && (
            <Link to="/products/new">➕ Create Product</Link>
          )}
          
          <Link to="/tasks">📋 Tasks</Link>
          <Link to="/tasks/new">➕ Create Task</Link>
        </div>
      )}

      {/* Auth Section - Right Side */}
      <div className="nav-auth">
        {isAuthenticated ? (
          <div className="user-info">
            <div className="user-details">
              <span className="user-email" title={email}>
                👤 {email?.split('@')[0]} {/* Show only username part */}
              </span>
              <span className={`role-badge role-${role}`}>
                {role?.toUpperCase()}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="logout-btn"
              title="Click to logout"
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-link">
              🔐 Login
            </Link>
            <Link to="/login?mode=register" className="register-link">
              📝 Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}