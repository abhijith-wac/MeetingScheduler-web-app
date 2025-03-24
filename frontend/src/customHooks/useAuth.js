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

    // Check if the credential exists
    if (!credentialResponse?.credential) {
      console.error("No credential found in the response.");
      return;
    }

    try {
      // Decode the token
      const decoded = jwtDecode(credentialResponse?.credential);
      console.log("Decoded Token:", decoded);

      // Send token to backend to store user in MongoDB and get stored user data
      console.log("Sending token to backend...");
      const response = await axios.post(
        "https://meetingscheduler-web-app.onrender.com/auth/google",
        { token: credentialResponse.credential }, // Send token properly
        { withCredentials: true } // Ensure credentials are included
      );

      console.log("Backend Response:", response.data);

      // Extract user data from backend response
      const userData = response.data.user;

      setAuthState({
        isAuthenticated: true,
        user: userData, // Store user data
        token: response.data.token, // Store the new token
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect user to dashboard (optional)
      console.log("Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during authentication:", error.response?.data || error.message);

      // Reset auth state on failure
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });

      // Optionally, show an alert to the user
      alert("Login failed. Please try again.");
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
