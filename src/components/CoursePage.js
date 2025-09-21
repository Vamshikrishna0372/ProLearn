import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "./CoursePage.css";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const res = await fetch(
            `https://prolearn-backend-5uot.onrender.com/api/auth/${userId}`
          );
          const data = await res.json();
          if (data.success && data.user) {
            setUserName(data.user.name || "Student");
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  // Fetch course & progress
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const res = await fetch(
          `https://prolearn-backend-5uot.onrender.com/api/courses/${id}`
        );
        const data = await res.json();
        if (data.success) setCourse(data.course);

        const progressRes = await fetch(
          `https://prolearn-backend-5uot.onrender.com/api/progress/${userId}/${id}`
        );
        const progressData = await progressRes.json();
        if (progressData.success) {
          setCompletedVideos(progressData.progress.completedVideos || []);
          if (progressData.progress.lastWatched !== null) {
            setCurrentVideoIndex(progressData.progress.lastWatched);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndProgress();
  }, [id, userId]);

  // Mark video completed
  const markVideoCompleted = async (idx) => {
    if (completedVideos.includes(idx)) return;
    setCompletedVideos((prev) => [...prev, idx]);

    try {
      await fetch("https://prolearn-backend-5uot.onrender.com/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId: id, videoIndex: idx }),
      });
    } catch (err) {
      console.error(err);
    }

    toast.success(`✅ Marked "${course.videos[idx].title}" as completed!`, {
      autoClose: 2000,
    });

    const nextIdx = idx + 1;
    if (nextIdx < course.videos.length) {
      setCurrentVideoIndex(nextIdx);
    } else {
      setCurrentVideoIndex(null);
    }
  };

  const isYouTubeUrl = (url) =>
    url && (url.includes("youtube.com") || url.includes("youtu.be"));

  const getYouTubeVideoId = (url) => {
    try {
      if (url.includes("watch?v=")) return new URL(url).searchParams.get("v");
      if (url.includes("youtu.be")) return url.split("youtu.be/")[1];
      if (url.includes("embed")) return url.split("embed/")[1].split("?")[0];
      return null;
    } catch {
      return null;
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  const allVideosCompleted =
    course.videos && completedVideos.length === course.videos.length;

  // Generate Certificate PDF
  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 60;
    let currentY = 80;

    const issueDate = new Date().toLocaleDateString();
    const certificateId = `${userId}-${Date.now()}`;
    const startDate = course.startDate
      ? new Date(course.startDate).toLocaleDateString()
      : "N/A";
    const endDate = course.endDate
      ? new Date(course.endDate).toLocaleDateString()
      : issueDate;
    const totalHours = course.totalHours || course.duration || "N/A";
    const instructorName = course.instructor || "Course Instructor";
    const description =
      course.description ||
      `This course provided comprehensive training on ${course.title}, including practical exercises and projects. By completing this course, ${userName} has demonstrated proficiency in the key skills taught.`;

    // Border
    doc.setDrawColor(50, 50, 150);
    doc.setLineWidth(6);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Title
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 120);
    doc.text("Certificate of Completion", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 50;

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(80, 80, 80);
    doc.text("This is to certify that", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 35;

    // Student Name
    doc.setFontSize(24);
    doc.setTextColor(0, 102, 204);
    const wrappedName = doc.splitTextToSize(userName, pageWidth - 2 * marginX);
    doc.text(wrappedName, pageWidth / 2, currentY, { align: "center" });

    currentY += wrappedName.length * 20 + 20;

    // Achievement text
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text("has successfully completed the course", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 35;

    // Course Title
    doc.setFontSize(20);
    doc.setTextColor(180, 0, 80);
    const wrappedTitle = doc.splitTextToSize(`"${course.title}"`, pageWidth - 2 * marginX);
    doc.text(wrappedTitle, pageWidth / 2, currentY, { align: "center" });

    currentY += wrappedTitle.length * 22 + 20;

    // Extra Info
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    const extraInfo = [
      `Offered by: ProLearn Academy`,
      `Course Duration: ${startDate} – ${endDate}`,
      `Total Hours: ${totalHours}`,
      `Course ID: ${course._id}`,
    ];
    if (course.grade) extraInfo.push(`Grade/Score: ${course.grade}`);

    extraInfo.forEach((line) => {
      const wrappedLine = doc.splitTextToSize(line, pageWidth - 2 * marginX);
      doc.text(wrappedLine, pageWidth / 2, currentY, { align: "center" });
      currentY += wrappedLine.length * 16 + 5;
    });

    currentY += 15;

    // Description
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const wrappedDesc = doc.splitTextToSize(
      `Course Description: ${description}`,
      pageWidth - 2 * marginX
    );
    doc.text(wrappedDesc, marginX, currentY);

    currentY += wrappedDesc.length * 14 + 40;

    // Footer
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Issued on: ${issueDate}`, marginX, pageHeight - 60);

    // Instructor & Director
    doc.text("____________________", marginX, pageHeight - 90);
    doc.text(instructorName, marginX + 20, pageHeight - 70);

    doc.text("____________________", pageWidth - marginX - 140, pageHeight - 90);
    doc.text("Director, ProLearn Academy", pageWidth - marginX - 120, pageHeight - 70);

    // Certificate ID
    doc.setFontSize(12);
    doc.text(`Certificate ID: ${certificateId}`, pageWidth / 2, pageHeight - 40, {
      align: "center",
    });
    doc.text(
      "Note: This certificate is digitally signed and can be verified on ProLearn Academy.",
      pageWidth / 2,
      pageHeight - 25,
      { align: "center" }
    );

    doc.save(`${course.title}-Certificate.pdf`);
  };

  return (
    <div className="course-page">
      <ToastContainer />
      <header className="course-header">
        <h1>{course.title}</h1>
        <button onClick={() => navigate(-1)} className="back-btn">
          ⬅ Back
        </button>
      </header>

      {/* Course Details */}
      <div className="course-details">
        <p><strong>Instructor:</strong> {course.instructor}</p>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Category:</strong> {course.category}</p>
        <p><strong>Level:</strong> {course.level}</p>
        
        <p><strong>Duration:</strong> {course.totalHours || course.duration}</p>
        <p><strong>Price:</strong> {course.price}</p>
        <p><strong>Rating:</strong> {course.rating}</p>
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="course-thumbnail"
          />
        )}
      </div>

      {/* Video Playlist */}
      {course.videos && course.videos.length > 0 && (
        <div className="video-playlist">
          <h3>Course Videos</h3>
          <ul>
            {course.videos.map((video, idx) => {
              const ytId = isYouTubeUrl(video.url)
                ? getYouTubeVideoId(video.url)
                : null;
              const isActive = currentVideoIndex === idx;
              const isCompleted = completedVideos.includes(idx);

              return (
                <li key={idx}>
                  <button
                    className={`playlist-item-button ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setCurrentVideoIndex(idx)}
                  >
                    {video.title}{" "}
                    <span
                      className={`tick-circle ${isCompleted ? "completed" : ""}`}
                    >
                      ✔
                    </span>
                  </button>

                  {isActive && (
                    <div className="playlist-video-wrapper">
                      {ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                          title={video.title}
                          className="course-video"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={video.url}
                          controls
                          autoPlay
                          className="course-video"
                          onEnded={() => markVideoCompleted(idx)}
                        />
                      )}
                      <button
                        className="mark-btn"
                        onClick={() => markVideoCompleted(idx)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? "✅ Completed" : "✅ Mark as Completed"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Certificate Section */}
      <div className="certificate-section">
        <button
          className="certificate-btn"
          onClick={generateCertificate}
          disabled={!allVideosCompleted}
        >
          🎓 Download Certificate
        </button>
        {!allVideosCompleted && (
          <p className="certificate-note">
            Complete all videos to unlock certificate.
          </p>
        )}
      </div>
    </div>
  );
}
