import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";

import ProtectedRoute from "./routes/ProtectedRoute";
import UserRoute from "./routes/UserRoute";
import OwnerRoute from "./routes/OwnerRoute";
import AdminRoute from "./routes/AdminRoute";

import UserDashboard from "./pages/user/Dashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import MyRequests from "./pages/user/MyRequests";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          {/* User Routes */}
          <Route element={<UserRoute />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Owner Routes */}
          <Route element={<OwnerRoute />}>
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
