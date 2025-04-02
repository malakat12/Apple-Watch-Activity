import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./features/authSlice"; // Fetch user on page load
import Login from "./pages/Login";
//import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 

const App = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getUser()); 
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      {/*<Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />*/}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} /> 
        
      </Routes>
    </Router>
  );
};

export default App;
