import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { useAtomValue } from "jotai"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { logAuth } from "./storage/authAtom";

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

              <Login />
        
          }
        />
        {/* <Route
          path="/employeetable"
          element={
            <ProtectedRoute>
              <EmployeeTable />
            </ProtectedRoute>
          }
        /> */}
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