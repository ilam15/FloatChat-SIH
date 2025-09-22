import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
  User, Mail, Phone, Palette, Bell, Globe, Crown, 
  Save, Edit, X, LogOut, Undo, Shield, CreditCard,
  Check, Calendar, Star, Zap, Users, BookOpen, Waves, ChevronRight
} from "lucide-react";
import { updateUser, getUserById, deleteUser } from "./dbService";

export const Settings = () => {
  const { user, isLoggedIn, logout, updateUser: updateAuthUser } = useAuth();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    userType: "general",
    institution: "",
    accountType: "Basic",
    preferences: {
      theme: "light",
      notifications: true,
      language: "english",
      autoSave: true,
      fontSize: "medium",
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalDetails, setOriginalDetails] = useState({});
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (isLoggedIn && user) {
        try {
          setIsLoading(true);
          const dbUser = await getUserById(user.id);
          
          if (dbUser) {
            setUserDetails(dbUser);
            setOriginalDetails(dbUser);
          } else {
            const initialDetails = {
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              username: user.username || user.email.split('@')[0],
              userType: user.userType || "general",
              institution: user.institution || "",
              accountType: "Basic",
              preferences: {
                theme: "light",
                notifications: true,
                language: "english",
                autoSave: true,
                fontSize: "medium",
              }
            };
            setUserDetails(initialDetails);
            setOriginalDetails(initialDetails);
            await updateUser(user.id, initialDetails);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          const storedDetails = localStorage.getItem(`userDetails_${user.id}`);
          if (storedDetails) {
            const parsedDetails = JSON.parse(storedDetails);
            setUserDetails(parsedDetails);
            setOriginalDetails(parsedDetails);
          } else {
            const initialDetails = {
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              username: user.username || user.email.split('@')[0],
              userType: user.userType || "general",
              institution: user.institution || "",
              accountType: "Basic",
              preferences: {
                theme: "light",
                notifications: true,
                language: "english",
                autoSave: true,
                fontSize: "medium",
              }
            };
            setUserDetails(initialDetails);
            setOriginalDetails(initialDetails);
            localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(initialDetails));
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserData();
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

  const saveSettings = async () => {
    if (user) {
      try {
        const updatedUser = await updateUser(user.id, userDetails);
        
        if (!updatedUser) {
          throw new Error("Failed to update user in database");
        }
        
        updateAuthUser({
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          username: userDetails.username,
          userType: userDetails.userType,
          institution: userDetails.institution,
        });
        
        setOriginalDetails(userDetails);
        setIsEditing(false);
        
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error("Error saving settings:", error);
        localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(userDetails));
        updateAuthUser({
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          username: userDetails.username,
          userType: userDetails.userType,
          institution: userDetails.institution,
        });
        setOriginalDetails(userDetails);
        setIsEditing(false);
        
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }
  };

  const resetSettings = async () => {
    if (user) {
      try {
        const defaultSettings = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || user.email.split('@')[0],
          userType: user.userType || "general",
          institution: user.institution || "",
          accountType: "Basic",
          preferences: {
            theme: "light",
            notifications: true,
            language: "english",
            autoSave: true,
            fontSize: "medium",
          }
        };
        
        await updateUser(user.id, defaultSettings);
        setUserDetails(defaultSettings);
        setSaveStatus("reset");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error("Error resetting settings:", error);
        const defaultSettings = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || user.email.split('@')[0],
          userType: user.userType || "general",
          institution: user.institution || "",
          accountType: "Basic",
          preferences: {
            theme: "light",
            notifications: true,
            language: "english",
            autoSave: true,
            fontSize: "medium",
          }
        };
        setUserDetails(defaultSettings);
        localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(defaultSettings));
        
        setSaveStatus("reset");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }
  };
  const handleDeleteAccount = async () => {
    
      if (user) {
        try {
          await deleteUser(user.id);
          logout();
          // Optional: Show a success message before redirecting
          //alert("Your account has been successfully deleted.");
          window.location.href = "/";
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ocean Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-float"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                top: `${10 + i * 15}%`,
                left: `${10 + i * 10}%`,
                animationDelay: `${i * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-md w-full text-center z-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Please log in to access settings</h2>
            <p className="text-gray-600">You need to be logged in to view and modify your settings.</p>
          </div>
          <button
            onClick={() => (window.location.href = "/signin")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            Go to Login Page
            <ChevronRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ocean Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-float"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                top: `${10 + i * 15}%`,
                left: `${10 + i * 10}%`,
                animationDelay: `${i * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-md w-full text-center z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4 relative overflow-hidden">
      {/* Ocean Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-float"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              top: `${10 + i * 15}%`,
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Save Status Notification */}
      {saveStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 flex items-center ${
          saveStatus === "success" || saveStatus === "reset" 
            ? "bg-green-500 text-white" 
            : "bg-blue-500 text-white"
        }`}>
          {saveStatus === "success" && <Check size={20} className="mr-2" />}
          {saveStatus === "reset" && <Undo size={20} className="mr-2" />}
          
          {saveStatus === "success" && "Settings saved successfully!"}
          {saveStatus === "reset" && "Settings reset to default values!"}
        </div>
      )}

      <div className="relative z-10 flex justify-center items-start min-h-screen py-8">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          {/* Left Panel - Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 flex flex-col">
            <div className="flex flex-col flex-1">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                  {userDetails.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userDetails.name}</h2>
                  <p className="text-blue-100 text-sm">@{userDetails.username}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-100">Account Type</p>
                  <p className="font-semibold flex items-center">
                    <Crown size={16} className="mr-2" />
                    {userDetails.accountType}
                  </p>
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
                  <p className="font-semibold flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-100">User Type</p>
                  <p className="font-semibold capitalize flex items-center">
                    <Users size={16} className="mr-2" />
                    {userDetails.userType}
                  </p>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === "profile" 
                      ? "bg-blue-500/20 border-l-4 border-white" 
                      : "hover:bg-blue-500/10"
                  }`}
                >
                  <User size={18} className="mr-3" />
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveSection("preferences")}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === "preferences" 
                      ? "bg-blue-500/20 border-l-4 border-white" 
                      : "hover:bg-blue-500/10"
                  }`}
                >
                  <Palette size={18} className="mr-3" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => setActiveSection("account")}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === "account" 
                      ? "bg-blue-500/20 border-l-4 border-white" 
                      : "hover:bg-blue-500/10"
                  }`}
                >
                  <Shield size={18} className="mr-3" />
                  <span>Account Type</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-500/30">
                <button
                  onClick={saveSettings}
                  className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 hover:bg-blue-50 mb-3"
                >
                  <Save size={18} className="mr-2" /> Save All Settings
                </button>
                <button
                  onClick={resetSettings}
                  className="w-full bg-blue-500/20 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 hover:bg-blue-500/30 mb-3"
                >
                  <Undo size={18} className="mr-2" /> Reset Settings
                </button>
                <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 hover:bg-red-700 mt-4"
              >
                <LogOut size={18} className="mr-2" /> Delete Account
              </button>
              </div>
            </div>
          </div>


          {/* Right Panel - Content */}
          <div className="w-full lg:w-2/3 xl:w-3/4 p-6 overflow-y-auto max-h-screen">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Waves size={28} className="text-blue-500 mr-3" /> OceanExplorer Settings
              </h1>
            </div>

            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <User size={20} className="text-blue-500 mr-2" /> Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={enableEditing}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
                    >
                      <Edit size={18} className="mr-2" /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <User size={16} className="text-blue-500 mr-2" /> Full Name:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userDetails.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <span className="text-blue-500 mr-2">@</span> Username:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={userDetails.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Mail size={16} className="text-blue-500 mr-2" /> Email Address:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Phone size={16} className="text-blue-500 mr-2" /> Phone Number:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Users size={16} className="text-blue-500 mr-2" /> I am a:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["student", "general", "researcher", "scientist"].map((type) => (
                      <div
                        key={type}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          userDetails.userType === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-blue-300"
                        } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                        onClick={() => isEditing && handleUserTypeChange(type)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                              userDetails.userType === type
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "border-gray-400"
                            }`}
                          >
                            {userDetails.userType === type && <Check size={10} />}
                          </div>
                          <h3 className="font-semibold capitalize">{type}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {type === "student" && "Currently enrolled in education"}
                          {type === "general" && "For everyday communication"}
                          {type === "researcher" && "Academic or professional research"}
                          {type === "scientist" && "Marine science professional"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {(userDetails.userType === "student" || userDetails.userType === "researcher" || userDetails.userType === "scientist") && (
                  <div className="mb-6">
                    <label htmlFor="institution" className="block text-gray-700 font-medium mb-2">
                      Institution / Organization
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={userDetails.institution}
                        onChange={handleInputChange}
                        placeholder="Enter your institution or organization"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={saveSettings}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
                    >
                      <Save size={18} className="mr-2" /> Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
                    >
                      <X size={18} className="mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Palette size={20} className="text-blue-500 mr-2" /> Preferences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="mb-4">
                    <label htmlFor="theme" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Palette size={16} className="text-blue-500 mr-2" /> Theme:
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={userDetails.preferences.theme}
                      onChange={handlePreferenceChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System Default)</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="language" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Globe size={16} className="text-blue-500 mr-2" /> Language:
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={userDetails.preferences.language}
                      onChange={handlePreferenceChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                      <option value="chinese">Chinese</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="fontSize" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <span className="text-blue-500 mr-2">Aa</span> Font Size:
                    </label>
                    <select
                      id="fontSize"
                      name="fontSize"
                      value={userDetails.preferences.fontSize}
                      onChange={handlePreferenceChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="x-large">X-Large</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={userDetails.preferences.notifications}
                      onChange={handlePreferenceChange}
                      className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 mr-3"
                    />
                    <Bell size={16} className="text-blue-500 mr-2" /> Enable Notifications
                  </label>

                  <label className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      id="autoSave"
                      name="autoSave"
                      checked={userDetails.preferences.autoSave}
                      onChange={handlePreferenceChange}
                      className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 mr-3"
                    />
                    <Save size={16} className="text-blue-500 mr-2" /> Auto-save conversations
                  </label>
                </div>
              </div>
            )}

            {/* Account Type Section */}
            {activeSection === "account" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Shield size={20} className="text-blue-500 mr-2" /> Account Type
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { id: "Basic", name: "Basic", price: "Free", features: ["Basic messaging", "5GB storage", "Standard support"] },
                    { id: "Premium", name: "Premium", price: "$9.99", period: "/month", features: ["Advanced messaging", "50GB storage", "Priority support", "Custom themes"] },
                    { id: "Enterprise", name: "Enterprise", price: "$29.99", period: "/month", features: ["All features", "Unlimited storage", "24/7 dedicated support", "Custom integrations"] }
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.accountType === plan.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() => handleAccountTypeChange(plan.id)}
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                            userDetails.accountType === plan.id
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {userDetails.accountType === plan.id && <Check size={10} />}
                        </div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {plan.id === "Basic" && "Free access to basic features with limited functionality."}
                        {plan.id === "Premium" && "Enhanced features, priority support, and unlimited access."}
                        {plan.id === "Enterprise" && "Full feature set, dedicated support, and custom solutions."}
                      </p>
                      <ul className="mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center mb-2 text-sm text-gray-600">
                            <Check size={14} className="text-green-500 mr-2" /> {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-center">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-gray-600 text-sm">{plan.period}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Current Plan</h3>
                  <p className="text-blue-600 font-semibold">{userDetails.accountType}</p>
                  <p className="text-gray-600 text-sm mt-2">Member Since {new Date().toLocaleDateString()}</p>
                </div>

                <button
                  onClick={saveSettings}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center transition duration-200"
                >
                  <Save size={18} className="mr-2" /> Update Account Type
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
