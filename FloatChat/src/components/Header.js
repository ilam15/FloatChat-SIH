import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import the auth context
import "./Header.css";
import o from '../assets/o.png';

export const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout function from context

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="header-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <div className="nav-container">
        
        {/* Logo */}
        <Link to="/" className="logo-container">
          <img src={o} alt="FloatChat Logo" className="logo-img" style={{ width: "3.5rem", height: "5.5rem", maxHeight: "2.5rem" }} />
          <span className="logo-text">
            FloatChat
          </span>
        </Link>

        {/* Centered Navigation */}
        <div className="centered-nav">
          <ul className="nav-list">
            <li>
              <Link
                to="/"
                className="nav-link"
              >
                <i className="fas fa-home"></i>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="nav-link"
              >
                <i className="fas fa-robot"></i>
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className="nav-link"
              >
                <i className="fas fa-chart-line"></i>
                Analytics
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Auth Buttons */}
        <div className="right-section">
          
          {/* Show login/settings buttons when not logged in, logout button when logged in */}
          {user ? (
            // User is logged in - show logout button and settings button
            <div className="auth-buttons">
              <button
                onClick={handleLogout}
                className="auth-btn logout-btn"
              >
                <i className="fas fa-sign-out-alt"></i>
                Log Out
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="auth-btn settings-btn"
              >
                <i className="fas fa-cog"></i>
                Profile
              </button>
            </div>
          ) : (
            // User is not logged in - show login and settings buttons
            <div className="auth-buttons">
              <button
                onClick={() => navigate("/signin")}
                className="auth-btn login-btn"
              >
                <i className="fas fa-sign-in-alt"></i>
                Log In
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="auth-btn settings-btn"
              >
                <i className="fas fa-cog"></i>
                Settings
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="mobile-menu-btn"
          >
            <span className="sr-only">Open main menu</span>
            <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div
          className={`mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}
        >
          <ul className="mobile-nav-list">
            <li>
              <Link
                to="/"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <i className="fas fa-home"></i>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <i className="fas fa-robot"></i>
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <i className="fas fa-chart-line"></i>
                Analytics
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link
                    to="/signin"
                    className="mobile-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="mobile-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="fas fa-cog"></i>
                    Settings
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="mobile-nav-link logout-btn"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};