import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, User, LogOut } from 'lucide-react';
import './Navigation.css';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-logo">
          <div className="logo-icon">FC</div>
          <span className="logo-text">FloatChat</span>
        </div>
      </div>

      <div className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-footer">
        <button className="nav-item logout">
          <LogOut size={20} className="nav-icon" />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </nav>
  );
};
