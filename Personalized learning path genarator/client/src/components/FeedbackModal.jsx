import { useState } from "react";

export function FeedbackModal({ resourceTitle, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="modal-backdrop">
      <div className="glass-card modal-card">
        <h3>Rate this resource</h3>
        <p>{resourceTitle}</p>
        <label className="field">
          <span>Rating</span>
          <input type="number" min="1" max="5" value={rating} onChange={(event) => setRating(Number(event.target.value))} />
        </label>
        <label className="field">
          <span>Feedback</span>
          <textarea rows="4" value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>
        <div className="button-row">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" onClick={() => onSubmit({ rating, comment })}>
            Save feedback
          </button>
        </div>
      </div>
    </div>
  );
}
