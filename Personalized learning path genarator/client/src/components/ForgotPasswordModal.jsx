import { useState } from "react";
import { apiRequest } from "../api.js";

export function ForgotPasswordModal({ isOpen, onClose, email }) {
  const [step, setStep] = useState("request"); // request, verify, success
  const [resetEmail, setResetEmail] = useState(email || "");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRequestReset(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!resetEmail.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest("/auth/request-password-reset", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail })
      });

      setMessage(data.message);
      // For demo purposes, we show the token
      // In production, this would be sent via email
      setResetToken(data.resetToken);
      setStep("verify");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: resetEmail,
          token: resetToken,
          newPassword: newPassword
        })
      });

      setMessage("Password has been reset successfully!");
      setStep("success");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep("request");
    setError("");
    setMessage("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="glass-card modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        {step === "request" && (
          <>
            <span className="eyebrow">Reset Password</span>
            <h2>Forgot your password?</h2>
            <p className="muted-text">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handleRequestReset}>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="Enter your email"
                />
              </label>
              {error && <p className="error-text">{error}</p>}
              {message && <p className="success-text">{message}</p>}
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <span className="eyebrow">Reset Password</span>
            <h2>Enter reset token</h2>
            <p className="muted-text">
              For demo purposes, the reset token is shown below. In production, this would be sent to your email.
            </p>
            {resetToken && (
              <div className="token-display">
                <strong>Token:</strong> {resetToken}
              </div>
            )}
            <form onSubmit={handleResetPassword}>
              <label className="field">
                <span>Reset Token</span>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(event) => setResetToken(event.target.value)}
                  placeholder="Enter reset token"
                />
              </label>
              <label className="field">
                <span>New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                />
              </label>
              <label className="field">
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                />
              </label>
              {error && <p className="error-text">{error}</p>}
              {message && <p className="success-text">{message}</p>}
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <span className="eyebrow">Success</span>
            <h2>Password Reset Complete</h2>
            <p className="muted-text">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <button className="primary-button" onClick={handleClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
