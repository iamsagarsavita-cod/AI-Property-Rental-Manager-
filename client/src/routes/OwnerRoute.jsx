import { Navigate, Outlet } from "react-router-dom";

const dashBoardByRole = {
  user: "/user/dashboard",
  owner: "/owner-dashboard",
  admin: "/admin-dashboard",
};

const OwnerRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (role !== "owner") {
    return <Navigate to={dashBoardByRole[role] || "/login"} />;
  }
  return <Outlet />;
};

export default OwnerRoute;
