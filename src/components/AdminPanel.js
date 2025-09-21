import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaBook,
  FaPlusCircle,
  FaUsers,
  FaBullhorn,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminPanel.css";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  // Courses state
  const [courses, setCourses] = useState([]);

  // Controlled form state for Add/Edit Course
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    thumbnail: "",
    instructor: "",
    videos: [{ title: "", url: "" }],
    price: "Free",
    active: true,
    rating: 0,
    duration: "",
  });

  const [editCourseId, setEditCourseId] = useState(null);

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("https://prolearn-backend-5uot.onrender.com/api/courses");
      const data = await res.json();
      if (data.success) setCourses(data.courses);
      else setCourses([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch courses");
    }
  };

  // Handle window resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 769);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("✅ Logged out successfully", {
      position: "top-center",
      theme: "colored",
    });
    setTimeout(() => navigate("/"), 700);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (isMobile) setSidebarOpen(false);
  };

  // Unified input handler
  const handleInputChange = (e, index = null, field = null) => {
    const { name, value, type, checked } = e.target;

    // checkbox for active
    if (name === "active") {
      setForm((f) => ({ ...f, active: checked }));
      return;
    }

    // video fields when index & field provided
    if (index !== null && field) {
      const updatedVideos = Array.isArray(form.videos) ? [...form.videos] : [{ title: "", url: "" }];
      updatedVideos[index] = { ...updatedVideos[index], [field]: value };
      setForm((f) => ({ ...f, videos: updatedVideos }));
      return;
    }

    // number input conversion
    if (type === "number") {
      setForm((f) => ({ ...f, [name]: value === "" ? "" : Number(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleAddVideo = () => {
    setForm((f) => ({ ...f, videos: [...(f.videos || []), { title: "", url: "" }] }));
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...(form.videos || [])];
    updatedVideos.splice(index, 1);
    setForm((f) => ({ ...f, videos: updatedVideos.length ? updatedVideos : [{ title: "", url: "" }] }));
  };

  const resetForm = () =>
    setForm({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      thumbnail: "",
      instructor: "",
      videos: [{ title: "", url: "" }],
      price: "Free",
      active: true,
      rating: 0,
      duration: "",
    });

  // Add or Update Course
  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.instructor.trim()) {
      toast.error("Title and Instructor are required", { position: "top-center" });
      return;
    }

    try {
      if (editCourseId) {
        // Update course
        const res = await fetch(`https://prolearn-backend-5uot.onrender.com/api/courses/${editCourseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("✏️ Course updated successfully", { position: "top-center" });
          fetchCourses();
          resetForm();
          setEditCourseId(null);
          setActiveSection("courses");
        } else {
          toast.error(data.message || "Failed to update course");
        }
      } else {
        // Add new course
        const res = await fetch("https://prolearn-backend-5uot.onrender.com/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("🎉 Course added successfully", { position: "top-center" });
          fetchCourses();
          resetForm();
          setActiveSection("courses");
        } else {
          toast.error(data.message || "Failed to add course");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Delete course (toast-confirm)
  const handleDeleteCourse = (id) => {
    // create toast with Yes/No buttons
    let toastId = toast(
      () => (
        <div style={{ padding: "6px 2px" }}>
          <div style={{ marginBottom: 8 }}>🗑️ Are you sure you want to delete this course?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="confirm-btn"
              onClick={async () => {
                try {
                  const res = await fetch(`https://prolearn-backend-5uot.onrender.com/api/courses/${id}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();
                  if (data.success) {
                    toast.success("✅ Course deleted successfully", { position: "top-center" });
                    setCourses((c) => c.filter((course) => course._id !== id));
                  } else {
                    toast.error(data.message || "Failed to delete course");
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Server error");
                } finally {
                  toast.dismiss(toastId);
                }
              }}
            >
              Yes
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                toast.dismiss(toastId);
                toast.info("Delete cancelled", { position: "top-center" });
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  // Edit course
  const handleEditCourse = (course) => {
    // build a safe form object (omit _id, createdAt, updatedAt)
    const safeForm = {
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "Beginner",
      thumbnail: course.thumbnail || "",
      instructor: course.instructor || "",
      videos: Array.isArray(course.videos) && course.videos.length ? course.videos : [{ title: "", url: "" }],
      price: course.price || "Free",
      active: typeof course.active === "boolean" ? course.active : true,
      rating: course.rating || 0,
      duration: course.duration || "",
    };
    setForm(safeForm);
    setEditCourseId(course._id);
    setActiveSection("add-course");
    if (isMobile) setSidebarOpen(false);
  };

  // Render dynamic sections
  const renderSection = () => {
    switch (activeSection) {
      case "courses":
        return (
          <div>
            <h2>Current Courses ({courses.length})</h2>
            <div className="courses-grid">
              {courses.map((c) => (
                <div className="course-card" key={c._id}>
                  <img
                    className="course-thumb"
                    src={c.thumbnail || "https://via.placeholder.com/240x135?text=No+Image"}
                    alt={c.title}
                  />
                  <div className="course-info">
                    <h3>{c.title}</h3>
                    <p className="muted">
                      {c.instructor} • {c.duration} • {c.level}
                    </p>
                    <p className="muted">
                      {c.category} • {c.price} • Rating: {c.rating}
                    </p>
                    <p className="muted">Status: {c.active ? "Active" : "Inactive"}</p>
                    <div className="course-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditCourse(c)}
                        title="Edit Course"
                      >
                        <FaPen />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCourse(c._id)}
                        title="Delete Course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "add-course":
        return (
          <form className="course-form" onSubmit={handleAddCourseSubmit}>
            <h2>{editCourseId ? "Edit Course" : "Add a New Course"}</h2>

            <label>
              Course Name
              <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Course Name"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Short summary for the course"
              />
            </label>

            <label>
              Category
              <input
                name="category"
                value={form.category}
                onChange={handleInputChange}
                placeholder="e.g., Web Dev, Data Science"
              />
            </label>

            <label>
              Level
              <select name="level" value={form.level} onChange={handleInputChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <label>
              Thumbnail URL
              <input
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleInputChange}
                placeholder="http(s)://..."
              />
            </label>

            <label>
              Instructor Name
              <input
                name="instructor"
                value={form.instructor}
                onChange={handleInputChange}
                placeholder="Instructor Name"
                required
              />
            </label>

            <label>
              Course Duration
              <input
                name="duration"
                value={form.duration}
                onChange={handleInputChange}
                placeholder="e.g., 6 weeks"
              />
            </label>

            <label>
              Price
              <select name="price" value={form.price} onChange={handleInputChange}>
                <option>Free</option>
                <option>Paid</option>
              </select>
            </label>

            <label>
              Rating
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleInputChange}
                placeholder="0-5"
              />
            </label>

            <label>
              Active Status
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleInputChange}
              />{" "}
              Active
            </label>

            <div className="videos-section">
              <h4>Videos</h4>
              {form.videos.map((v, index) => (
                <div key={index} className="video-row">
                  <input
                    name={`video-title-${index}`}
                    value={v.title}
                    onChange={(e) => handleInputChange(e, index, "title")}
                    placeholder="Video Title"
                  />
                  <input
                    name={`video-url-${index}`}
                    value={v.url}
                    onChange={(e) => handleInputChange(e, index, "url")}
                    placeholder="Video URL"
                  />
                  <button type="button" className="remove-video-btn" onClick={() => handleRemoveVideo(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddVideo} className="add-video-btn">
                + Add Video
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editCourseId ? "Update Course" : "Add Course"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  resetForm();
                  setEditCourseId(null);
                  setActiveSection("home");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "students":
        return (
          <div>
            <h2>Students Information</h2>
            <p className="muted">List and manage students here (placeholder).</p>
            <div className="placeholder-card">Student dashboard coming soon.</div>
          </div>
        );

      case "announcements":
        return (
          <div>
            <h2>Announcements</h2>
            <p className="muted">Create and broadcast announcements to learners.</p>
            <div className="placeholder-card">Announcements manager coming soon.</div>
          </div>
        );

      default:
        return (
          <div>
            <h2>Admin Home</h2>
            <p className="muted">Select a menu item to start managing ProLearn.</p>
            <div className="placeholder-card">Quick overview and recent activity go here.</div>
          </div>
        );
    }
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">Admin Panel</h2>
          <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            <FaBars />
          </button>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-item ${activeSection === "courses" ? "active" : ""}`}
            onClick={() => handleNavClick("courses")}
          >
            <FaBook className="nav-icon" />
            <span>Current Courses</span>
          </button>

          <button
            className={`nav-item ${activeSection === "add-course" ? "active" : ""}`}
            onClick={() => handleNavClick("add-course")}
          >
            <FaPlusCircle className="nav-icon" />
            <span>{editCourseId ? "Edit Course" : "Add Courses"}</span>
          </button>

          <button
            className={`nav-item ${activeSection === "students" ? "active" : ""}`}
            onClick={() => handleNavClick("students")}
          >
            <FaUsers className="nav-icon" />
            <span>Students Info</span>
          </button>

          <button
            className={`nav-item ${activeSection === "announcements" ? "active" : ""}`}
            onClick={() => handleNavClick("announcements")}
          >
            <FaBullhorn className="nav-icon" />
            <span>Announcements</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
            <FaBars />
          </button>
          <h1>Welcome, Admin!</h1>
          <div style={{ marginLeft: "auto" }}>
            <button className="header-logout" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        <section className="content">{renderSection()}</section>
      </main>

      <ToastContainer transition={Zoom} autoClose={2500} pauseOnHover closeOnClick draggable />
    </div>
  );
}
