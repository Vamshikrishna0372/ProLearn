import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  // Scroll to terms section
  const scrollToTerms = () => {
    document.getElementById("terms-section").scrollIntoView({ behavior: "smooth" });
  };

  // Handle confirm button
  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      navigate("/login"); // navigate to Login page
    }, 1500);
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="logo">📘 ProLearn</h1>
        <nav>
          <a href="#courses">Courses</a>
          <a href="#community">Community</a>
          <a href="#terms-section">Terms</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>
            Transform Your Learning Journey with <span>ProLearn</span>
          </h2>
          <p>
            Join live classes, explore video lessons, and get mentored by
            top educators. With ProLearn, learning becomes interactive,
            affordable, and fun for every student.
          </p>
          <button className="start-btn" onClick={scrollToTerms}>
            🚀 Get Started
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://img.freepik.com/free-photo/group-happy-students_1098-3438.jpg"
            alt="Students Learning"
          />
        </div>
      </section>

      {/* Highlights */}
      <section className="highlights">
        <h3>Why Choose ProLearn?</h3>
        <div className="highlight-cards">
          <div className="highlight-card">
            <img
              src="https://img.freepik.com/free-vector/webinar-concept-illustration_114360-4764.jpg"
              alt="Live Classes"
            />
            <h4>Live & Interactive</h4>
            <p>Attend engaging live classes and get instant doubt resolution.</p>
          </div>
          <div className="highlight-card">
            <img
              src="https://img.freepik.com/free-vector/online-tutor-concept_23-2148503066.jpg"
              alt="Mentorship"
            />
            <h4>Expert Mentorship</h4>
            <p>Personal guidance from top mentors to keep you motivated.</p>
          </div>
          <div className="highlight-card">
            <img
              src="https://img.freepik.com/free-vector/education-concept-illustration_114360-593.jpg"
              alt="Affordable"
            />
            <h4>Affordable Learning</h4>
            <p>Access premium education at student-friendly prices.</p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="courses" id="courses">
        <h3>Explore Our Popular Courses</h3>
        <div className="course-list">
          <div className="course">
            <img
              src="https://img.freepik.com/free-vector/maths-education-background_23-2148144570.jpg"
              alt="Math"
            />
            <h4>Mathematics</h4>
            <p>Build strong fundamentals and sharpen your problem-solving skills.</p>
          </div>
          <div className="course">
            <img
              src="https://img.freepik.com/free-vector/science-education-background_23-2148495943.jpg"
              alt="Science"
            />
            <h4>Science</h4>
            <p>Understand concepts through engaging experiments & visuals.</p>
          </div>
          <div className="course">
            <img
              src="https://img.freepik.com/free-vector/app-development-illustration_52683-47931.jpg"
              alt="Coding"
            />
            <h4>Programming</h4>
            <p>Learn coding from scratch and build apps, games, and websites.</p>
          </div>
          <div className="course">
            <img
              src="https://img.freepik.com/free-vector/english-learning-concept_23-2148721445.jpg"
              alt="English"
            />
            <h4>English & Communication</h4>
            <p>Improve communication skills and ace competitive exams.</p>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="community" id="community">
        <div className="community-text">
          <h3>Join 10,000+ Learners 🌍</h3>
          <p>
            Become part of a vibrant student community where knowledge is
            shared, doubts are solved, and success is celebrated together.
          </p>
        </div>
        <div className="community-image">
          <img
            src="https://img.freepik.com/free-photo/diverse-group-students-studying_53876-137029.jpg"
            alt="Community"
          />
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="terms" id="terms-section">
        <label>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />{" "}
          I accept all Terms & Conditions of ProLearn
        </label>
        <br />
        <button
          className={`accept-btn ${confirmed ? "confirmed" : ""}`}
          disabled={!accepted}
          onClick={handleConfirm}
        >
          {confirmed ? "🎉 Confirmed!" : "Confirm & Continue"}
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2025 <span>ProLearn</span>. Empowering Education for Everyone.
        </p>
      </footer>

      {/* Internal CSS */}
      <style>{`
        .homepage {
          font-family: 'Segoe UI', sans-serif;
          background: #fdfdfd;
          color: #1f2937;
          min-height: 100vh;
        }

        /* Navbar */
        .navbar {
          padding: 1rem 2rem;
          background: linear-gradient(90deg, #2563eb, #9333ea);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .navbar nav a {
          margin: 0 1rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
        }
        .navbar nav a:hover {
          text-decoration: underline;
        }

        /* Hero */
        .hero {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          flex-wrap: wrap;
        }
        .hero-text {
          flex: 1;
          padding: 1rem;
        }
        .hero-text h2 {
          font-size: 2.8rem;
          margin-bottom: 1rem;
        }
        .hero-text span {
          color: #facc15;
        }
        .hero-text p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        .hero-image img {
          width: 350px;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .start-btn {
          background: #facc15;
          color: black;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1.1rem;
          transition: transform 0.3s, background 0.3s;
        }
        .start-btn:hover {
          background: #eab308;
          transform: scale(1.05);
        }

        /* Highlights */
        .highlights {
          padding: 3rem 2rem;
          background: #f9fafb;
          text-align: center;
        }
        .highlight-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }
        .highlight-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          max-width: 260px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .highlight-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .highlight-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        /* Courses */
        .courses {
          padding: 3rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, #fef3c7, #dbeafe);
        }
        .course-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }
        .course {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          max-width: 250px;
          transition: transform 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .course:hover {
          transform: scale(1.05);
        }
        .course img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        /* Community */
        .community {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 3rem 2rem;
          background: #f9fafb;
          flex-wrap: wrap;
        }
        .community-text {
          max-width: 500px;
        }
        .community-text h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #2563eb;
        }
        .community-image img {
          width: 300px;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        /* Terms */
        .terms {
          text-align: center;
          padding: 2.5rem;
          background: #f3f4f6;
        }
        .accept-btn {
          margin-top: 1.5rem;
          background: linear-gradient(90deg, #2563eb, #4f46e5);
          color: white;
          border: none;
          padding: 0.9rem 1.6rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s, transform 0.3s;
        }
        .accept-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .accept-btn.confirmed {
          background: #16a34a;
          transform: scale(1.1);
          animation: pulse 0.6s infinite alternate;
        }
        @keyframes pulse {
          from { box-shadow: 0 0 10px #16a34a; }
          to { box-shadow: 0 0 20px #22c55e; }
        }

        /* Footer */
        .footer {
          background: #111827;
          color: #9ca3af;
          text-align: center;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .footer span {
          color: #2563eb;
          font-weight: bold;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            text-align: center;
          }
          .hero-image img {
            width: 200px;
          }
          .highlight-cards,
          .course-list,
          .community {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
