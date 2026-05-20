import { createContext, useState } from "react";
import api from "../utils/api.js";

// Create the auth context
export const AuthContext = createContext();

// Get initial user state from local storage
const getInitialUser = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  if (token) {
    return { token, isAdmin: isAdmin === "true" };
  }
  return null;
};

// Provides auth state to all child components
export const AuthProvider = ({ children }) => {
  // Initialize user state from local storage
  const [user, setUser] = useState(getInitialUser);

  // Login - stores token and user info in local storage
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, isAdmin } = response.data;

    // Store token and admin status in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdmin);

    setUser({ token, isAdmin });
    return isAdmin;
  };

  // Register - create new user
  const register = async (email, password) => {
    await api.post("/auth/register", { email, password });
  };

  // Logout - clears token and user info
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
