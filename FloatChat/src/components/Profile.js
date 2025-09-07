import React, { useState } from 'react';
import { User, Mail, Building, Calendar, Edit3, Save, X, Camera } from 'lucide-react';
import './Profile.css';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    category: 'Business Owner',
    organization: 'Tech Solutions Inc.',
    joinDate: 'January 15, 2024',
    bio: 'Passionate about AI and technology solutions. Leading digital transformation initiatives.',
    avatar: null
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <div className="profile-avatar">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" />
                ) : (
                  <User size={48} />
                )}
              </div>
              {isEditing && (
                <button className="avatar-edit-btn">
                  <Camera size={16} />
                </button>
              )}
            </div>
            <div className="avatar-info">
              <h2>{profileData.fullName}</h2>
              <p>{profileData.category}</p>
              <span className="join-date">
                <Calendar size={14} />
                Joined {profileData.joinDate}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={handleEdit}>
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="details-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">
                    <User size={16} />
                    <span>{profileData.fullName}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">
                    <Mail size={16} />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Category</label>
                {isEditing ? (
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Business Owner">Business Owner</option>
                    <option value="Employee">Employee</option>
                    <option value="Student">Student</option>
                    <option value="Organization">Organization</option>
                  </select>
                ) : (
                  <div className="form-display">
                    <Building size={16} />
                    <span>{profileData.category}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Organization</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="organization"
                    value={editData.organization}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">
                    <Building size={16} />
                    <span>{profileData.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>About</h3>
            <div className="form-group">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="bio-display">
                  <p>{profileData.bio}</p>
                </div>
              )}
            </div>
          </div>

          <div className="details-section">
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">1,247</div>
                <div className="stat-label">Messages Sent</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">89</div>
                <div className="stat-label">Days Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
