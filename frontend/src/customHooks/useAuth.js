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
      axios.post("https://meetingscheduler-web-app.onrender.com/auth/google", {
        token: credentialResponse?.credential,
      }, { withCredentials: true }); // Ensure credentials are sent with the request
      

      console.log("Backend Response:", res.data);

      // Store user info from backend response
      const userData = res.data.user;

      setAuthState({
        isAuthenticated: true,
        user: userData, // Store user data from backend
        token: res.data.token, // Store the new token from backend
      });

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Error during token decoding or backend request:", error);
      // Optionally show an alert or handle error gracefully
    }
  };

  const handleError = (error) => {
    console.error("Login Failed:", error);
    // You can show a more user-friendly error message or handle it in other ways
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
