import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import useSocialAuth from "../hooks/useSocialAuth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Social auth hook
  const {
    loginWithGoogle: socialLoginGoogle,
    socialLoading,
    socialError,
    setSocialError,
  } = useSocialAuth();

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Register
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", userData);
      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true, data: res.data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true, data: res.data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Social Login (Google) - uses client-side OAuth
  const loginWithGoogle = useCallback(async () => {
    const result = await socialLoginGoogle();
    if (result.success) {
      setToken(result.token);
      setUser(result.user);
    } else {
      setError(result.message);
    }
  }, [socialLoginGoogle]);

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        loginWithGoogle,
        updateUser,
        isAuthenticated: !!user,
        socialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
