import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";
import { FeedbackModal } from "../components/FeedbackModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function LearningPathPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [path, setPath] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [quizTarget, setQuizTarget] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        console.log('Loading learning path...');
        const [pathData, dashboardData] = await Promise.all([
          apiRequest("/learning/path"),
          apiRequest("/learning/dashboard")
        ]);
        console.log('Path loaded:', pathData);
        setPath(pathData);
        setDashboard(dashboardData);
      } catch (requestError) {
        console.error('Error loading path:', requestError);
        setError(requestError.message);
      }
    }
    load();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const getPlatformName = (url) => {
    if (!url) return "";
    try {
      if (url.includes("google.com/search")) return "Google Search";
      const hostname = new URL(url).hostname.replace("www.", "");
      const name = hostname.split(".")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {
      return "Web Resource";
    }
  };

  const getGoalKickerBookName = (title, pathTopic) => {
    const text = `${title} ${pathTopic}`.toLowerCase();
    
    if (text.includes("react native")) return "ReactNative";
    if (text.includes("react")) return "ReactJS";
    if (text.includes("node")) return "NodeJS";
    if (text.includes("python")) return "Python";
    if (text.includes("javascript")) return "JavaScript";
    if (text.includes("java") && !text.includes("javascript")) return "Java";
    if (text.includes("c++") || text.includes("cpp")) return "CPlusPlus";
    if (text.includes("c#") || text.includes("csharp")) return "CSharp";
    if (text.match(/\bc\b/)) return "C";
    if (text.includes("php")) return "PHP";
    if (text.includes("ruby on rails")) return "RubyOnRails";
    if (text.includes("ruby") && !text.includes("rails")) return "Ruby";
    if (text.includes("go ") || text.includes("golang")) return "Go";
    if (text.includes("swift")) return "Swift";
    if (text.includes("kotlin")) return "Kotlin";
    if (text.includes("bash")) return "Bash";
    if (text.includes("sql server")) return "SQLServer";
    if (text.includes("mysql")) return "MySQL";
    if (text.includes("postgresql") || text.includes("postgres")) return "PostgreSQL";
    if (text.includes("mongodb") || text.includes("mongo")) return "MongoDB";
    if (text.includes("oracle")) return "Oracle";
    if (text.includes("sql") && !text.includes("mysql") && !text.includes("postgres")) return "SQL";
    if (text.includes("html")) return "HTML5";
    if (text.includes("css")) return "CSS";
    if (text.includes("jquery")) return "jQuery";
    if (text.includes("angularjs")) return "AngularJS";
    if (text.includes("angular") && !text.includes("angularjs")) return "Angular2";
    if (text.includes("typescript")) return "TypeScript";
    if (text.includes("django")) return "Django";
    if (text.includes("spring")) return "SpringFramework";
    if (text.includes("linux")) return "Linux";
    if (text.includes("git")) return "Git";
    if (text.includes("excel")) return "ExcelVBA";
    if (text.includes("vba")) return "VBA";
    if (text.includes("android")) return "Android";
    if (text.includes("ios")) return "iOS";

    return null;
  };

  const generateGoalKickerURL = (title, pathTopic) => {
    const bookName = getGoalKickerBookName(title, pathTopic);
    if (!bookName) return "";
    return `https://goalkicker.com/${bookName}Book/`;
  };

  const generateGoalKickerPDFURL = (title, pathTopic) => {
    const bookName = getGoalKickerBookName(title, pathTopic);
    if (!bookName) return "";
    return `https://goalkicker.com/${bookName}Book/${bookName}NotesForProfessionals.pdf`;
  };



  async function track(topicId, resource, action) {
    try {
      let payload = { topicId, resourceId: resource.id, action };
      if (action === "watch") {
        payload = { ...payload, watchedPercentage: 100, minutes: resource.durationMinutes || 20 };
      }
      if (action === "read") {
        payload = { ...payload, minutes: resource.durationMinutes || 10 };
      }

      const data = await apiRequest("/learning/track", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setPath(data.path);
      setDashboard(data.dashboard);
      setToast(`${resource.title} tracked successfully.`);
      setTimeout(() => setToast(""), 2500);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function submitFeedback(payload) {
    try {
      await apiRequest("/feedback", {
        method: "POST",
        body: JSON.stringify({
          resourceTitle: feedbackTarget.title,
          ...payload
        })
      });
      setFeedbackTarget(null);
      setToast("Feedback saved.");
      setTimeout(() => setToast(""), 2500);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function submitQuiz(chapter) {
    try {
      const answers = chapter.quiz.questions.map((question) => Number(quizAnswers[question.id] ?? -1));
      if (answers.some((answer) => answer < 0)) {
        setError("Please answer every quiz question before submitting.");
        return;
      }

      const data = await apiRequest("/learning/quiz", {
        method: "POST",
        body: JSON.stringify({
          chapterId: chapter.id,
          answers
        })
      });
      setPath(data.path);
      setDashboard(data.dashboard);
      setQuizTarget(null);
      setQuizAnswers({});
      setToast(`Quiz submitted. Score: ${data.score}%`);
      setTimeout(() => setToast(""), 2500);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function downloadCertificate() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Certificate dimensions (landscape, high quality)
    canvas.width = 2800;
    canvas.height = 2000;
    
    // Background - elegant gradient
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, "#667eea");
    bgGradient.addColorStop(0.5, "#764ba2");
    bgGradient.addColorStop(1, "#f093fb");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Decorative border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 8;
    ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);
    
    // Inner decorative border with gold color
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 4;
    ctx.strokeRect(90, 90, canvas.width - 180, canvas.height - 180);
    
    // Corner decorations
    const corners = [
      { x: 120, y: 120 },
      { x: canvas.width - 120, y: 120 },
      { x: 120, y: canvas.height - 120 },
      { x: canvas.width - 120, y: canvas.height - 120 }
    ];
    
    corners.forEach(corner => {
      ctx.beginPath();
      ctx.arc(corner.x, corner.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd700";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
    });
    
    // Certificate Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 120px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CERTIFICATE", canvas.width / 2, 280);
    
    ctx.font = "italic 60px 'Georgia', serif";
    ctx.fillText("of Completion", canvas.width / 2, 380);
    
    // Decorative line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 400, 450);
    ctx.lineTo(canvas.width / 2 + 400, 450);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Small decorative elements on the line
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 400, 450, 10, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2 + 400, 450, 10, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2, 450, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    
    // This is to certify that
    ctx.font = "40px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("This is to certify that", canvas.width / 2, 540);
    
    // Student Name
    ctx.font = "bold italic 90px 'Georgia', serif";
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(user?.name || "Student Name", canvas.width / 2, 670);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Line under name
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 350, 730);
    ctx.lineTo(canvas.width / 2 + 350, 730);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Successfully completed text
    ctx.font = "40px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillText("has successfully completed the learning path", canvas.width / 2, 820);
    
    // Course/Path Title
    ctx.font = "bold 65px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.fillText(path?.title || "Course Title", canvas.width / 2, 940);
    ctx.shadowBlur = 0;
    
    // Achievement details
    ctx.font = "36px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(`Completion Progress: ${path?.overallProgress || 100}% • Topics Mastered: ${path?.completedTopics || 0}/${path?.totalTopics || 0}`, canvas.width / 2, 1040);
    
    // Date section
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Decorative divider
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 500, 1120);
    ctx.lineTo(canvas.width / 2 + 500, 1120);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Date
    ctx.font = "italic 36px 'Georgia', serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(`Date of Completion: ${formattedDate}`, canvas.width / 2, 1200);
    
    // Signature lines
    const today = new Date();
    const validUntil = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    const validDate = validUntil.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Left signature - Instructor
    ctx.beginPath();
    ctx.moveTo(400, 1500);
    ctx.lineTo(900, 1500);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = "bold 32px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("LearnPath AI", 650, 1550);
    ctx.font = "28px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Instructor", 650, 1590);
    
    // Right signature - Valid Until
    ctx.beginPath();
    ctx.moveTo(canvas.width - 900, 1500);
    ctx.lineTo(canvas.width - 400, 1500);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = "bold 32px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Valid Until: " + validDate, canvas.width - 650, 1550);
    ctx.font = "28px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Certificate ID: CERT-" + Date.now().toString().slice(-8), canvas.width - 650, 1590);
    
    // Seal/Badge
    const sealX = canvas.width / 2;
    const sealY = 1700;
    const sealRadius = 100;
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 20, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Star in seal
    ctx.font = "bold 70px 'Arial', sans-serif";
    ctx.fillStyle = "#764ba2";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", sealX, sealY);
    
    // Footer text
    ctx.font = "26px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("LearnPath AI • Personalized Learning Platform", canvas.width / 2, 1880);
    
    // Download the certificate
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `Certificate-${user?.name || "Student"}-${path?.topic || "Course"}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  function downloadReport() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Report dimensions (portrait, A4-like ratio, high quality)
    canvas.width = 2400;
    canvas.height = 3400;
    
    // Background - elegant gradient (blue theme)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, "#1e3c72");
    bgGradient.addColorStop(0.5, "#2a5298");
    bgGradient.addColorStop(1, "#7e22ce");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Decorative border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 16;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
    
    // Header Section
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 100px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LEARNING REPORT", canvas.width / 2, 150);
    
    // Decorative line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 350, 220);
    ctx.lineTo(canvas.width / 2 + 350, 220);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 350, 220, 8, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2 + 350, 220, 8, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2, 220, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    
    // Student Information Box
    const boxY = 300;
    const boxHeight = 280;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(150, boxY, canvas.width - 300, boxHeight);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 3;
    ctx.strokeRect(150, boxY, canvas.width - 300, boxHeight);
    
    // Student info
    ctx.font = "40px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "left";
    ctx.fillText("Student Name:", 220, 380);
    ctx.font = "bold 50px 'Georgia', serif";
    ctx.fillStyle = "#ffd700";
    ctx.fillText(user?.name || "Student", 520, 380);
    
    ctx.font = "40px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("Email:", 220, 460);
    ctx.font = "45px 'Arial', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(user?.email || "student@email.com", 380, 460);
    
    ctx.font = "40px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("Report Date:", 220, 540);
    const reportDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.font = "45px 'Arial', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(reportDate, 520, 540);
    
    // Course Overview Section
    const courseY = 650;
    ctx.font = "bold 70px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Course Overview", canvas.width / 2, courseY);
    
    // Course box
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(150, courseY + 50, canvas.width - 300, 300);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 3;
    ctx.strokeRect(150, courseY + 50, canvas.width - 300, 300);
    
    ctx.font = "bold 55px 'Georgia', serif";
    ctx.fillStyle = "#ffd700";
    ctx.fillText(path?.title || "Course Title", canvas.width / 2, courseY + 120);
    
    ctx.font = "38px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillText(`Topic: ${path?.topic || "N/A"}`, canvas.width / 2, courseY + 200);
    ctx.fillText(`Strategy: ${path?.strategy?.purpose || "N/A"} • Level: ${path?.strategy?.level || "N/A"}`, canvas.width / 2, courseY + 270);
    
    // Progress Overview Section
    const progressY = 1050;
    ctx.font = "bold 70px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Progress Overview", canvas.width / 2, progressY);
    
    // Progress statistics boxes
    const stats = [
      { label: "Overall Progress", value: `${path?.overallProgress || 0}%`, y: progressY + 100 },
      { label: "Topics Completed", value: `${path?.completedTopics || 0}/${path?.totalTopics || 0}`, y: progressY + 220 },
      { label: "Hours Spent", value: `${dashboard?.totalHoursSpent || 0}h`, y: progressY + 340 },
      { label: "Hours Remaining", value: `${path?.remainingHours || 0}h`, y: progressY + 460 },
      { label: "Quizzes Completed", value: `${dashboard?.quizzesCompleted || 0}/${dashboard?.totalChapterQuizzes || 0}`, y: progressY + 580 },
      { label: "Average Quiz Score", value: `${dashboard?.averageQuizScore || 0}%`, y: progressY + 700 }
    ];
    
    stats.forEach((stat, index) => {
      const bgColor = index % 2 === 0 ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 255, 255, 0.1)";
      ctx.fillStyle = bgColor;
      ctx.fillRect(200, stat.y, canvas.width - 400, 100);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(200, stat.y, canvas.width - 400, 100);
      
      ctx.font = "40px 'Arial', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.textAlign = "left";
      ctx.fillText(stat.label, 250, stat.y + 60);
      
      ctx.font = "bold 50px 'Georgia', serif";
      ctx.fillStyle = "#ffd700";
      ctx.textAlign = "right";
      ctx.fillText(stat.value, canvas.width - 250, stat.y + 60);
    });
    
    // Chapter Progress Section
    const chapterY = progressY + 800;
    ctx.font = "bold 70px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Chapter Progress", canvas.width / 2, chapterY);
    
    // Draw chapter details
    if (path?.chapters) {
      path.chapters.forEach((chapter, index) => {
        const chapY = chapterY + 100 + (index * 200);
        
        // Chapter box
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(150, chapY, canvas.width - 300, 170);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(150, chapY, canvas.width - 300, 170);
        
        // Chapter title
        ctx.font = "bold 45px 'Georgia', serif";
        ctx.fillStyle = "#ffd700";
        ctx.textAlign = "left";
        ctx.fillText(`${index + 1}. ${chapter.title}`, 200, chapY + 55);
        
        // Chapter status
        const statusText = chapter.completed ? "✓ Completed" : chapter.unlocked ? "In Progress" : "Locked";
        const statusColor = chapter.completed ? "#90EE90" : chapter.unlocked ? "#FFD700" : "#FF6B6B";
        ctx.font = "38px 'Arial', sans-serif";
        ctx.fillStyle = statusColor;
        ctx.textAlign = "right";
        ctx.fillText(statusText, canvas.width - 200, chapY + 55);
        
        // Topics progress
        const completedTopics = chapter.topics.filter(t => t.completed).length;
        ctx.font = "36px 'Arial', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.textAlign = "left";
        ctx.fillText(`Topics: ${completedTopics}/${chapter.topics.length} completed`, 200, chapY + 120);
        
        // Quiz score if available
        if (chapter.quiz?.score !== null && chapter.quiz?.score !== undefined) {
          ctx.textAlign = "right";
          ctx.fillText(`Quiz Score: ${chapter.quiz.score}%`, canvas.width - 200, chapY + 120);
        }
      });
    }
    
    // Coach Summary Section
    const coachY = chapterY + 100 + (path?.chapters?.length || 0) * 200 + 100;
    ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
    ctx.fillRect(150, coachY, canvas.width - 300, 200);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 3;
    ctx.strokeRect(150, coachY, canvas.width - 300, 200);
    
    ctx.font = "bold 50px 'Georgia', serif";
    ctx.fillStyle = "#ffd700";
    ctx.textAlign = "center";
    ctx.fillText("Coach Summary", canvas.width / 2, coachY + 50);
    
    ctx.font = "38px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillText(dashboard?.coachSummary || "Keep up the great work!", canvas.width / 2, coachY + 120);
    
    // Footer
    const footerY = canvas.height - 150;
    ctx.beginPath();
    ctx.moveTo(200, footerY);
    ctx.lineTo(canvas.width - 200, footerY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = "32px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "center";
    ctx.fillText("LearnPath AI • Personalized Learning Platform • Generated on " + reportDate, canvas.width / 2, footerY + 60);
    
    // Download the report
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `Learning-Report-${user?.name || "Student"}-${path?.topic || "Course"}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  if (error) {
    return <div className="page"><div className="glass-card section-card"><p className="error-text">{error}</p></div></div>;
  }

  if (!path) {
    return <div className="page"><div className="glass-card section-card"><p>Loading your learning path...</p></div></div>;
  }

  return (
    <div className="page">
      <section className="glass-card section-card path-hero">
        <div>
          <span className="eyebrow">Generated path</span>
          <h1>{path.title}</h1>
          <div className="path-metadata">
            {path.purpose && <span className="badge purpose-badge">Purpose: {path.purpose}</span>}
            {path.level && <span className="badge level-badge">Level: {path.level}</span>}
          </div>
          <p>{path.overview}</p>
          <p className="muted-text">{path.strategy?.contentStyle}</p>
          <p className="muted-text">{path.strategy?.structureStyle}</p>
          <p className="muted-text">{path.strategy.coachNote}</p>
        </div>
        <div className="hero-actions">
          <div className="progress-ring">
            <strong>{path.overallProgress}%</strong>
            <span>completed</span>
          </div>
          <div className="button-row">
            <button className="secondary-button" onClick={() => navigate("/dashboard")}>
              View dashboard
            </button>
            <button className="secondary-button report-button" onClick={downloadReport}>
              Download Report
            </button>
            <button className="secondary-button certificate-button" onClick={downloadCertificate}>
              Download Certificate
            </button>
          </div>
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}

      <div className="chapter-stack">
        {path.chapters.map((chapter) => (
          <section key={chapter.id} className={`glass-card section-card chapter-card ${chapter.unlocked ? "" : "locked"}`}>
            <div className="section-heading">
              <h2>{chapter.title}</h2>
              <p>{chapter.description}</p>
            </div>
            {!chapter.unlocked && <p className="muted-text">Complete the previous chapter to unlock this section.</p>}
            <div className="topic-grid">
              {chapter.topics.map((topic) => (
                <article key={topic.id} className={`topic-card ${topic.completed ? "completed" : ""}`}>
                  <div className="topic-card-top">
                    <div>
                      <h3>{topic.title}</h3>
                      <p>{topic.subtopics.join(" • ")}</p>
                    </div>
                    <span>{topic.progress}%</span>
                  </div>
                  <div className="mini-progress">
                    <div style={{ width: `${topic.progress}%` }} />
                  </div>
                  <div className="resource-list">
                    {topic.resources.map((resource) => (
                      <div key={resource.id} className="resource-card">
                        <div className="resource-info">
                          <div className="resource-meta">
                            <span className="resource-type">{resource.type}</span>
                            <span className="platform-tag">{getPlatformName(resource.url)}</span>
                          </div>
                          <strong>{resource.title}</strong>
                        </div>
                        <div className="button-row">
                          {resource.type === "video" ? (
                            <button
                              className="secondary-button inline-button"
                              onClick={() => {
                                setActiveVideo(resource);
                                track(topic.id, resource, "watch");
                              }}
                            >
                              Open
                            </button>
                          ) : (
                            <>
                              <a
                                className="secondary-button inline-button"
                                href={(() => {
                                  if (resource.type === "pdf" || resource.type === "article") {
                                    const gkUrl = generateGoalKickerURL(resource.title, path.topic);
                                    if (gkUrl) return gkUrl;
                                  }
                                  if (resource.type === "course") {
                                    const isGeneric = resource.url.includes("freecodecamp.org") || resource.url.includes("coursera.org") || resource.url.includes("kaggle.com") || resource.url.includes("edx.org") || resource.url.includes("google.com/search");
                                    if (isGeneric) {
                                      const query = `${path.topic} ${resource.title} free certification course (site:freecodecamp.org/learn OR site:alison.com/course OR site:mygreatlearning.com/academy OR site:simplilearn.com OR site:onlinecourses.nptel.ac.in)`;
                                      return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(query)}`;
                                    }
                                  }

                                  if (resource.url && resource.url.includes("google.com/search")) {
                                    try {
                                      const query = new URL(resource.url).searchParams.get("q") || resource.title;
                                      if (resource.type === "article") {
                                        return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(query + " free programming tutorial geeksforgeeks")}`;
                                      }
                                      return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(query)}`;
                                    } catch(e) {
                                      return resource.url;
                                    }
                                  }
                                  return resource.url;
                                })()}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                  if (resource.type === "course") {
                                    track(topic.id, resource, "complete-course");
                                  } else {
                                    track(topic.id, resource, "read");
                                  }
                                }}
                              >
                                Open
                              </a>
                              {resource.type === "pdf" && generateGoalKickerPDFURL(resource.title, path.topic) && (
                                <a
                                  className="secondary-button inline-button"
                                  href={generateGoalKickerPDFURL(resource.title, path.topic)}
                                  target="_blank"
                                  rel="noreferrer"
                                  download
                                  onClick={() => track(topic.id, resource, "read")}
                                >
                                  Download
                                </a>
                              )}
                              <a
                                className="secondary-button inline-button"
                                href={`https://www.google.com/search?q=${encodeURIComponent(path.topic + " " + resource.title + " " + resource.type)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Google Search
                              </a>
                            </>
                          )}
                          <button className="secondary-button" onClick={() => setFeedbackTarget(resource)}>
                            Rate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="quiz-panel">
              <div>
                <span className="resource-type">Chapter quiz</span>
                <strong>{chapter.quiz.title}</strong>
                <p className="muted-text">
                  20 chapter-specific MCQs aligned to {path.purpose?.toLowerCase() || "your learning goal"}.
                </p>
              </div>
              <div className="button-row">
                {typeof chapter.quiz.score === "number" && (
                  <span className="quiz-score-badge">Latest score: {chapter.quiz.score}%</span>
                )}
                <button
                  className="primary-button"
                  disabled={!chapter.quiz.unlocked}
                  onClick={() => {
                    setError("");
                    setQuizTarget(chapter);
                  }}
                >
                  {chapter.quiz.completed ? "Retake quiz" : "Take quiz"}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {feedbackTarget && (
        <FeedbackModal
          resourceTitle={feedbackTarget.title}
          onClose={() => setFeedbackTarget(null)}
          onSubmit={submitFeedback}
        />
      )}

      {quizTarget && (
        <div className="modal-backdrop">
          <div className="glass-card modal-card quiz-modal">
            <h3>{quizTarget.quiz.title}</h3>
            <p className="quiz-info">
              {quizTarget.quiz.totalQuestions || quizTarget.quiz.questions.length} questions • Select an answer to see immediate feedback
            </p>
            <div className="feedback-list quiz-questions">
              {quizTarget.quiz.questions.map((question, index) => {
                const userAnswer = quizAnswers[question.id];
                const isChecked = checkedAnswers[question.id];
                const isCorrect = userAnswer === question.correctIndex;

                return (
                  <div key={question.id} className={`feedback-card quiz-question ${isChecked ? (isCorrect ? "correct" : "incorrect") : ""}`}>
                    <div className="question-header">
                      <strong>{index + 1}. {question.prompt}</strong>
                      {isChecked && (
                        <span className={`answer-badge ${isCorrect ? "correct" : "incorrect"}`}>
                          {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      )}
                    </div>
                    <div className="choice-grid">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = userAnswer === optionIndex;
                        const isCorrectOption = optionIndex === question.correctIndex;
                        let optionClass = "choice-card";
                        
                        if (isChecked) {
                          if (isCorrectOption) {
                            optionClass += " correct-answer";
                          } else if (isSelected && !isCorrect) {
                            optionClass += " wrong-answer";
                          }
                        } else if (isSelected) {
                          optionClass += " selected";
                        }

                        return (
                          <button
                            key={option}
                            className={optionClass}
                            onClick={() => {
                              if (!isChecked) {
                                // Set answer and immediately check it
                                setQuizAnswers((current) => ({ ...current, [question.id]: optionIndex }));
                                setCheckedAnswers((prev) => ({ ...prev, [question.id]: true }));
                              }
                            }}
                            disabled={isChecked}
                          >
                            <span className="option-label">{String.fromCharCode(65 + optionIndex)}</span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {isChecked && (
                      <div className={`explanation ${isCorrect ? "correct" : "incorrect"}`}>
                        <strong>{isCorrect ? "Excellent!" : "Not quite."}</strong>
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="button-row quiz-actions">
              <button className="secondary-button" onClick={() => {
                setQuizTarget(null);
                setQuizAnswers({});
                setCheckedAnswers({});
              }}>
                Close
              </button>
              <button 
                className="primary-button" 
                onClick={() => submitQuiz(quizTarget)}
                disabled={Object.keys(checkedAnswers).length < quizTarget.quiz.questions.length}
              >
                {Object.keys(checkedAnswers).length < quizTarget.quiz.questions.length 
                  ? `${Object.keys(checkedAnswers).length}/${quizTarget.quiz.questions.length} answered`
                  : "Submit quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeVideo && (
        <div className="modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="glass-card modal-card video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveVideo(null)}>×</button>
            <h3>{activeVideo.title}</h3>
            <div className="video-container">
              {getYouTubeEmbedUrl(activeVideo.url) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(activeVideo.url)}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="video-error">
                  <p>Could not load video player. <a href={activeVideo.url} target="_blank" rel="noreferrer">Watch on YouTube</a></p>
                </div>
              )}
            </div>
            <div className="button-row" style={{ marginTop: '20px' }}>
              <button className="secondary-button" onClick={() => setActiveVideo(null)}>Close</button>
              <a 
                href={activeVideo.url} 
                target="_blank" 
                rel="noreferrer" 
                className="secondary-button"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
