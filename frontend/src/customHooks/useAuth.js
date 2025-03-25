import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Import axios for API calls
import { logAuth } from "../storage/authAtom";
import { toast } from "react-toastify"; // Import toast


const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useAtom(logAuth);

  const handleGoogleSuccess = async (credentialResponse) => {

    if (!credentialResponse?.credential) {
      console.error("No credential found in the response.");
      return;
    }

    try {
      const decoded = jwtDecode(credentialResponse?.credential);

      const response = await axios.post(
        "https://meetingscheduler-web-app.onrender.com/auth/google",
        { token: credentialResponse.credential }, // Send token properly
        { withCredentials: true } // Ensure credentials are included
      );

      console.log("Backend Response:", response.data);

      const userData = response.data.user;

      setAuthState({
        isAuthenticated: true,
        user: userData, // Store user data
        token: response.data.token, // Store the new token
      });

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during authentication:", error.response?.data || error.message);

      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });

      toast.error("Login failed. Please try again.");
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
    navigate("/"); // Redirect to homepage or login page
  };

  return { authState, handleGoogleSuccess, handleError, handleLogout };
};

export default useAuth;
