import React, { useState,useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, ArrowLeft, Waves, Fish, Compass } from 'lucide-react';
import './Authentication .css';

export const Authentication = () => {
  const [authView, setAuthView] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'swethabe14@gmail.com',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const savedData = localStorage.getItem('oceanExplorerAuthData');
    const savedView = localStorage.getItem('oceanExplorerAuthView');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData,
          // Don't load password and confirmPassword for security
          password: '',
          confirmPassword: ''
        }));
      } catch (error) {
        console.error('Error parsing saved data:', error);
        // Clear invalid data from localStorage
        localStorage.removeItem('oceanExplorerAuthData');
      }
    }
    
    if (savedView) {
      setAuthView(savedView);
    }
  }, []);

  // Save data to localStorage when formData changes
  useEffect(() => {
    const dataToSave = {
      fullName: formData.fullName,
      email: formData.email,
      rememberMe: formData.rememberMe
      // Don't save passwords to localStorage for security
    };
    
    localStorage.setItem('oceanExplorerAuthData', JSON.stringify(dataToSave));
  }, [formData.fullName, formData.email, formData.rememberMe]);

  // Save current view to localStorage
  useEffect(() => {
    localStorage.setItem('oceanExplorerAuthView', authView);
  }, [authView]);


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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (authView === 'signup' && !formData.fullName.trim()) {
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
    
    if (authView === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(authView === 'signin' ? 'Successfully signed in!' : 'Account created successfully!');
    } catch (error) {
      setErrors({ submit: `${authView === 'signin' ? 'Sign in' : 'Sign up'} failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="logo-text">OceanExplorer</h1>
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
              {authView === 'signin' && (
                <>
                  <div className="auth-header">
                    <h2 className="auth-title">Welcome Back!</h2>
                    <p className="auth-subtitle">Sign in to continue your exploration</p>
                  </div>

                  <div className="social-buttons">
                    <button className="social-btn google-btn">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjUgOS4yMDQ1NUMxNi41IDguNTY2MzYgMTYuNDQ1NSA3Ljk1MjczIDE2LjM0MDkgNy4zNjM2NEg5VjEwLjg0NUgxMy4yOTU1QzEzLjExNTkgMTEuOTcgMTIuNDc3MyAxMi45MjMyIDExLjQ4NjQgMTMuNTYxNFYxNS42MTk2SDE0LjExMzZDMTUuNjE4MiAxNC4yNTI3IDE2LjUgMTIuMTYzNiAxNi41IDkuMjA0NVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTkgMTdDMTEuMjE1OSAxNyAxMy4xMDY4IDE2LjI1NDUgMTQuMTEzNiAxNS4wMTkxTDExLjQ4NjQgMTMuNTYxNEMxMC43ODY0IDE0LjA2MTQgOS44NjgxOCAxNC4zODQxIDguODYzNjQgMTMuMzg0MVE2Ljc1IDEzLjM4NDEgNC45OTA5MSAxMS45NzI3IDQuMzM4NjQgOS45OTU0NUgxLjYxMzY0VjEyLjEzMThDMi42MDkwOSAxNC4xNjU5IDQuNjY4MTggMTUuMTU5MSA5IDE1LjE1OTFWMTdaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik00LjMzODY0IDkuOTk1NDVDNC4xMzE4MiA5LjM5NTQ1IDQuMDIyNzMgOC43NSA0LjAyMjczIDguMDgxODJDNC4wMjI3MyA3LjQxMzY0IDQuMTMxODIgNi43NjgxOCA0LjMzODY0IDYuMTY4MThWNC4wMzQ1NUgxLjYxMzY0QzAuOTIwNDU1IDUuNDM0NTUgMC41IDcuMDAwNDUgMC41IDguNTgyMjdDMC41IDEwLjE2NDEgMC45MjA0NTUgMTEuNzMgMS42MTM2NCAxMy4xM0w0LjMzODY0IDExLjAwVjkuOTk1NDVaIiBmaWxsPSIjRkJCMzU1Ii8+CjxwYXRoIGQ9Ik05IDMuNDA5MDlDMTAuMTkzMiAzLjQwOTA5IDExLjI1NDUgMy43OTA5MSAxMi4xMTM2IDQuNTMxODJMMTQuMTcwNSAyLjQ3NDU1QzEyLjk1NDUgMS4zNTg2NCAxMS4yMTU5IDAuNjkyNzI3IDkgMC42OTI3MjdDNC42NjgxOCAwLjY5MjcyNyAyLjYwOTA5IDIuNTc0NTUgMS42MTM2NCA0LjYwNTQ1TDQuMzM4NjQgNi43NDM2NEM0Ljk5MDkxIDQuNzc5NTUgNi43NSAzLjQwOTA5IDkgMy40MDkwOVoiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+Cg==" alt="Google" className="social-icon" />
                      Sign in with Google
                    </button>
                    <button className="social-btn facebook-btn">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDkuMDZDMTcgNC41NCAxMy4xOSAwLjg2IDguNTUgMS4wMkM0LjMgMS4xNyAxIDQuNzcgMSA5QzEgMTMuMjQgNC4zMSAxNi45IDguNTUgMTdDOS42MSAxNy4wMiAxMC42NCAxNi44MiAxMS41NyAxNi40NVYxMS41SDkuNVY5LjVINy41VjhoMi41VjYuNUM5LjUgNS42NyA5LjgzIDQuNSAxMS41IDQuNUgxM1Y2SDEyQzExLjQ1IDYgMTEgNi40NSAxMSA3VjhIMTNWOUgxMVYxNi40N0MxMC42NCAxNi42MiAxMC4zMiAxNi43NCAxMCAxNi44MkM2LjY5IDE3LjIzIDQgMTQuMjMgNCAxMC41QzQgNi43NyA2Ljc3IDQgMTAuNSA0QzE0LjIzIDQgMTcgNi43NyAxNyAxMC41VjkuMDZaIiBmaWxsPSIjMTg3N0YyIi8+Cjwvc3ZnPgo=" alt="Facebook" className="social-icon" />
                      Sign in with Facebook
                    </button>
                  </div>

                  <div className="divider">
                    <span className="divider-text">or continue with email</span>
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

                  <div className="auth-footer">
                    <p className="footer-text">
                      Don't have an account? 
                      <button 
                        onClick={() => setAuthView('signup')} 
                        className="auth-link"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </>
              )}

              {authView === 'signup' && (
                <>
                  <div className="auth-header">
                    <h2 className="auth-title">Begin Your Ocean Journey</h2>
                    <p className="auth-subtitle">Create an account to explore marine wonders</p>
                  </div>

                  <form onSubmit={handleSubmit} className="auth-form">
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
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                      {!isLoading && <ChevronRight size={18} />}
                    </button>

                    {errors.submit && <span className="error-text submit-error">{errors.submit}</span>}
                  </form>

                  <div className="auth-footer">
                    <p className="footer-text">
                      Already have an account? 
                      <button 
                        onClick={() => setAuthView('signin')} 
                        className="auth-link"
                      >
                        Sign in
                      </button>
                    </p>
                    <p className="terms">
                      By creating an account, you agree to our 
                      <a href="#terms" className="link"> Terms of Service</a> and 
                      <a href="#privacy" className="link"> Privacy Policy</a>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
