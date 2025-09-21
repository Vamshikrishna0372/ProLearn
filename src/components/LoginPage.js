import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Admin quick login
    if (
      !isSignup &&
      formData.email === "admin@gmail.com" &&
      formData.password === "@dmin"
    ) {
      localStorage.setItem("user", JSON.stringify({ role: "admin" }));
      toast.success("👑 Welcome Admin!", { position: "top-center", theme: "colored" });
      setTimeout(() => navigate("/admin"), 1500);
      return;
    }

    if (isSignup) {
      if (!isStrongPassword(formData.password)) {
        toast.error(
          "⚠️ Password must be 8+ chars with uppercase, lowercase, number & symbol",
          { position: "top-center", theme: "colored" }
        );
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("❌ Passwords do not match!", {
          position: "top-center",
          theme: "colored",
        });
        return;
      }

      try {
        const res = await axios.post("https://prolearn-backend-5uot.onrender.com/api/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          dob: formData.dob,
          phone: formData.phone,
        });

        if (res.data.success) {
          toast.success("🎉 Account created successfully! Please login.", {
            position: "top-center",
            theme: "colored",
          });
          setIsSignup(false);
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            dob: "",
            phone: "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed!", {
          position: "top-center",
          theme: "colored",
        });
      }
    } else {
      try {
        const res = await axios.post("https://prolearn-backend-5uot.onrender.com/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (res.data.success) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Login successful! Welcome back 🎓", {
            position: "top-center",
            theme: "colored",
          });
          setLoggedIn(true);
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed!", {
          position: "top-center",
          theme: "colored",
        });
      }
    }
  };

  const handleExplore = () => navigate("/explore-courses");

  return (
    <div className={`login-page ${darkMode ? "dark" : ""}`}>
      {/* Dark Mode Toggle */}
      <button
        className="mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* Left Section */}
      <div className="login-left">
        <div className="left-content">
          <h1>
            Welcome to <span>ProLearn</span>
          </h1>
          <p>
            Learn smarter, grow faster, and achieve your academic goals with{" "}
            <b>ProLearn</b>.
          </p>
          <img
            src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4664.jpg"
            alt="Learning Illustration"
          />
          {loggedIn && (
            <button className="explore-btn" onClick={handleExplore}>
              Continue Learning → Explore Courses
            </button>
          )}
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="login-right">
        <div className="form-box">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p>
            {isSignup
              ? "Sign up to start your learning journey."
              : "Login to continue your growth with ProLearn."}
          </p>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="signup-fields">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {isSignup && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}

            <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
          </form>

          <p className="toggle-text">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>

      <ToastContainer
        transition={Zoom}
        autoClose={2500}
        pauseOnHover
        closeOnClick
        draggable
      />
    </div>
  );
}
