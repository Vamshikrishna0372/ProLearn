import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaTrophy,
  FaCalendarAlt,
  FaSpinner,
  FaVenusMars,
  FaBirthdayCake,
  FaPhoneAlt,
  FaArrowLeft,
  FaCertificate,
  FaSignOutAlt,
  FaBookOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses"); // default tab
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return setLoading(false);

    const user = JSON.parse(storedUser);

    axios
      .get(`https://prolearn-backend-5uot.onrender.com/api/auth/${user._id}`)
      .then((res) => {
        if (res.data.success) setProfileData(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="pl-profile-container loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );

  if (!profileData)
    return (
      <div className="pl-profile-container no-profile">
        Profile data not found. Please log in.
      </div>
    );

  return (
    <div className="pl-profile-container">
      {/* Header Buttons */}
      <div className="pl-header-actions">
        <button className="pl-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <button className="pl-logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Avatar & Basic Info */}
      <div className="pl-profile-avatar-section">
        <FaUserCircle className="pl-profile-avatar" />
        <h1 className="pl-profile-name">{profileData.name}</h1>
        <p className="pl-profile-email">{profileData.email}</p>
      </div>

      {/* Profile Details */}
      <div className="pl-profile-details">
        {profileData.gender && (
          <div className="pl-profile-card">
            <FaVenusMars className="pl-icon" />
            <div>
              <h3>Gender</h3>
              <p>{profileData.gender}</p>
            </div>
          </div>
        )}
        {profileData.dob && (
          <div className="pl-profile-card">
            <FaBirthdayCake className="pl-icon" />
            <div>
              <h3>Date of Birth</h3>
              <p>{new Date(profileData.dob).toLocaleDateString()}</p>
            </div>
          </div>
        )}
        {profileData.phone && (
          <div className="pl-profile-card">
            <FaPhoneAlt className="pl-icon" />
            <div>
              <h3>Phone</h3>
              <p>{profileData.phone}</p>
            </div>
          </div>
        )}
        {profileData.joinDate && (
          <div className="pl-profile-card">
            <FaCalendarAlt className="pl-icon" />
            <div>
              <h3>Member Since</h3>
              <p>{new Date(profileData.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="pl-tabs">
        {profileData.courses?.length > 0 && (
          <button
            className={activeTab === "courses" ? "active" : ""}
            onClick={() => setActiveTab("courses")}
          >
            <FaBookOpen /> My Courses
          </button>
        )}
        {profileData.certificates?.length > 0 && (
          <button
            className={activeTab === "certificates" ? "active" : ""}
            onClick={() => setActiveTab("certificates")}
          >
            <FaCertificate /> Certificates
          </button>
        )}
        {profileData.badges?.length > 0 && (
          <button
            className={activeTab === "badges" ? "active" : ""}
            onClick={() => setActiveTab("badges")}
          >
            <FaTrophy /> Badges
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="pl-tab-content">
        {activeTab === "courses" && profileData.courses?.length > 0 && (
          <div className="pl-courses-grid">
            {profileData.courses.map((course, index) => (
              <div key={index} className="pl-course">
                <h4>{course.title}</h4>
                <p>Progress: {course.progress}%</p>
                {course.certificate?.earned && course.certificate?.link && (
                  <a
                    href={course.certificate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pl-download-btn"
                  >
                    📜 Download Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "certificates" && profileData.certificates?.length > 0 && (
          <div className="pl-certificates-grid">
            {profileData.certificates.map((cert, index) => (
              <div key={index} className="pl-certificate">
                <span className="pl-certificate-icon">📜</span>
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-certificate-name"
                >
                  {cert.title}
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === "badges" && profileData.badges?.length > 0 && (
          <div className="pl-badges-grid">
            {profileData.badges.map((badge, index) => (
              <div key={index} className="pl-badge">
                <span className="pl-badge-icon">{badge.icon}</span>
                <span className="pl-badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
