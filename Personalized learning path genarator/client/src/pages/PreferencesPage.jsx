import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const stepConfig = [
  { key: "topic", title: "What do you want to learn?", apiKey: "subjects" },
  { key: "purpose", title: "Purpose of learning", apiKey: "purposes" },
  { key: "level", title: "Current level", apiKey: "levels" }
];

export function PreferencesPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [options, setOptions] = useState({ subjects: [], purposes: [], levels: [] });
  const [allCourses, setAllCourses] = useState([]);
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState({ topic: "", purpose: "", level: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/learning/options")
      .then(setOptions)
      .catch((requestError) => setError(requestError.message));
  }, []);

  // Load all courses for the scrollable list
  useEffect(() => {
    if (step === 0) {
      // Try to load from search API first
      apiRequest("/learning/search")
        .then(data => {
          console.log('Courses loaded from search:', data.results?.length || 0);
          if (data.results && data.results.length > 0) {
            setAllCourses(data.results);
            setError("");
          } else {
            // If search returns empty, fallback to options
            loadFromOptions();
          }
        })
        .catch(err => {
          console.warn('Search API failed, trying options:', err.message);
          loadFromOptions();
        });
    }
  }, [step]);

  function loadFromOptions() {
    apiRequest("/learning/options")
      .then(optionsData => {
        const courses = (optionsData.subjects || []).map(subject => ({
          subject,
          title: subject,
          overview: "Click to select this course and start your learning journey",
          estimatedHours: 30
        }));
        console.log('Courses loaded from options:', courses.length);
        setAllCourses(courses);
        setError("");
      })
      .catch(optionsErr => {
        console.error('Failed to load options:', optionsErr);
        setError(`Failed to load courses: ${optionsErr.message}. Make sure the backend server is running on port 4000.`);
      });
  }

  const current = stepConfig[step];
  const currentOptions = options[current.apiKey] || [];

  function selectCourse(course) {
    setSelection({ ...selection, topic: course.subject });
    setError("");
  }

  async function handleContinue() {
    if (!selection[current.key]) {
      setError("Please choose one option before continuing.");
      return;
    }

    setError("");
    if (step < stepConfig.length - 1) {
      setStep(step + 1);
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest("/learning/preferences", {
        method: "POST",
        body: JSON.stringify(selection)
      });
      setUser(data.user);
      localStorage.setItem("learning-user", JSON.stringify(data.user));
      navigate("/path");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  // Step 1: Course selection with scrollable list
  if (step === 0) {
    return (
      <div className="page">
        <div className="wizard-layout">
          <div className="glass-card wizard-sidebar">
            <span className="eyebrow">Preference setup</span>
            <h1>Build your personal learning plan in three guided steps.</h1>
            <div className="wizard-steps">
              {stepConfig.map((item, index) => (
                <div key={item.key} className={`wizard-step ${index === step ? "active" : ""} ${index < step ? "completed" : ""}`}>
                  <span>{index < step ? "✓" : index + 1}</span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card wizard-content">
            <div className="section-heading">
              <h2>{current.title}</h2>
              <p>Select a course from the list below to start your learning journey.</p>
            </div>

            {/* Scrollable Course List */}
            <div className="course-list-container">
              {allCourses.length > 0 ? (
                <div className="course-list">
                  {allCourses.map((course) => (
                    <button
                      key={course.subject}
                      className={`course-item ${selection.topic === course.subject ? "selected" : ""}`}
                      onClick={() => selectCourse(course)}
                    >
                      <div className="course-item-header">
                        <strong className="course-name">{course.title}</strong>
                        <span className="course-hours">{course.estimatedHours}h</span>
                      </div>
                      {course.overview && (
                        <p className="course-description">{course.overview}</p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="loading-courses">
                  <p>Loading courses...</p>
                </div>
              )}
            </div>

            {error && <p className="error-text">{error}</p>}
            <div className="button-row">
              <button className="secondary-button" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
                Back
              </button>
              <button 
                className="primary-button" 
                disabled={loading || !selection.topic}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 & 3: Purpose and Level selection
  return (
    <div className="page">
      <div className="wizard-layout">
        <div className="glass-card wizard-sidebar">
          <span className="eyebrow">Preference setup</span>
          <h1>Build your personal learning plan in three guided steps.</h1>
          <div className="wizard-steps">
            {stepConfig.map((item, index) => (
              <div key={item.key} className={`wizard-step ${index === step ? "active" : ""} ${index < step ? "completed" : ""}`}>
                <span>{index < step ? "✓" : index + 1}</span>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card wizard-content">
          <div className="section-heading">
            <h2>{current.title}</h2>
            <p>Select exactly one option to shape the roadmap.</p>
          </div>
          <div className="choice-grid">
            {currentOptions.map((item) => (
              <button
                key={item}
                className={`choice-card ${selection[current.key] === item ? "selected" : ""}`}
                onClick={() => setSelection({ ...selection, [current.key]: item })}
              >
                {item}
              </button>
            ))}
          </div>
          
          {/* Customization Preview - shown on final step */}
          {step === 2 && selection.topic && selection.purpose && selection.level && (
            <div className="customization-preview">
              <h3>✓ Your learning path will include:</h3>
              <ul>
                {(selection.purpose === "Building projects" || selection.purpose === "Project development") && <li>Hands-on project tasks and real-world exercises</li>}
                {selection.purpose === "Interview preparation" && <li>Interview-focused questions and coding problems</li>}
                {selection.purpose === "Academic learning" && <li>Theory-based content with detailed explanations</li>}
                {selection.purpose === "Job preparation" && <li>Portfolio checkpoints and interview readiness</li>}
                {selection.purpose === "Skill development" && <li>Depth-focused practice with hands-on reinforcement</li>}
                {selection.purpose === "Career switch" && <li>Foundational knowledge with practical projects</li>}
                {selection.purpose === "Competitive exams" && <li>Exam patterns and timed practice questions</li>}
                <li>{selection.level} level difficulty with {selection.level === "Beginner" ? "steady pace" : selection.level === "Intermediate" ? "accelerated pace" : "intensive pace"}</li>
              </ul>
            </div>
          )}
          
          {error && <p className="error-text">{error}</p>}
          <div className="button-row">
            <button className="secondary-button" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
              Back
            </button>
            <button className="primary-button" disabled={loading} onClick={handleContinue}>
              {loading ? "Generating..." : step === stepConfig.length - 1 ? "Create New Learning Path" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
