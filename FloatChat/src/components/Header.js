import React from "react";
import { Link } from "react-router-dom";
import oc from "../assets/oc.png";

export const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200 w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-8 py-4 relative">
        
        {/* Logo and Name */}
        <Link to="/" className="flex items-center space-x-4 absolute left-8">
          <img
            src={oc}
            className="h-12"
            alt="FloatChat Logo"
          />
          <span className="text-3xl font-extrabold text-gray-800">
            Samudra
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center justify-center mx-auto">
          <ul className="flex items-center space-x-12 font-medium">
            <li>
              <Link
                to="/"
                className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
              >
                AnalyticsFilter
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};