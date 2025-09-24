import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, Waves, Fish, Compass, Building, GraduationCap, FlaskConical } from 'lucide-react';
import { useAuth } from './AuthContext';
import { createUser, getUserByEmail } from './dbService';
import './Authentication.css';

export const Authentication = () => {
  const [authView, setAuthView] = useState('signup');
  const [signupStep, setSignupStep] = useState(1); // 1: Basic info, 2: Role & institution
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    role: 'general',
    institution: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, currentUser } = useAuth();

  useEffect(() => {
    const savedData = localStorage.getItem('oceanExplorerAuthData');
    const savedView = localStorage.getItem('oceanExplorerAuthView');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData,
          password: '',
          confirmPassword: ''
        }));
      } catch (error) {
        console.error('Error parsing saved data:', error);
        localStorage.removeItem('oceanExplorerAuthData');
      }
    }
    
    if (savedView) {
      setAuthView(savedView);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      fullName: formData.fullName,
      email: formData.email,
      rememberMe: formData.rememberMe,
      role: formData.role,
      institution: formData.institution
    };
    
    localStorage.setItem('oceanExplorerAuthData', JSON.stringify(dataToSave));
  }, [formData.fullName, formData.email, formData.rememberMe, formData.role, formData.institution]);

  useEffect(() => {
    localStorage.setItem('oceanExplorerAuthView', authView);
  }, [authView]);

  useEffect(() => {
    // Check if there's a pending chat state to restore after login
    const checkPendingChat = () => {
      const pendingChat = localStorage.getItem('pendingChatState');
      const user = localStorage.getItem('currentUser');
      
      if (user && pendingChat) {
        // User just logged in and there's a pending chat
        setTimeout(() => {
          localStorage.removeItem('pendingChatState');
          window.location.href = '/'; // Redirect back to chat
        }, 1000);
      }
    };

    checkPendingChat();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.role !== 'general' && !formData.institution.trim()) {
      newErrors.institution = 'Institution is required for this role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignInForm = async () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    // Check if user exists for signin
    try {
      const existingUser = await getUserByEmail(formData.email);
      if (!existingUser) {
        newErrors.email = 'No account found with this email. Please sign up first.';
      }
    } catch (error) {
      newErrors.submit = 'Error checking user. Please try again.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setSignupStep(2);
    }
  };

  const handleBackStep = () => {
    setSignupStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authView === 'signup') {
      if (signupStep === 1) {
        handleNextStep(e);
        return;
      }
      
      if (!validateStep2()) return;
    } else {
      if (!await validateSignInForm()) return;
    }
    
    setIsLoading(true);
    
    try {
      if (authView === 'signup') {
        // Create new user in database
        const userData = {
          name: formData.fullName,
          email: formData.email,
          phone: '', // Default empty phone
          username: formData.email.split('@')[0],
          userType: formData.role,
          institution: formData.role !== 'general' ? formData.institution : '',
          accountType: "Basic",
          preferences: {
            theme: "light",
            notifications: true,
            language: "english"
          }
        };
        
        const newUser = await createUser(userData);
        
        if (!newUser) {
          throw new Error('Failed to create user');
        }
        
        // Save current user to localStorage for auth persistence
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Call the login function from context to update global state
        login(newUser);
        
        // Set success message instead of alert
        setSuccessMessage('Account created successfully! Redirecting...');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 150);
      } else {
        // Sign in existing user
        const user = await getUserByEmail(formData.email);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // In a real app, you would verify the password against a hashed version
        // For this demo, we'll just check if password is not empty
        if (!formData.password) {
          throw new Error('Invalid password');
        }
        
        // Save current user to localStorage for auth persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Call the login function from context to update global state
        login(user);
        
        // Set success message instead of alert
        setSuccessMessage('Successfully signed in!');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 150);
      }
    } catch (error) {
      setErrors({ submit: `${authView === 'signin' ? 'Sign in' : 'Sign up'} failed. ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSignupStep1 = () => (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Begin Your Ocean Journey</h2>
        <p className="auth-subtitle">Create an account to explore marine wonders</p>
      </div>

      <form onSubmit={handleNextStep} className="auth-form">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
            />
          </div>
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password (min. 8 characters)"
              className={`form-input ${errors.password ? 'error' : ''}`}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            />
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <button 
          type="submit" 
          className="auth-button"
        >
          Next Step
          <ChevronRight size={18} />
        </button>
      </form>

      <div className="auth-footer">
        <p className="footer-text">
          Already have an account? 
          <button 
            onClick={() => {
              setAuthView('signin');
              setSignupStep(1);
            }} 
            className="auth-link"
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );

  const renderSignupStep2 = () => (
    <>
      <div className="auth-header">
        <h2 className="auth-title">Tell Us About Yourself</h2>
        <p className="auth-subtitle">Help us personalize your experience</p>
        <div className="signup-progress">
          <div className="progress-step active"></div>
          <div className="progress-step active"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="role" className="form-label">I am a...</label>
          <div className="role-options">
            <label className={`role-option ${formData.role === 'general' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="general"
                checked={formData.role === 'general'}
                onChange={handleInputChange}
              />
              <div className="role-content">
                <User size={20} />
                <span>General User</span>
              </div>
            </label>
            
            <label className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleInputChange}
              />
              <div className="role-content">
                <GraduationCap size={20} />
                <span>Student</span>
              </div>
            </label>
            
            <label className={`role-option ${formData.role === 'researcher' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="researcher"
                checked={formData.role === 'researcher'}
                onChange={handleInputChange}
              />
              <div className="role-content">
                <FlaskConical size={20} />
                <span>Researcher</span>
              </div>
            </label>
            
            <label className={`role-option ${formData.role === 'scientist' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="scientist"
                checked={formData.role === 'scientist'}
                onChange={handleInputChange}
              />
              <div className="role-content">
                <FlaskConical size={20} />
                <span>Scientist</span>
              </div>
            </label>
          </div>
        </div>

        {(formData.role === 'student' || formData.role === 'researcher' || formData.role === 'scientist') && (
          <div className="form-group">
            <label htmlFor="institution" className="form-label">Institution / Organization</label>
            <div className="input-wrapper">
              <Building size={18} className="input-icon" />
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="Enter your institution or organization"
                className={`form-input ${errors.institution ? 'error' : ''}`}
              />
            </div>
            {errors.institution && <span className="error-text">{errors.institution}</span>}
          </div>
        )}

        <div className="form-buttons">
          <button 
            type="button" 
            className="auth-button secondary"
            onClick={handleBackStep}
            disabled={isLoading}
          >
            Back
          </button>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <ChevronRight size={18} />}
          </button>
        </div>

        {errors.submit && <span className="error-text submit-error">{errors.submit}</span>}
      </form>

      <div className="auth-footer">
        <p className="terms">
          By creating an account, you agree to our 
          <a href="#terms" className="link"> Terms of Service</a> and 
          <a href="#privacy" className="link"> Privacy Policy</a>
        </p>
      </div>
    </>
  );

  return (
    <div className="ocean-auth-container">
      <div className="ocean-background">
        {/* Animated ocean background elements */}
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
      </div>
      
      <div className="auth-content-container">
        <div className="auth-content">
          {/* Left Panel with Ocean Theme */}
          <div className="left-panel">
            <div className="logo">
              <Waves size={32} color="#ffd700" />
              <h1 className="text-[2rem] font-bold text-white">OceanExplorer</h1>
            </div>
            
            <h2 className="tagline">Dive Into the Depths of Knowledge</h2>
            
            <div className="divider"></div>
            
            <div className="features">
              <h3 className="features-title">What awaits beneath the surface?</h3>
              <ul className="features-list">
                <li className="feature-item"><Fish size={18} color="#ffd700" /> Discover fascinating marine ecosystems</li>
                <li className="feature-item"><Compass size={18} color="#ffd700" /> Navigate through ocean conservation efforts</li>
                <li className="feature-item"><Waves size={18} color="#ffd700" /> Explore the wonders of marine biodiversity</li>
              </ul>
            </div>
            
            <div className="quote">
              <p className="quote-text">"The ocean is a mighty harmonist." - William Wordsworth</p>
            </div>
          </div>
          
          {/* Right Panel with Form */}
          <div className="right-panel">
            <div className="auth-card">
              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}
              
              {authView === 'signin' && (
                <>
                  <div className="auth-header">
                    <h2 className="auth-title">Welcome Back!</h2>
                    <p className="auth-subtitle">Sign in to continue your exploration</p>
                  </div>
                  

                  <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <div className="input-wrapper">
                        <Mail size={18} className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                      </div>
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className={`form-input ${errors.password ? 'error' : ''}`}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        />
                        <span>Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        className="forgot-password"
                        onClick={() => setAuthView('forgot')}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      className="auth-button"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Login to your account'}
                      {!isLoading && <ChevronRight size={18} />}
                    </button>
                     
                    {errors.submit && <span className="error-text submit-error">{errors.submit}</span>}
                  </form>
                   <div className="divider">
                    <span className="divider-text">or continue with email</span>
                  </div>
                    <div className="social-buttons">
                    <button className="social-btn google-btn">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjUgOS4yMDQ1NUMxNi41IDguNTY2MzYgMTYuNDQ1NSA3Ljk1MjczIDE2LjM0MDkgNy4zNjM2NEg5VjEwLjg0NUgxMy4yOTU1QzEzLjExNTkgMTEuOTcgMTIuNDc3MyAxMi45MjMyIDExLjQ4NjQgMTMuNTYxNFYxNS42MTk2SDE0LjExMzZDMTUuNjE4MiAxNC4yNTI3IDE2LjUgMTIuMTYzNiAxNi41IDkuMjA0NVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTkgMTdDMTEuMjE1OSAxNyAxMy4xMDY4IDE2LjI1NDUgMTQuMTEzNiAxNS4wMTkxTDExLjQ4NjQgMTMuNTYxNEMxMC43ODY0IDE0LjA2MTQgOS44NjgxOCAxNC4zODQxIDguODYzNjQgMTMuMzg0MVE2Ljc1IDEzLjM4NDEgNC45OTA5MSAxMS45NzI3IDQuMzM4NjQgOS45OTU0NUgxLjYxMzY0VjEyLjEzMThDMi42MDkwOSAxNC4xNjU5IDQuNjY4MTggMTUuMTU5MSA5IDE1LjE1OTFWMTdaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik00LjMzODY0IDkuOTk1NDVDNC4xMzE4MiA5LjM5NTQ1IDQuMDIyNzMgOC43NSA0LjAyMjczIDguMDgxODJDNC4wMjI3MyA3LjQxMzY0IDQuMTMxODIgNi43NjgxOCA0LjMzODY0IDYuMTY4MThWNC4wMzQ1NUgxLjYxMzY0QzAuOTIwNDU1IDUuNDM0NTUgMC41IDcuMDAwNDUgMC41IDguNTgyMjdDMC41IDEwLjE2NDEgMC45MjA0NTUgMTEuNzMgMS42MTM2NCAxMy4xM0w0LjMzODY0IDExLjAwVjkuOTk1NDVaIiBmaWxsPSIjRkJCMzU1Ii8+CjxwYXRoIGQ9Ik05IDMuNDA5MDlDMTAuMTkzMiAzLjQwOTA5IDExLjI1NDUgMy43OTA5MSAxMi4xMTM2IDQuNTMxODJMMTQuMTcwNSAyLjQ3NDU1QzEyLjk1NDUgMS4zNTg2NCAxMS4yMTU5IDAuNjkyNzI3IDkgMC42OTI3MjdDNC42NjgxOCAwLjY5MjcyNyAyLjYwOTA5IDIuNTc0NTUgMS42MTM2NCA0LjYwNTQ1TDQuMzM4NjQgNi43NDM2NEM0Ljk5MDkxIDQuNzc5NTUgNi43NSAzLjQwOTA5IDkgMy40MDkwOVoiIGZpbGw9IiVFQTQzMzUiLz4KPC9zdmc+Cg==" alt="Google" className="social-icon" />
                      Sign in with Google
                    </button>
                    <button className="social-btn facebook-btn">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDkuMDZDMTcgNC41NCAxMy4xOSAwLjg2IDguNTUgMS4wMkM0LjMgMS4xNyAxIDQuNzcgMSA5QzEgMTMuMjQgNC4zMSAxNi45IDguNTUgMTdDOS42MSAxNy4wMiAxMC42NCAxNi44MiAxMS41NyAxNi40NVYxMS41SDkuNVY5LjVINy41VjhoMi41VjYuNUM5LjUgNS42NyA5LjgzIDQuNSAxMS41IDQuNUgxM1Y2SDEyQzExLjQ1IDYgMTEgNi40NSAxMSA3VjhIMTNWOUgxMVYxNi40N0MxMC42NCAxNi42MiAxMC4zMiAxNi43NCAxMCAxNi44MkM2LjY5IDE3LjIzIDQgMTQuMjMgNCAxMC41QzQgNi43NyA2Ljc3IDQgMTAuNSA0QzE0LjIzIDQgMTcgNi43NyAxNyAxMC41VjkuMDZaIiBmaWxsPSIjMTg3N0YyIi8+Cjwvc3ZnPgo=" alt="Facebook" className="social-icon" />
                      Sign in with Facebook
                    </button>
                  </div>

                  <div className="auth-footer">
                    <p className="footer-text">
                      New to OceanExplorer? 
                      <button 
                        onClick={() => {
                          setAuthView('signup');
                          setSignupStep(1);
                        }} 
                        className="auth-link"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </>
              )}

              {authView === 'signup' && (
                <>
                  {signupStep === 1 ? renderSignupStep1() : renderSignupStep2()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};