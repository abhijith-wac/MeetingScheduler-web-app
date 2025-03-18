import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAtomValue } from "jotai"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleSignin from "./components/GoogleSignin";
import { logAuth } from "./storage/authAtom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CalendarComponent from "./components/CalendarComponent";
import RoomSelector from "./components/RoomSelector";

function App() {
  const loginInfo = useAtomValue(logAuth); 

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop
      />
      <Routes>
        <Route
          path="/"
          element={
             loginInfo.isAuthenticated ? (
               <Navigate to="/roomselector" replace />
             ) : (
              <GoogleSignin />
             )
          }
        />
        <Route
          path="/roomselector"
          element={
            <ProtectedRoute>
              <RoomSelector />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/employee-details/:employeeId"
          element={
            <ProtectedRoute>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;