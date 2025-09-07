import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building, Users, Briefcase } from 'lucide-react';
import './Authentication.css';

export const Authentication = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    category: '',
    organization: ''
  });

  const categories = [
    { id: 'business', label: 'Business Owner', icon: Briefcase, description: 'Manage your business operations' },
    { id: 'employee', label: 'Employee', icon: Users, description: 'Access team collaboration tools' },
    { id: 'student', label: 'Student', icon: User, description: 'Educational and learning support' },
    { id: 'organization', label: 'Organization', icon: Building, description: 'Enterprise-level solutions' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle authentication
    console.log('Form submitted:', formData);
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({
      ...formData,
      category: categoryId
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">FC</div>
              <h1>FloatChat</h1>
            </div>
            <p className="auth-subtitle">
              {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in to continue'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Your Category</label>
                  <div className="category-grid">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`category-card ${formData.category === category.id ? 'selected' : ''}`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <category.icon size={24} className="category-icon" />
                        <div className="category-content">
                          <h4>{category.label}</h4>
                          <p>{category.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.category === 'organization' && (
                  <div className="form-group">
                    <label htmlFor="organization">Organization Name</label>
                    <div className="input-wrapper">
                      <Building size={20} className="input-icon" />
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Enter your organization name"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" className="auth-submit">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* {!isSignUp && (
            <div className="auth-footer">
              <a className="forgot-password">Forgot your password?</a>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
