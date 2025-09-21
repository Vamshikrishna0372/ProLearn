import { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBook,
  FaBars,
  FaBell,
  FaChevronRight,
  FaPlayCircle,
  FaCogs,
  FaArrowLeft,
  FaEnvelope,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [avatar, setAvatar] = useState(
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("main"); // main | myCourses | contact | settings
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [visibleMyCourses, setVisibleMyCourses] = useState(4);
  const [visibleAllCourses, setVisibleAllCourses] = useState(4);

  const navigate = useNavigate();
  const location = useLocation();
  const allCoursesRef = useRef(null);

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = localUser._id;

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(
          `https://prolearn-backend-5uot.onrender.com/api/auth/${userId}`
        );
        if (res.data.success && res.data.user) {
          setUserName(res.data.user.name || res.data.user.fullName || "Student");
          setAvatar(
            res.data.user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          );
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  // Dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://prolearn-backend-5uot.onrender.com/api/courses"
        );
        const data = await res.json();
        if (data.success) {
          const coursesWithProgress = await Promise.all(
            data.courses.map(async (course) => {
              let progressData = { currentProgress: 0, lastWatched: null };
              if (userId) {
                const progressRes = await fetch(
                  `https://prolearn-backend-5uot.onrender.com/api/progress/${userId}/${course._id}`
                );
                const progressJson = await progressRes.json();
                if (progressJson.success) progressData = progressJson.progress;
              }
              return {
                ...course,
                progress: progressData.currentProgress,
                lastLesson:
                  progressData.lastWatched !== null
                    ? course.videos[progressData.lastWatched]?.title
                    : "Not started",
              };
            })
          );
          setMyCourses(coursesWithProgress.filter((c) => c.progress > 0));
          setAllCourses(coursesWithProgress.filter((c) => c.progress === 0));
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, [userId]);

  // Handle search Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      if (allCoursesRef.current) {
        allCoursesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // View toggles
  const goToMyCoursesView = () => {
    setView("myCourses");
    setMenuOpen(false);
    setDropdownOpen(false);
  };
  const goToContactView = () => {
    setView("contact");
    setMenuOpen(false);
    setDropdownOpen(false);
  };
  const goToSettingsView = () => {
    setView("settings");
    setMenuOpen(false);
    setDropdownOpen(false);
  };
  const goBackToMain = () => setView("main");

  // Start course
  const startCourse = (course) => {
    setMyCourses((prev) => [...prev, { ...course }]);
    setAllCourses((prev) => prev.filter((c) => c._id !== course._id));
    navigate(`/course/${course._id}`);
  };

  const handleSidebarLink = (path) => {
    if (location.pathname !== path) navigate(path);
    setMenuOpen(false);
  };

  // Filter courses
  const filteredMyCourses = myCourses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAllCourses = allCourses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinueLearning = () => {
    const el = document.getElementById("all-courses-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="prolearn-dashboard">
      {/* Header */}
      <header className="pl-header">
        <div className="pl-header-left">
          <button
            className="pl-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>
          <h1 className="pl-logo">ProLearn</h1>
        </div>

        {/* Search bar */}
        <div className="pl-header-center">
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
          />
        </div>

        <div className="pl-header-right">
          <button
            className="pl-theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle Theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <FaBell className="pl-icon-btn" />
          <div
            className="pl-user-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="pl-user-icon" />
            {dropdownOpen && (
              <div className="pl-dropdown-menu">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                  👤 Profile
                </Link>
                <button onClick={goToMyCoursesView}>📚 My Courses</button>
                <button onClick={goToContactView}>✉️ Contact Us</button>
                <button onClick={goToSettingsView}>⚙️ Settings</button>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`pl-sidebar ${menuOpen ? "show" : ""}`}>
        <button
          className="pl-sidebar-back-btn"
          onClick={() => setMenuOpen(false)}
        >
          <FaArrowLeft /> Back
        </button>

        <div className="pl-sidebar-user">
          <img src={avatar} alt="User Avatar" className="pl-sidebar-avatar" />
          <p className="pl-sidebar-username">{userName}</p>
        </div>
        <nav className="pl-sidebar-nav">
          <button
            className={`pl-sidebar-link ${
              location.pathname === "/dashboard" && view === "main"
                ? "active"
                : ""
            }`}
            onClick={() => {
              goBackToMain();
              handleSidebarLink("/dashboard");
            }}
          >
            <FaBook /> Dashboard
          </button>
          <button
            className={`pl-sidebar-link ${
              location.pathname === "/profile" ? "active" : ""
            }`}
            onClick={() => handleSidebarLink("/profile")}
          >
            <FaUserCircle /> Profile
          </button>
          <button
            className={`pl-sidebar-link ${view === "myCourses" ? "active" : ""}`}
            onClick={goToMyCoursesView}
          >
            <FaPlayCircle /> My Courses
          </button>
          <button
            className={`pl-sidebar-link ${view === "contact" ? "active" : ""}`}
            onClick={goToContactView}
          >
            <FaEnvelope /> Contact Us
          </button>
          <button
            className={`pl-sidebar-link ${view === "settings" ? "active" : ""}`}
            onClick={goToSettingsView}
          >
            <FaCogs /> Settings
          </button>
        </nav>
        <button
          className="pl-sidebar-logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="pl-main-content">
        {/* Hero & Courses Sections */}
        {view === "main" && (
          <>
            {/* Hero */}
            <section className="pl-hero-section">
              <div className="pl-hero-content">
                <h2 className="pl-hero-title">
                  Hello, <span className="pl-highlight-text">{userName}</span>! 👋
                </h2>
                <p className="pl-hero-subtitle">
                  Ready to learn something new today?
                </p>
                <div className="pl-quick-actions">
                  <button
                    className="pl-btn-primary"
                    onClick={handleContinueLearning}
                  >
                    <FaPlayCircle /> Continue Learning
                  </button>
                  <button
                    className="pl-btn-secondary"
                    onClick={() =>
                      document
                        .getElementById("all-courses-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <FaBook /> Explore Courses
                  </button>
                </div>
              </div>
              <div className="pl-hero-image-container">
                <img
                  src="https://adroittechnologies.in/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-24-at-16.47.48.jpeg"
                  alt="Learning banner"
                  className="pl-hero-image"
                />
              </div>
            </section>

            {/* My Courses */}
            <section className="pl-course-section" id="my-courses-section">
              <h3 className="pl-section-title">My Courses</h3>
              <div className="pl-course-grid">
                {filteredMyCourses.length === 0 && <p>No enrolled courses yet.</p>}
                {filteredMyCourses
                  .slice(0, visibleMyCourses)
                  .map((course) => (
                    <div key={course._id} className="pl-course-card">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="pl-course-thumbnail"
                      />
                      <div className="pl-card-body">
                        <h4 className="pl-card-title">{course.title}</h4>
                        <div className="pl-progress-bar-container">
                          <div
                            className="pl-progress-bar"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="pl-progress-text">
                          {course.progress}% Complete
                        </p>
                        <p className="pl-last-lesson">
                          Last lesson: <b>{course.lastLesson}</b>
                        </p>
                        <button
                          className="pl-continue-btn"
                          onClick={() => navigate(`/course/${course._id}`)}
                        >
                          Continue <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {visibleMyCourses < filteredMyCourses.length && (
                <button
                  className="pl-show-more-btn"
                  onClick={() => setVisibleMyCourses((prev) => prev + 4)}
                >
                  Show More
                </button>
              )}
            </section>

            {/* Explore More */}
            <section
              className="pl-explore-section"
              id="all-courses-section"
              ref={allCoursesRef}
            >
              <h3 className="pl-section-title">Explore More Courses</h3>
              <div className="pl-course-grid">
                {filteredAllCourses.length === 0 && <p>No matching courses found.</p>}
                {filteredAllCourses
                  .slice(0, visibleAllCourses)
                  .map((course) => (
                    <div key={course._id} className="pl-course-card">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="pl-course-thumbnail"
                      />
                      <div className="pl-card-body">
                        <h4 className="pl-card-title">{course.title}</h4>
                        <div className="pl-progress-bar-container">
                          <div
                            className="pl-progress-bar"
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="pl-progress-text">
                          {course.progress || 0}% Complete
                        </p>
                        <button
                          className="pl-continue-btn"
                          onClick={() => startCourse(course)}
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {visibleAllCourses < filteredAllCourses.length && (
                <button
                  className="pl-show-more-btn"
                  onClick={() => setVisibleAllCourses((prev) => prev + 4)}
                >
                  Show More
                </button>
              )}
            </section>
          </>
        )}

        {/* My Courses Full View */}
        {view === "myCourses" && (
          <section className="pl-course-section full-view">
            <div className="pl-my-courses-header">
              <button className="pl-back-btn" onClick={goBackToMain}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h3 className="pl-section-title">My Courses</h3>
            </div>
            <div className="pl-course-grid">
              {filteredMyCourses.length === 0 && (
                <p>No matching enrolled courses found.</p>
              )}
              {filteredMyCourses.map((course) => (
                <div key={course._id} className="pl-course-card">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="pl-course-thumbnail"
                  />
                  <div className="pl-card-body">
                    <h4 className="pl-card-title">{course.title}</h4>
                    <div className="pl-progress-bar-container">
                      <div
                        className="pl-progress-bar"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="pl-progress-text">{course.progress}% Complete</p>
                    <p className="pl-last-lesson">
                      Last lesson: <b>{course.lastLesson}</b>
                    </p>
                    <button
                      className="pl-continue-btn"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      Continue <FaChevronRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {view === "contact" && (
          <section className="pl-course-section full-view">
            <div className="pl-my-courses-header">
              <button className="pl-back-btn" onClick={goBackToMain}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h3 className="pl-section-title">Contact Us</h3>
            </div>
            <div className="pl-static-page">
              <p>
                Have questions or need help? Email us at{" "}
                <b>support@prolearn.com</b> or call <b>+91-98765-43210</b>.
              </p>
            </div>
          </section>
        )}

        {/* Settings */}
        {view === "settings" && (
          <section className="pl-course-section full-view">
            <div className="pl-my-courses-header">
              <button className="pl-back-btn" onClick={goBackToMain}>
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h3 className="pl-section-title">Settings</h3>
            </div>
            <div className="pl-static-page">
              <p>
                Settings options will appear here soon. You can manage
                notifications, account details, and preferences in upcoming
                updates.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="pl-footer">
        <p>© 2025 ProLearn. All rights reserved.</p>
      </footer>
    </div>
  );
}
