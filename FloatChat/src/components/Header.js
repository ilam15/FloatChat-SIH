import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // null = guest, object = logged in user

  const navigate = useNavigate();

  // Mock login (you'll replace with real auth later)
  // const handleLogin = () => {
  //   setUser({ name: "Ilam" }); // store user data
  //   navigate("/profile"); // redirect after login if needed
  // };

  const handleLogout = () => {
    setUser(null);
    navigate("/"); // go back home after logout
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="FloatChat Logo"
          />
          <span className="self-center text-2xl font-extrabold whitespace-nowrap text-gray-800">
            FloatChat
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center md:order-2 space-x-6 md:space-x-0 rtl:space-x-reverse">
          
          {/* Profile / Guest Button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            className="flex text-sm bg-gray-300 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={
                user
                  ? "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png" // Guest icon
              }
              alt="user icon"
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-10 top-14 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm">   
              <ul className="py-2">
                {user ? (
                  <>
                    <li>
                      <button
                        onClick={() => navigate("/profile")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View Profile ({user.name})
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={() => navigate("/signin")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log In
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/settings")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Setting
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-gray-700 rounded-sm md:bg-transparent md:text-gray-700 md:p-0 hover:bg-gray-200 hover:text-gray-900 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-700 md:p-0 transition"
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/comparison"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-700 md:p-0 transition"
              >
                Comparison
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
