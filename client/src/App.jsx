import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";

import ProtectedRoute from "./routes/ProtectedRoute";
import UserRoute from "./routes/UserRoute";
import OwnerRoute from "./routes/OwnerRoute";
import AdminRoute from "./routes/AdminRoute";

import UserDashboard from "./pages/user/Dashboard";
import MyRequests from "./pages/user/MyRequests";
import Properties from "./pages/user/Properties";
import PropertyDetails from "./pages/user/PropertyDetails";
import Recommended from "./pages/user/Recommended";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MyProperties from "./pages/owner/MyProperties";
import PropertyForm from "./pages/owner/PropertyForm";
import Requests from "./pages/owner/Requests";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import Analytics from "./pages/admin/Analytics";
import AdminCategories from "./pages/admin/Categories";

import Profile from "./pages/shared/Profile";

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
            <Route path="/user/requests" element={<MyRequests />} />
            <Route path="/user/properties" element={<Properties />} />
            <Route path="/user/properties/:id" element={<PropertyDetails />} />
            <Route path="/user/recommended" element={<Recommended />} />

            <Route path="/user/profile" element={<Profile />} />
          </Route>

          {/* Owner Routes */}
          <Route element={<OwnerRoute />}>
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/properties" element={<MyProperties />} />
            <Route path="/owner/properties/add" element={<PropertyForm />} />
            <Route
              path="/owner/properties/edit/:id"
              element={<PropertyForm />}
            />
            <Route path="/owner/requests" element={<Requests />} />

            <Route path="/owner/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/categories" element={<AdminCategories />} />

            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
