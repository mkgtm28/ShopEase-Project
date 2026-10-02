import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../api/profileApi";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        console.error("Unable to load profile:", error);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setMessage("");
    setError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      setError("Username cannot be empty.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const data = await updateProfile({
        username: trimmedUsername,
        email: trimmedEmail,
      });

      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Unable to update profile:", error);

      const responseData = error.response?.data;

      if (responseData?.username) {
        setError(responseData.username[0]);
      } else if (responseData?.email) {
        setError(responseData.email[0]);
      } else {
        setError("Unable to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-message">
        <div className="profile-message-icon">👤</div>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-message">
        <div className="profile-message-icon">⚠️</div>
        <h2>{error || "Unable to load profile."}</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your account information.</p>
          </div>
        </div>

        <div className="profile-card">

          <div className="profile-card-header">
            <h2>Personal Information</h2>
            <p>
              Update your username and email address.
            </p>
          </div>

          {message && (
            <div className="profile-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="profile-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
                disabled={saving}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                disabled={saving}
                required
              />
            </div>

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Profile;