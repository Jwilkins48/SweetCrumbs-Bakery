import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
