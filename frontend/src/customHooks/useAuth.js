import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Import axios for API calls
import { logAuth } from "../storage/authAtom";

const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useAtom(logAuth);

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    try {
      const decoded = jwtDecode(credentialResponse?.credential);

      // ✅ Send token to backend to store user in MongoDB and get stored user data
      const res = await axios.post("https://meetingscheduler-web-app.onrender.com/auth/google", {
        token: credentialResponse?.credential,
      });

      console.log("Backend Response:", res.data);

      // ✅ Store user info from backend response
      const userData = res.data.user;

      setAuthState({
        isAuthenticated: true,
        user: userData, // Store user data from backend
        token: res.data.token, // Store the new token from backend
      });

      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Error decoding token or backend request:", error);
    }
  };

  const handleError = (error) => {
    console.error("Login Failed:", error);
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem("token");
    navigate("/");
  };

  return { authState, handleGoogleSuccess, handleError, handleLogout };
};

export default useAuth;
