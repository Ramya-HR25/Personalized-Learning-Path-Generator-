import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";
import { StatCard } from "../components/StatCard.jsx";
import { ProgressChart } from "../components/ProgressChart.jsx";

export function DashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [dashboardData, feedbackData, pathsData] = await Promise.all([
          apiRequest("/learning/dashboard"),
          apiRequest("/feedback"),
          apiRequest("/learning/paths")
        ]);
        setDashboard(dashboardData);
        setFeedback(feedbackData);
        setAllPaths(pathsData.paths || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    load();
  }, []);
  
  async function switchToPath(pathId) {
    try {
      await apiRequest("/learning/path/switch", {
        method: "POST",
        body: JSON.stringify({ pathId })
      });
      // Reload the page to show new path
      window.location.href = "/path";
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error) {
    return <div className="page"><div className="glass-card section-card"><p className="error-text">{error}</p></div></div>;
  }

  if (!dashboard) {
    return <div className="page"><div className="glass-card section-card"><p>Loading dashboard...</p></div></div>;
  }

  return (
    <div className="page dashboard-page">
      <section className="glass-card section-card">
        <div className="section-heading">
          <h1>Your Learning Paths</h1>
          <p>
            {allPaths.length === 0
              ? "Create your first personalized path."
              : `You have ${allPaths.length} saved learning path${allPaths.length === 1 ? "" : "s"}. Each course + purpose + level choice is stored separately.`}
          </p>
        </div>
        {allPaths.length > 0 && (
          <div className="paths-grid">
            {allPaths.map((path) => (
              <div
                key={path.pathId || path.topic}
                className={`path-card ${path.isActive ? "active" : ""}`}
                onClick={() => switchToPath(path.pathId || path.topic)}
              >
                <div className="path-header">
                  <h3>{path.title}</h3>
                  <div className="path-badges">
                    <span className="badge purpose-badge">{path.purpose || "General"}</span>
                    <span className="badge level-badge">{path.level || "Beginner"}</span>
                  </div>
                  {path.isActive && <span className="active-badge">Active</span>}
                </div>
                <div className="path-stats">
                  <div className="path-stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">{path.overallProgress}%</span>
                  </div>
                  <div className="path-stat">
                    <span className="stat-label">Topics</span>
                    <span className="stat-value">{path.completedTopics}/{path.totalTopics}</span>
                  </div>
                  <div className="path-stat">
                    <span className="stat-label">Chapter quizzes</span>
                    <span className="stat-value">{path.quizzesCompleted}/{path.totalChapterQuizzes}</span>
                  </div>
                  <div className="path-stat">
                    <span className="stat-label">Remaining</span>
                    <span className="stat-value">{path.remainingHours}h</span>
                  </div>
                </div>
                <div className="path-progress-bar">
                  <div
                    className="path-progress-fill"
                    style={{ width: `${path.overallProgress}%` }}
                  ></div>
                </div>
                <button className="switch-path-btn">
                  {path.isActive ? "Continue Learning" : "Switch to This Path"}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="button-row" style={{ marginTop: "20px" }}>
          <button
            className="secondary-button"
            onClick={() => navigate("/preferences")}
          >
            + Add New Learning Path
          </button>
        </div>
      </section>
      
      <section className="glass-card section-card">
        <div className="section-heading">
          <h1>Performance dashboard</h1>
          <p>See your study rhythm, remaining time, and automatic completion insights.</p>
        </div>
        <div className="stats-grid">
          <StatCard label="Time spent" value={`${dashboard.totalHoursSpent} hrs`} helper="Tracked from reading, courses, and watch time." />
          <StatCard label="Remaining" value={`${dashboard.remainingHours} hrs`} helper="Estimated time left in your roadmap." />
          <StatCard label="Completed topics" value={dashboard.completedTopics} helper="Topics automatically marked complete." />
          <StatCard label="Overall progress" value={`${dashboard.overallProgress}%`} helper="Path completion based on unlocked chapters." />
          <StatCard label="Quizzes completed" value={`${dashboard.quizzesCompleted}/${dashboard.totalChapterQuizzes || 0}`} helper="Chapter-wise quizzes submitted by the learner." />
          <StatCard label="Quiz progress" value={`${dashboard.quizProgressPercent || 0}%`} helper="How much of the chapter quiz system is complete." />
          <StatCard label="Average quiz score" value={`${dashboard.averageQuizScore}%`} helper="Performance based on chapter-end quizzes." />
        </div>
      </section>

      <section className="two-column-grid">
        <ProgressChart data={dashboard.chart} />
        <div className="glass-card section-card">
          <div className="section-heading">
            <h2>Coach summary</h2>
            <p>Chatbot-style insight generated from your latest activity.</p>
          </div>
          <div className="chat-summary">
            <span>AI Coach</span>
            <p>{dashboard.coachSummary}</p>
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={() => navigate("/path")}>
              Continue learning
            </button>
          </div>
        </div>
      </section>

      <section className="glass-card section-card">
        <div className="section-heading">
          <h2>Feedback history</h2>
          <p>Every rating is stored and available to both learners and admins.</p>
        </div>
        <div className="feedback-list">
          {feedback.length === 0 && <p className="muted-text">No feedback submitted yet.</p>}
          {feedback.map((item) => (
            <div key={item.id} className="feedback-card">
              <strong>{item.resourceTitle}</strong>
              <span>Rating: {item.rating}/5</span>
              <p>{item.comment || "No extra comments provided."}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
