import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Car, Search, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <ShieldAlert size={24} className="brand-icon" />
          </div>
          <span className="brand-text">Traffic<span className="brand-highlight">Watch</span></span>
        </Link>

        {/* Desktop Menu */}
        <nav className="navbar-nav desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/report" className={`nav-link ${isActive('/report')}`}>
            <Car size={18} />
            Report Violation
          </Link>
          <Link to="/fines" className={`nav-link ${isActive('/fines')}`}>
            <Search size={18} />
            Check Fines
          </Link>

          {user?.role === 'user' && (
            <Link to="/my-reports" className={`nav-link ${isActive('/my-reports')}`}>
              <User size={18} />
              My Reports
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link admin-link ${isActive('/admin')}`}>Admin</Link>
          )}

          {!user ? (
            <Link to="/login" className="nav-link admin-link">
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="nav-link" style={{ color: 'var(--danger)' }}>
              <LogOut size={18} /> Logout
            </button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu animate-fade-in">
          <div className="container">
            <Link to="/" className={`mobile-nav-link ${isActive('/')}`} onClick={toggleMenu}>Home</Link>
            <Link to="/report" className={`mobile-nav-link ${isActive('/report')}`} onClick={toggleMenu}>
              <Car size={18} /> Report Violation
            </Link>
            <Link to="/fines" className={`mobile-nav-link ${isActive('/fines')}`} onClick={toggleMenu}>
              <Search size={18} /> Check Fines
            </Link>

            
            {user?.role === 'user' && (
              <Link to="/my-reports" className={`mobile-nav-link ${isActive('/my-reports')}`} onClick={toggleMenu}>
                <User size={18} /> My Reports
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className={`mobile-nav-link admin-link ${isActive('/admin')}`} onClick={toggleMenu}>
                Admin
              </Link>
            )}

            {!user ? (
              <Link to="/login" className="mobile-nav-link admin-link mt-4" onClick={toggleMenu}>
                <LogIn size={18} /> Login / Sign Up
              </Link>
            ) : (
              <button onClick={handleLogout} className="mobile-nav-link mt-4" style={{ color: 'var(--danger)' }}>
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
