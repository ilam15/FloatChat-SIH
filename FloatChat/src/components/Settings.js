import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
  User, Mail, Phone, Palette, Bell, Globe, Crown, 
  Save, Edit, X, LogOut, Undo, Shield, CreditCard,
  Check, Calendar, Star, Zap, Users, BookOpen, Eye, EyeOff,
  Lock, Key, Download, Upload, Trash2
} from "lucide-react";
import { updateUser, getUserById } from "./dbService";

export const Settings = () => {
  const { user, isLoggedIn, logout, updateUser: updateAuthUser } = useAuth();
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
      autoSave: true,
      fontSize: "medium",
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalDetails, setOriginalDetails] = useState({});
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [exportData, setExportData] = useState({
    format: "json",
    includeMessages: true,
    includeFiles: false,
  });

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
              userType: "general",
              accountType: "Basic",
              preferences: {
                theme: "light",
                notifications: true,
                language: "english",
                autoSave: true,
                fontSize: "medium",
              },
              security: {
                twoFactorAuth: false,
                loginAlerts: true,
              },
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
              userType: "general",
              accountType: "Basic",
              preferences: {
                theme: "light",
                notifications: true,
                language: "english",
                autoSave: true,
                fontSize: "medium",
              },
              security: {
                twoFactorAuth: false,
                loginAlerts: true,
              },
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

  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [name]: checked,
      },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    setShowPasswordFields(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const saveSettings = async () => {
    if (user) {
      try {
        // Validate passwords if changing
        if (showPasswordFields) {
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSaveStatus("passwordMismatch");
            setTimeout(() => setSaveStatus(""), 3000);
            return;
          }
          if (passwordData.newPassword.length < 8) {
            setSaveStatus("passwordTooShort");
            setTimeout(() => setSaveStatus(""), 3000);
            return;
          }
          // Here you would typically verify the current password with your backend
        }

        const updatedUser = await updateUser(user.id, userDetails);
        
        if (!updatedUser) {
          throw new Error("Failed to update user in database");
        }
        
        updateAuthUser({
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          username: userDetails.username,
        });
        
        setOriginalDetails(userDetails);
        setIsEditing(false);
        setShowPasswordFields(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
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
        });
        setOriginalDetails(userDetails);
        setIsEditing(false);
        setShowPasswordFields(false);
        
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
          userType: "general",
          accountType: "Basic",
          preferences: {
            theme: "light",
            notifications: true,
            language: "english",
            autoSave: true,
            fontSize: "medium",
          },
          security: {
            twoFactorAuth: false,
            loginAlerts: true,
          },
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
          userType: "general",
          accountType: "Basic",
          preferences: {
            theme: "light",
            notifications: true,
            language: "english",
            autoSave: true,
            fontSize: "medium",
          },
          security: {
            twoFactorAuth: false,
            loginAlerts: true,
          },
        };
        setUserDetails(defaultSettings);
        localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(defaultSettings));
        
        setSaveStatus("reset");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate a file download
    const dataStr = JSON.stringify(userDetails, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `floatchat-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setSaveStatus("exported");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog and call an API
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setSaveStatus("deleting");
      setTimeout(() => {
        logout();
        setSaveStatus("deleted");
        setTimeout(() => setSaveStatus(""), 2000);
      }, 1500);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access settings</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view and modify your settings.</p>
          <button
            onClick={() => (window.location.href = "/signin")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center mx-auto"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Save Status Notification */}
      {saveStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          saveStatus === "success" || saveStatus === "reset" || saveStatus === "exported"
            ? "bg-green-500 text-white" 
            : saveStatus === "passwordMismatch" || saveStatus === "passwordTooShort"
            ? "bg-red-500 text-white"
            : saveStatus === "deleting"
            ? "bg-yellow-500 text-white"
            : "bg-blue-500 text-white"
        }`}>
          <div className="flex items-center">
            {saveStatus === "success" && <Check size={20} className="mr-2" />}
            {saveStatus === "reset" && <Undo size={20} className="mr-2" />}
            {saveStatus === "exported" && <Download size={20} className="mr-2" />}
            {saveStatus === "passwordMismatch" && <X size={20} className="mr-2" />}
            {saveStatus === "passwordTooShort" && <Lock size={20} className="mr-2" />}
            {saveStatus === "deleting" && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
            
            {saveStatus === "success" && "Settings saved successfully!"}
            {saveStatus === "reset" && "Settings reset to default values!"}
            {saveStatus === "exported" && "Data exported successfully!"}
            {saveStatus === "passwordMismatch" && "New passwords don't match!"}
            {saveStatus === "passwordTooShort" && "Password must be at least 8 characters!"}
            {saveStatus === "deleting" && "Deleting your account..."}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Sidebar */}
        <div className="lg:w-1/3 xl:w-1/4 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col">
          <div className="p-6 flex flex-col flex-1">
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
                onClick={() => setActiveSection("security")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === "security" 
                    ? "bg-blue-500/20 border-l-4 border-white" 
                    : "hover:bg-blue-500/10"
                }`}
              >
                
                <Shield size={18} className="mr-3" />
                <span>Account Type</span>
              </button>
              <button
                onClick={() => setActiveSection("billing")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === "billing" 
                    ? "bg-blue-500/20 border-l-4 border-white" 
                    : "hover:bg-blue-500/10"
                }`}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Billing & Payments</span>
              </button>
              <button
                onClick={() => setActiveSection("data")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === "data" 
                    ? "bg-blue-500/20 border-l-4 border-white" 
                    : "hover:bg-blue-500/10"
                }`}
              >
                <Download size={18} className="mr-3" />
                <span>Data Management</span>
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
            </div>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="lg:w-2/3 xl:w-3/4 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Zap size={28} className="text-blue-500 mr-3" /> FloatChat Settings
            </h1>

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
                  <div className="form-group">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <User size={16} className="text-blue-500 mr-2" /> Full Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                      }`}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <span className="text-blue-500 mr-2">@</span> Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userDetails.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
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
                      <Mail size={16} className="text-blue-500 mr-2" /> Email Address:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                      }`}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <Phone size={16} className="text-blue-500 mr-2" /> Phone Number:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Users size={16} className="text-blue-500 mr-2" /> I am a:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.userType === "student"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                      onClick={() => isEditing && handleUserTypeChange("student")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                            userDetails.userType === "student"
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {userDetails.userType === "student" && <Check size={10} />}
                        </div>
                        <h3 className="font-semibold">Student</h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">Currently enrolled in education</p>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.userType === "general"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                      onClick={() => isEditing && handleUserTypeChange("general")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                            userDetails.userType === "general"
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {userDetails.userType === "general" && <Check size={10} />}
                        </div>
                        <h3 className="font-semibold">General User</h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">For everyday communication</p>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        userDetails.userType === "researcher"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                      onClick={() => isEditing && handleUserTypeChange("researcher")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                            userDetails.userType === "researcher"
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {userDetails.userType === "researcher" && <Check size={10} />}
                        </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label
                      htmlFor="theme"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
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

                  <div className="form-group">
                    <label
                      htmlFor="language"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
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

                  <div className="form-group">
                    <label
                      htmlFor="fontSize"
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
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

                <div className="space-y-4 mt-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
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
                      <Bell size={16} className="text-blue-500 mr-2" /> Enable Notifications
                    </label>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <label
                      htmlFor="autoSave"
                      className="flex items-center text-gray-700 font-medium cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="autoSave"
                        name="autoSave"
                        checked={userDetails.preferences.autoSave}
                        onChange={handlePreferenceChange}
                        className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                      />
                      <Save size={16} className="text-blue-500 mr-2" /> Auto-save conversations
                    </label>
                  </div>
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
                        className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                          userDetails.accountType === "Basic"
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-gray-400"
                        }`}
                      >
                        {userDetails.accountType === "Basic" && <Check size={10} />}
                      </div>
                      <h3 className="font-semibold text-lg">Basic</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Free access to basic features with limited functionality.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Basic messaging</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> 5GB storage</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Standard support</li>
                    </ul>
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
                        className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                          userDetails.accountType === "Premium"
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-gray-400"
                        }`}
                      >
                        {userDetails.accountType === "Premium" && <Check size={10} />}
                      </div>
                      <h3 className="font-semibold text-lg">Premium</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Enhanced features, priority support, and unlimited access.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Advanced messaging</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> 50GB storage</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Priority support</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Custom themes</li>
                    </ul>
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
                        className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                          userDetails.accountType === "Enterprise"
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-gray-400"
                        }`}
                      >
                        {userDetails.accountType === "Enterprise" && <Check size={10} />}
                      </div>
                      <h3 className="font-semibold text-lg">Enterprise</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Full feature set, dedicated support, and custom solutions.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> All features</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Unlimited storage</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> 24/7 dedicated support</li>
                      <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Custom integrations</li>
                    </ul>
                    <div className="mt-4">
                      <span className="text-2xl font-bold">$29.99</span>
                      <span className="text-gray-600 text-sm">/month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Current Plan</h3>
                  <p className="text-blue-600 font-semibold">{userDetails.accountType}</p>
                  <p className="text-gray-600 text-sm mt-2">Member Since {new Date().toLocaleDateString()}</p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={saveSettings}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center transition duration-200"
                  >
                    <Save size={18} className="mr-2" /> Update Account Type
                  </button>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeSection === "billing" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <CreditCard size={20} className="text-blue-500 mr-2" /> Billing & Payments
                </h2>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods</h3>
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-6 bg-gray-200 rounded mr-3"></div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-600">Expires 12/2024</p>
                        </div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:text-blue-700 flex items-center">
                    <span className="mr-2">+</span> Add payment method
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Billing History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm">Dec 9, 2025</td>
                          <td className="px-4 py-3 text-sm">Premium Plan</td>
                          <td className="px-4 py-3 text-sm">$9.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Paid</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">Nov 9, 2025</td>
                          <td className="px-4 py-3 text-sm">Premium Plan</td>
                          <td className="px-4 py-3 text-sm">$9.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Paid</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Subscription Management</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
                    <div>
                      <p className="font-medium">Current Plan: {userDetails.accountType}</p>
                      <p className="text-sm text-gray-600">Next billing date: Jan 9, 2026</p>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm">
                      Manage Subscription
                    </button>
                  </div>
                  <button className="text-red-500 hover:text-red-700 flex items-center text-sm">
                    <X size={16} className="mr-1" /> Cancel Subscription
                  </button>
                </div>
              </div>
            )}

            {/* Data Management Section */}
            {activeSection === "data" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Download size={20} className="text-blue-500 mr-2" /> Data Management
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <Download size={18} className="text-blue-500 mr-2" /> Export Your Data
                    </h3>
                    <p className="text-gray-600 mb-4">Download a copy of your data for backup or transfer purposes.</p>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Format</label>
                      <select
                        name="format"
                        value={exportData.format}
                        onChange={handleExportChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="xml">XML</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="includeMessages"
                          checked={exportData.includeMessages}
                          onChange={handleExportChange}
                          className="mr-2 h-4 w-4 text-blue-500 rounded"
                        />
                        Include messages
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="includeFiles"
                          checked={exportData.includeFiles}
                          onChange={handleExportChange}
                          className="mr-2 h-4 w-4 text-blue-500 rounded"
                        />
                        Include uploaded files
                      </label>
                    </div>
                    
                    <button
                      onClick={handleExportData}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-200 w-full justify-center"
                    >
                      <Download size={18} className="mr-2" /> Export Data
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <Upload size={18} className="text-blue-500 mr-2" /> Import Data
                    </h3>
                    <p className="text-gray-600 mb-4">Restore your account from a previously exported backup.</p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                      <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Drag and drop your file here or</p>
                      <label htmlFor="file-upload" className="text-blue-500 cursor-pointer font-medium">
                        browse files
                      </label>
                      <input id="file-upload" type="file" className="hidden" />
                    </div>
                    
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center transition duration-200 w-full justify-center">
                      <Upload size={18} className="mr-2" /> Import Data
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Trash2 size={18} className="text-red-500 mr-2" /> Delete Account
                  </h3>
                  <p className="text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-200"
                  >
                    <Trash2 size={18} className="mr-2" /> Delete My Account
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