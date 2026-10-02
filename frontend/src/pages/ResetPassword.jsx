
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!uid || !token) {
      setError("Invalid or expired password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        uid,
        token,
        password,
      });

      setSuccess("Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Unable to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1>Reset Password</h1>

        <p className="reset-password-subtitle">
          Enter your new password below.
        </p>

        {error && (
          <div className="reset-password-error">
            {error}
          </div>
        )}

        {success && (
          <div className="reset-password-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="reset-password-field">
            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="reset-password-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            className="reset-password-button"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <Link to="/login" className="reset-login-link">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;

