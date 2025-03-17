import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import axios from "axios";
// import { API_ENDPOINTS } from "../urls/constants";
import { logAuth } from "../storage/authAtom";

const useAuth = () => {
  const [authState, setAuthState] = useAtom(logAuth); // ✅ Jotai persists state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username: email,
        password,
      });

      const { id, name, email: userEmail, token } = response.data.data;

      // ✅ Save everything in Jotai (it will persist in localStorage automatically)
      setAuthState({
        isAuthenticated: true,
        user: { id, name, email: userEmail },
        token,
        
      });

      toast.success("Login successful! Welcome back.");
      navigate("/employeetable", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      if (!authState.token) throw new Error("No token found, user is not logged in.");

      await axios.post(
        API_ENDPOINTS.LOGOUT,
        {},
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );

      // ✅ Clear Jotai state (which will also clear localStorage)
      setAuthState({ isAuthenticated: false, user: null, token: null });

      toast.success("You have successfully logged out.");
      navigate("/", { replace: true });

      console.log("Logout successful"); 
    } catch (error) {
      setError(error.response?.data?.message || "Logout failed. Please try again.");
      console.error("Logout error:", error.response || error); 
    }
  };

  return {
    error,
    loading,
    loginUser,
    logoutUser,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    setError,
  };
};

export default useAuth;