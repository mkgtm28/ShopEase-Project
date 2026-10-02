
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);

      /*
        For local development, Django returns the
        uid and token directly.

        Later, these will be sent through email.
      */
      navigate(
        `/reset-password?uid=${data.uid}&token=${data.token}`
      );
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1>Forgot Password?</h1>

        <p className="forgot-password-subtitle">
          Enter your email address and we'll help you reset your password.
        </p>

        {error && (
          <div className="forgot-password-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="forgot-password-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="forgot-password-button"
            disabled={loading}
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>

        <Link to="/login" className="back-login-link">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;

