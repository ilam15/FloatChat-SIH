import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import your auth context

export const Settings = () => {
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    userType: "general",
    accountType: "Basic",
    preferences: {
      theme: "light",
      notifications: true,
      language: "english",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalDetails, setOriginalDetails] = useState({});
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && user) {
      const storedDetails = localStorage.getItem(`userDetails_${user.id}`);
      if (storedDetails) {
        const parsedDetails = JSON.parse(storedDetails);
        setUserDetails(parsedDetails);
        setOriginalDetails(parsedDetails);
      } else {
        // Create initial user details based on auth user data
        const initialDetails = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || user.email.split('@')[0],
          userType: "general",
          accountType: "Basic",
          preferences: {
            theme: "light",
            notifications: true,
            language: "english",
          },
        };
        setUserDetails(initialDetails);
        setOriginalDetails(initialDetails);
        localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(initialDetails));
      }
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleAccountTypeChange = (type) => {
    setUserDetails((prev) => ({
      ...prev,
      accountType: type,
    }));
  };

  const handleUserTypeChange = (type) => {
    setUserDetails((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setUserDetails(originalDetails);
    setIsEditing(false);
  };

  const saveSettings = () => {
    if (user) {
      localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(userDetails));
      updateUser({
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        username: userDetails.username,
      });
      setOriginalDetails(userDetails);
      setIsEditing(false);
      alert("Settings saved successfully!");
    }
  };

  const resetSettings = () => {
    if (user) {
      const defaultSettings = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || user.email.split('@')[0],
        userType: "general",
        accountType: "Basic",
        preferences: {
          theme: "light",
          notifications: true,
          language: "english",
        },
      };
      setUserDetails(defaultSettings);
      localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(defaultSettings));
      alert("Settings reset to original values!");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Show loading state while checking authentication
  /*if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
          <p className="text-gray-600 mb-6">Please wait while we load your settings.</p>
        </div>
      </div>
    );
  }*/

  // If user is not logged in, show a message with login button
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access settings</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view and modify your settings.</p>
          <button
            onClick={() => (window.location.href = "/signin")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header with logout button */}
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Sidebar */}
        <div className="lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col min-h-screen">
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                {userDetails.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{userDetails.name}</h2>
                <p className="text-blue-100 text-sm">{userDetails.username}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <p className="text-sm text-blue-100">Account Type</p>
                <p className="font-semibold">{userDetails.accountType}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <p className="text-sm text-blue-100">Account Status</p>
                <p className="font-semibold flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                  Active
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <p className="text-sm text-blue-100">Joined Date</p>
                <p className="font-semibold">12/9/2025</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <p className="text-sm text-blue-100">User Type</p>
                <p className="font-semibold capitalize">{userDetails.userType}</p>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <button
                onClick={() => setActiveSection("profile")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === "profile" ? "bg-blue-500/20" : "hover:bg-blue-500/10"
                }`}
              >
                <i className="fas fa-user-circle mr-3"></i>
                <span>Profile Information</span>
              </button>
              <button
                onClick={() => setActiveSection("preferences")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === "preferences" ? "bg-blue-500/20" : "hover:bg-blue-500/10"
                }`}
              >
                <i className="fas fa-paint-brush mr-3"></i>
                <span>Preferences</span>
              </button>
              <button
                onClick={() => setActiveSection("account")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === "account" ? "bg-blue-500/20" : "hover:bg-blue-500/10"
                }`}
              >
                <i className="fas fa-crown mr-3"></i>
                <span>Account Type</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-500/30">
              <button
                onClick={saveSettings}
                className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 hover:bg-blue-50 mb-3"
              >
                <i className="fas fa-save mr-2"></i> Save All Settings
              </button>
              <button
                onClick={resetSettings}
                className="w-full bg-blue-500/20 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 hover:bg-blue-500/30"
              >
                <i className="fas fa-undo mr-2"></i> Reset Settings
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="lg:w-2/3 xl:w-3/4 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-cog text-blue-500 mr-3"></i> FloatChat Settings
            </h1>

            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-user text-blue-500 mr-2"></i> Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={enableEditing}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
                    >
                      <i className="fas fa-edit mr-2"></i> Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <i className="fas fa-user text-blue-500 mr-2"></i> Full Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <i className="fas fa-at text-blue-500 mr-2"></i> Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userDetails.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <i className="fas fa-envelope text-blue-500 mr-2"></i> Email Address:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <i className="fas fa-phone text-blue-500 mr-2"></i> Phone Number:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <i className="fas fa-user-tag text-blue-500 mr-2"></i> I am a:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.userType === "student"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() => isEditing && handleUserTypeChange("student")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 ${
                            userDetails.userType === "student"
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-400"
                          }`}
                        ></div>
                        <h3 className="font-semibold">Student</h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">Currently enrolled in education</p>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.userType === "general"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() => isEditing && handleUserTypeChange("general")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 ${
                            userDetails.userType === "general"
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-400"
                          }`}
                        ></div>
                        <h3 className="font-semibold">General User</h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">For everyday communication</p>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.userType === "researcher"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() => isEditing && handleUserTypeChange("researcher")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 ${
                            userDetails.userType === "researcher"
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-400"
                          }`}
                        ></div>
                        <h3 className="font-semibold">Researcher</h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">Academic or professional research</p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={saveSettings}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
                    >
                      <i className="fas fa-save mr-2"></i> Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
                    >
                      <i className="fas fa-times mr-2"></i> Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <i className="fas fa-paint-brush text-blue-500 mr-2"></i> Preferences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label
                      htmlFor="theme"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <i className="fas fa-palette text-blue-500 mr-2"></i> Theme:
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={userDetails.preferences.theme}
                      onChange={handlePreferenceChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System Default)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="language"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <i className="fas fa-language text-blue-500 mr-2"></i> Language:
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={userDetails.preferences.language}
                      onChange={handlePreferenceChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                      <option value="chinese">Chinese</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center mt-6 p-4 bg-gray-50 rounded-lg">
                  <label
                    htmlFor="notifications"
                    className="flex items-center text-gray-700 font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={userDetails.preferences.notifications}
                      onChange={handlePreferenceChange}
                      className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <i className="fas fa-bell text-blue-500 mr-2"></i> Enable Notifications
                  </label>
                </div>
              </div>
            )}

            {/* Account Type Section */}
            {activeSection === "account" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <i className="fas fa-crown text-blue-500 mr-2"></i> Account Type
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      userDetails.accountType === "Basic"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => handleAccountTypeChange("Basic")}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-2 ${
                          userDetails.accountType === "Basic"
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-400"
                        }`}
                      ></div>
                      <h3 className="font-semibold text-lg">Basic</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Free access to basic features with limited functionality.</p>
                    <div className="mt-4">
                      <span className="text-2xl font-bold">Free</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      userDetails.accountType === "Premium"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => handleAccountTypeChange("Premium")}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-2 ${
                          userDetails.accountType === "Premium"
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-400"
                        }`}
                      ></div>
                      <h3 className="font-semibold text-lg">Premium</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Enhanced features, priority support, and unlimited access.</p>
                    <div className="mt-4">
                      <span className="text-2xl font-bold">$9.99</span>
                      <span className="text-gray-600 text-sm">/month</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      userDetails.accountType === "Enterprise"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => handleAccountTypeChange("Enterprise")}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-2 ${
                          userDetails.accountType === "Enterprise"
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-400"
                        }`}
                      ></div>
                      <h3 className="font-semibold text-lg">Enterprise</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Full feature set, dedicated support, and custom solutions.</p>
                    <div className="mt-4">
                      <span className="text-2xl font-bold">$29.99</span>
                      <span className="text-gray-600 text-sm">/month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Current Plan</h3>
                  <p className="text-blue-600 font-semibold">{userDetails.accountType}</p>
                  <p className="text-gray-600 text-sm mt-2">Member Since 12/9/2025</p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={saveSettings}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center transition duration-200"
                  >
                    <i className="fas fa-sync-alt mr-2"></i> Update Account Type
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

