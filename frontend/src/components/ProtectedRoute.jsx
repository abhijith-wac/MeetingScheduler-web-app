import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { logAuth } from "../storage/authAtom";

const ProtectedRoute = ({ children }) => {
  const loginInfo = useAtomValue(logAuth);
  return loginInfo.isAuthenticated ? children : <Navigate to="/" replace />;
};

export { ProtectedRoute };