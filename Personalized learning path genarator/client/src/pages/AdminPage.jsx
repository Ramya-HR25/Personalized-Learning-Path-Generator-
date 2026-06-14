import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

const initialTopic = {
  id: "",
  title: "",
  durationMinutes: 90,
  subtopics: "",
  chapterId: "",
  subject: "Python"
};

const initialResource = {
  subject: "Python",
  chapterId: "",
  topicId: "",
  title: "",
  type: "video",
  url: "",
  durationMinutes: 20
};

const initialIngestion = {
  subject: "Python",
  chapterId: "",
  topicId: "",
  resourceId: "",
  sourceText: ""
};

export function AdminPage() {
  const [overview, setOverview] = useState(null);
  const [form, setForm] = useState(initialTopic);
  const [resourceForm, setResourceForm] = useState(initialResource);
  const [ingestionForm, setIngestionForm] = useState(initialIngestion);
  const [activePanel, setActivePanel] = useState("users");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatedFacts, setGeneratedFacts] = useState([]);
  const [previewQuestions, setPreviewQuestions] = useState([]);

  async function load() {
    try {
      const data = await apiRequest("/admin/overview");
      setOverview(data);
      if (!form.chapterId) {
        const firstSubject = Object.keys(data.catalog)[0];
        setForm((current) => ({
          ...current,
          subject: firstSubject,
          chapterId: data.catalog[firstSubject].chapters[0]?.id || ""
        }));
        setResourceForm((current) => ({
          ...current,
          subject: firstSubject,
          chapterId: data.catalog[firstSubject].chapters[0]?.id || "",
          topicId: data.catalog[firstSubject].chapters[0]?.topics[0]?.id || ""
        }));
        setIngestionForm((current) => ({
          ...current,
          subject: firstSubject,
          chapterId: data.catalog[firstSubject].chapters[0]?.id || "",
          topicId: data.catalog[firstSubject].chapters[0]?.topics[0]?.id || "",
          resourceId: data.catalog[firstSubject].chapters[0]?.topics[0]?.resources?.[0]?.id || ""
        }));
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await apiRequest("/admin/catalog/topic", {
        method: "POST",
        body: JSON.stringify({
          subject: form.subject,
          chapterId: form.chapterId,
          topic: {
            id: form.id,
            title: form.title,
            durationMinutes: Number(form.durationMinutes),
            completionRules: { videoPercentage: 70, readMinutes: 8 },
            subtopics: form.subtopics.split(",").map((item) => item.trim()).filter(Boolean),
            resources: []
          }
        })
      });
      setMessage("Catalog updated.");
      setForm(initialTopic);
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeFeedback(id) {
    try {
      await apiRequest(`/admin/feedback/${id}`, { method: "DELETE" });
      setMessage("Feedback deleted.");
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleResourceSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await apiRequest("/admin/catalog/resource", {
        method: "POST",
        body: JSON.stringify({
          subject: resourceForm.subject,
          chapterId: resourceForm.chapterId,
          topicId: resourceForm.topicId,
          resource: {
            title: resourceForm.title,
            type: resourceForm.type,
            url: resourceForm.url,
            durationMinutes: Number(resourceForm.durationMinutes)
          }
        })
      });
      setMessage("Resource created through API.");
      setGeneratedFacts([]);
      setResourceForm((current) => ({
        ...initialResource,
        subject: current.subject,
        chapterId: current.chapterId,
        topicId: current.topicId
      }));
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleIngestionSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/admin/catalog/resource/ingest", {
        method: "POST",
        body: JSON.stringify(ingestionForm)
      });

      setGeneratedFacts(data.generated?.quizFacts || []);
      setPreviewQuestions(data.questions || []);
      setMessage("Transcript / PDF text ingested and exact quiz facts were generated.");
      setIngestionForm((current) => ({
        ...current,
        sourceText: ""
      }));
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function previewResourceQuiz() {
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/learning/resource-quiz", {
        method: "POST",
        body: JSON.stringify({
          subject: ingestionForm.subject,
          chapterId: ingestionForm.chapterId,
          topicId: ingestionForm.topicId,
          resourceId: ingestionForm.resourceId,
          level: "Beginner"
        })
      });

      setPreviewQuestions(data.questions || []);
      setMessage("Fetched direct quiz questions for the selected resource.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeResource(subject, chapterId, topicId, resourceId) {
    try {
      await apiRequest("/admin/catalog/resource", {
        method: "DELETE",
        body: JSON.stringify({ subject, chapterId, topicId, resourceId })
      });
      setMessage("Resource deleted.");
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error) {
    return <div className="page"><div className="glass-card section-card"><p className="error-text">{error}</p></div></div>;
  }

  if (!overview) {
    return <div className="page"><div className="glass-card section-card"><p>Loading admin overview...</p></div></div>;
  }

  const subjects = ["All", ...Object.keys(overview.catalog)];
  const selectedIngestionChapter =
    overview.catalog[ingestionForm.subject]?.chapters.find((chapter) => chapter.id === ingestionForm.chapterId) ||
    overview.catalog[ingestionForm.subject]?.chapters[0];
  const selectedIngestionTopic =
    selectedIngestionChapter?.topics.find((topic) => topic.id === ingestionForm.topicId) ||
    selectedIngestionChapter?.topics[0];
  const selectedIngestionResources = selectedIngestionTopic?.resources || [];
  const filteredUsers =
    selectedSubject === "All"
      ? overview.users
      : overview.users.filter((user) => user.preferences?.topic === selectedSubject);

  const quizTakerUsers = overview.users.filter((user) => {
    const allPaths = [user.path, ...(user.paths || [])].filter(Boolean);
    return allPaths.some((path) =>
      path.chapters?.some((chapter) => chapter.quiz?.completed)
    );
  });

  return (
    <div className="page">
      <section className="glass-card section-card">
        <div className="section-heading">
          <h1>Admin panel</h1>
          <p>Manage users, learning paths, and learner feedback securely.</p>
        </div>
        {message && <p className="success-text">{message}</p>}
        <div className="stats-grid">
          <button className={`glass-card stat-card admin-stat-card ${activePanel === "users" ? "active" : ""}`} onClick={() => setActivePanel("users")}>
            <span className="stat-label">Users</span>
            <strong>{overview.users.length}</strong>
            <span className="muted-text">Open all users with email IDs</span>
          </button>
          <button className={`glass-card stat-card admin-stat-card ${activePanel === "feedback" ? "active" : ""}`} onClick={() => setActivePanel("feedback")}>
            <span className="stat-label">Feedback items</span>
            <strong>{overview.feedback.length}</strong>
            <span className="muted-text">Open all submitted feedback</span>
          </button>
          <button className={`glass-card stat-card admin-stat-card ${activePanel === "quizTakers" ? "active" : ""}`} onClick={() => setActivePanel("quizTakers")}>
            <span className="stat-label">Quiz takers</span>
            <strong>{overview.quizTakers || 0}</strong>
            <span className="muted-text">Open users who completed quizzes</span>
          </button>
          <button className={`glass-card stat-card admin-stat-card ${activePanel === "subjects" ? "active" : ""}`} onClick={() => setActivePanel("subjects")}>
            <span className="stat-label">Subjects</span>
            <strong>{Object.keys(overview.catalog).length}</strong>
            <span className="muted-text">Open users by chosen subject</span>
          </button>
        </div>
      </section>

      <section className="glass-card section-card">
        {activePanel === "users" && (
          <>
            <div className="section-heading">
              <h2>Registered users</h2>
              <p>All users with their email IDs and current learning topic.</p>
            </div>
            <div className="feedback-list">
              {overview.users.map((user) => (
                <div key={user._id || user.id} className="feedback-card admin-user-card">
                  <div className="card-header">
                    <strong>{user.name}</strong>
                    <span className="muted-text">{user.email}</span>
                  </div>
                  <div className="card-body">
                    <span className="badge topic-badge">{user.preferences?.topic || "No subject selected yet"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activePanel === "feedback" && (
          <>
            <div className="section-heading">
              <h2>All feedback</h2>
              <p>Every learner feedback entry is listed here for review and deletion.</p>
            </div>
            <div className="feedback-list">
              {overview.feedback.length === 0 && <p className="muted-text">No feedback yet.</p>}
              {overview.feedback.map((item) => (
                <div key={item._id || item.id} className="feedback-card admin-feedback-card">
                  <div className="card-header">
                    <strong>{item.resourceTitle}</strong>
                    <div className="rating-info">
                      <span className="user-name">{item.userName}</span>
                      <span className="badge rating-badge">Rated {item.rating}/5</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p>{item.comment || "No comment."}</p>
                  </div>
                  <div className="card-actions">
                    <button className="secondary-button delete-button" onClick={() => removeFeedback(item._id || item.id)}>
                      Delete feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activePanel === "quizTakers" && (
          <>
            <div className="section-heading">
              <h2>Quiz takers</h2>
              <p>Users who have completed at least one quiz.</p>
            </div>
            <div className="feedback-list">
              {quizTakerUsers.length === 0 && <p className="muted-text">No quiz takers found.</p>}
              {quizTakerUsers.map((user) => (
                <div key={user._id || user.id} className="feedback-card admin-user-card">
                  <div className="card-header">
                    <strong>{user.name}</strong>
                    <span className="muted-text">{user.email}</span>
                  </div>
                  <div className="card-body">
                    <span className="badge topic-badge">{user.preferences?.topic || "No subject selected yet"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activePanel === "subjects" && (
          <>
            <div className="section-heading">
              <h2>Users by subject</h2>
              <p>Select a subject to see the users who chose it.</p>
            </div>
            <div className="subject-filter-row">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className={`secondary-button ${selectedSubject === subject ? "subject-pill-active" : ""}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
            <div className="feedback-list">
              {filteredUsers.length === 0 && <p className="muted-text">No users found for this subject.</p>}
              {filteredUsers.map((user) => (
                <div key={user._id || user.id} className="feedback-card admin-user-card">
                  <div className="card-header">
                    <strong>{user.name}</strong>
                    <span className="muted-text">{user.email}</span>
                  </div>
                  <div className="card-body">
                    <span className="badge topic-badge">{user.preferences?.topic || "No subject selected yet"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="two-column-grid">
        <form className="glass-card section-card" onSubmit={handleSubmit}>
          <div className="section-heading">
            <h2>Add or edit topic</h2>
            <p>Quickly update the resource catalog.</p>
          </div>
          <label className="field">
            <span>Subject</span>
            <input list="topic-subject-list" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value, chapterId: overview.catalog[event.target.value]?.chapters[0]?.id || "" })} />
            <datalist id="topic-subject-list">
              {Object.keys(overview.catalog).map((subject) => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Chapter</span>
            <input list="topic-chapter-list" value={form.chapterId} onChange={(event) => setForm({ ...form, chapterId: event.target.value })} />
            <datalist id="topic-chapter-list">
              {(overview.catalog[form.subject]?.chapters || []).map((chapter) => (
                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
              ))}
            </datalist>
          </label>
          <label className="field"><span>Topic id</span><input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} /></label>
          <label className="field"><span>Title</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label className="field"><span>Duration (minutes)</span><input type="number" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} /></label>
          <label className="field"><span>Subtopics</span><textarea rows="4" value={form.subtopics} onChange={(event) => setForm({ ...form, subtopics: event.target.value })} placeholder="Comma separated" /></label>
          <button className="primary-button">Save topic</button>
        </form>

        <form className="glass-card section-card" onSubmit={handleResourceSubmit}>
          <div className="section-heading">
            <h2>Add course or resource</h2>
            <p>Admins can manually add courses, videos, articles, and notes to any topic.</p>
          </div>
          <label className="field">
            <span>Subject</span>
            <input
              list="resource-subject-list"
              value={resourceForm.subject}
              onChange={(event) => {
                const subject = event.target.value;
                const firstChapter = overview.catalog[subject]?.chapters[0];
                setResourceForm({
                  ...resourceForm,
                  subject,
                  chapterId: firstChapter?.id || "",
                  topicId: firstChapter?.topics[0]?.id || ""
                });
              }}
            />
            <datalist id="resource-subject-list">
              {Object.keys(overview.catalog).map((subject) => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Chapter</span>
            <input
              list="resource-chapter-list"
              value={resourceForm.chapterId}
              onChange={(event) => {
                const chapterId = event.target.value;
                const chapter = (overview.catalog[resourceForm.subject]?.chapters || []).find((item) => item.id === chapterId);
                setResourceForm({
                  ...resourceForm,
                  chapterId,
                  topicId: chapter?.topics[0]?.id || ""
                });
              }}
            />
            <datalist id="resource-chapter-list">
              {(overview.catalog[resourceForm.subject]?.chapters || []).map((chapter) => (
                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Topic</span>
            <input
              list="resource-topic-list"
              value={resourceForm.topicId}
              onChange={(event) => setResourceForm({ ...resourceForm, topicId: event.target.value })}
            />
            <datalist id="resource-topic-list">
              {((overview.catalog[resourceForm.subject]?.chapters || []).find((item) => item.id === resourceForm.chapterId)?.topics || []).map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </datalist>
          </label>
          <label className="field"><span>Course / resource title</span><input value={resourceForm.title} onChange={(event) => setResourceForm({ ...resourceForm, title: event.target.value })} /></label>
          <label className="field">
            <span>Type to add</span>
            <select value={resourceForm.type} onChange={(event) => setResourceForm({ ...resourceForm, type: event.target.value })}>
              <option value="video">Video</option>
              <option value="course">Course</option>
              <option value="article">Article</option>
              <option value="pdf">PDF / Notes</option>
            </select>
          </label>
          <label className="field"><span>URL</span><input value={resourceForm.url} onChange={(event) => setResourceForm({ ...resourceForm, url: event.target.value })} /></label>
          <label className="field"><span>Duration (minutes)</span><input type="number" value={resourceForm.durationMinutes} onChange={(event) => setResourceForm({ ...resourceForm, durationMinutes: event.target.value })} /></label>
          <button className="primary-button">Add course / resource</button>
        </form>
      </section>

      <section className="glass-card section-card">
        <form onSubmit={handleIngestionSubmit}>
          <div className="section-heading">
            <h2>Transcript / PDF ingestion</h2>
            <p>Paste exact transcript or notes text for a resource and generate quiz facts directly from that content.</p>
          </div>
          <div className="two-column-grid">
            <label className="field">
              <span>Subject</span>
              <select
                value={ingestionForm.subject}
                onChange={(event) => {
                  const subject = event.target.value;
                  const firstChapter = overview.catalog[subject].chapters[0];
                  const firstTopic = firstChapter?.topics[0];
                  setIngestionForm({
                    subject,
                    chapterId: firstChapter?.id || "",
                    topicId: firstTopic?.id || "",
                    resourceId: firstTopic?.resources?.[0]?.id || "",
                    sourceText: ingestionForm.sourceText
                  });
                }}
              >
                {Object.keys(overview.catalog).map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Chapter</span>
              <select
                value={ingestionForm.chapterId}
                onChange={(event) => {
                  const chapterId = event.target.value;
                  const chapter = overview.catalog[ingestionForm.subject].chapters.find((item) => item.id === chapterId);
                  const firstTopic = chapter?.topics[0];
                  setIngestionForm({
                    ...ingestionForm,
                    chapterId,
                    topicId: firstTopic?.id || "",
                    resourceId: firstTopic?.resources?.[0]?.id || ""
                  });
                }}
              >
                {(overview.catalog[ingestionForm.subject]?.chapters || []).map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Topic</span>
              <select
                value={ingestionForm.topicId}
                onChange={(event) => {
                  const topicId = event.target.value;
                  const topic = (selectedIngestionChapter?.topics || []).find((item) => item.id === topicId);
                  setIngestionForm({
                    ...ingestionForm,
                    topicId,
                    resourceId: topic?.resources?.[0]?.id || ""
                  });
                }}
              >
                {(selectedIngestionChapter?.topics || []).map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.title}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Resource</span>
              <select value={ingestionForm.resourceId} onChange={(event) => setIngestionForm({ ...ingestionForm, resourceId: event.target.value })}>
                {selectedIngestionResources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.title} ({resource.type})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Pasted transcript / PDF text</span>
            <textarea
              rows="10"
              value={ingestionForm.sourceText}
              onChange={(event) => setIngestionForm({ ...ingestionForm, sourceText: event.target.value })}
              placeholder="Paste transcript lines, article text, or extracted PDF notes here."
            />
          </label>
          <button className="primary-button" disabled={!selectedIngestionResources.length}>
            Generate exact quiz facts
          </button>
          <div className="button-row" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="secondary-button"
              disabled={!ingestionForm.resourceId}
              onClick={previewResourceQuiz}
            >
              Fetch direct quiz questions
            </button>
          </div>
        </form>

        {generatedFacts.length > 0 && (
          <div className="feedback-list" style={{ marginTop: 24 }}>
            {generatedFacts.map((fact, index) => (
              <div key={`${fact.prompt}-${index}`} className="feedback-card">
                <strong>Q{index + 1}. {fact.prompt}</strong>
                <p><strong>Answer:</strong> {fact.answer}</p>
                <p>{fact.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {previewQuestions.length > 0 && (
          <div className="feedback-list" style={{ marginTop: 24 }}>
            {previewQuestions.map((question) => (
              <div key={question.id} className="feedback-card">
                <strong>{question.prompt}</strong>
                <p>{question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join(" | ")}</p>
                <p><strong>Correct:</strong> {question.options[question.correctIndex]}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="two-column-grid">
        <div className="glass-card section-card">
          <div className="section-heading">
            <h2>Resource library</h2>
            <p>Resources below are served from the backend API and can be managed manually.</p>
          </div>
          <div className="feedback-list">
            {Object.entries(overview.catalog).map(([subject, data]) =>
              data.chapters.map((chapter) =>
                chapter.topics.map((topic) => (
                  <div key={`${subject}-${chapter.id}-${topic.id}`} className="feedback-card">
                    <strong>{topic.title}</strong>
                    <span>{subject} / {chapter.title}</span>
                    {(topic.resources || []).length === 0 && <p className="muted-text">No resources added yet.</p>}
                    {(topic.resources || []).map((resource) => (
                      <div key={resource.id} className="resource-admin-row">
                        <span>{resource.title} ({resource.type}){resource.quizFacts?.length ? ` - ${resource.quizFacts.length} quiz facts` : ""}</span>
                        <button
                          className="secondary-button"
                          onClick={() => removeResource(subject, chapter.id, topic.id, resource.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )
            )}
          </div>
        </div>

        <div className="glass-card section-card">
          <div className="section-heading">
            <h2>Course and resource library</h2>
            <p>Review everything added under each topic and remove outdated items.</p>
          </div>
          <div className="feedback-list">
            {Object.entries(overview.catalog).map(([subject, data]) =>
              data.chapters.map((chapter) =>
                chapter.topics.map((topic) => (
                  <div key={`course-${subject}-${chapter.id}-${topic.id}`} className="feedback-card">
                    <strong>{topic.title}</strong>
                    <span>{subject} / {chapter.title}</span>
                    {(topic.resources || []).length === 0 && <p className="muted-text">No courses or resources added yet.</p>}
                    {(topic.resources || []).map((resource) => (
                      <div key={resource.id} className="resource-admin-row">
                        <span>{resource.title} ({resource.type}){resource.quizFacts?.length ? ` - ${resource.quizFacts.length} quiz facts` : ""}</span>
                        <button
                          className="secondary-button"
                          onClick={() => removeResource(subject, chapter.id, topic.id, resource.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
