import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsLoggedIn(false);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        logout();
        return null;
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access);

      setIsLoggedIn(true);

      return data.access;
    } catch (error) {
      console.error("Unable to refresh access token:", error);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}