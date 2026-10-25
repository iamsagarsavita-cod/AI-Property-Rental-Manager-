import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiSearch,
  FiFileText,
  FiPlusSquare,
  FiInbox,
  FiUsers,
  FiGrid,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

const navLinksByRole = {
  user: [
    { name: "Dashboard", path: "/user/dashboard", icon: FiHome },
    { name: "Browse", path: "/user/properties", icon: FiSearch },
    { name: "My Requests", path: "/user/requests", icon: FiFileText },
  ],
  owner: [
    { name: "Dashboard", path: "/owner-dashboard", icon: FiHome },
    { name: "My Properties", path: "/owner/properties", icon: FiGrid },
    { name: "Add Property", path: "/owner/properties/add", icon: FiPlusSquare },
    { name: "Requests", path: "/owner/requests", icon: FiInbox },
  ],
  admin: [
    { name: "Dashboard", path: "/admin-dashboard", icon: FiHome },
    { name: "Users", path: "/admin/users", icon: FiUsers },
    { name: "Categories", path: "/admin/categories", icon: FiGrid },
    { name: "Properties", path: "/admin/properties", icon: FiHome },
    { name: "Analytics", path: "/admin/analytics", icon: FiBarChart2 },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "user";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = navLinksByRole[role] || [];

  const profilePath =
    role === "user"
      ? "/user/profile"
      : role === "owner"
        ? "/owner/profile"
        : "/admin/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9dfd4] bg-[#fffdfa]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to={navLinks[0]?.path || "/"}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#b87856] to-[#94583e] text-sm font-bold shadow-lg shadow-[#a96343]/20">
            PR
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#382f28]">
              Property Rental Manager
            </h1>

            <p className="text-[10px] text-[#837468] capitalize">
              {role} Panel
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#f5e9df] text-[#a96343]"
                      : "text-[#6d5e52] hover:bg-[#fffdfa] hover:text-[#382f28]"
                  }`
                }
              >
                <Icon size={16} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button
            className="hidden items-center gap-2 rounded-xl border border-[#e9dfd4] bg-[#fffdfa] px-3 py-2 md:flex"
            onClick={() => navigate(profilePath)}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#a96343] text-xs font-bold">
              <FiUser size={14} />
            </div>
            <span className="text-sm font-medium text-[#51463d]">Profile</span>
          </button>

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#e9dfd4] bg-[#fffdfa] text-[#6d5e52] transition hover:border-red-300 hover:bg-red-50 hover:text-red-900 md:flex"
            title="Logout"
            onClick={handleLogout}
          >
            <FiLogOut size={17} />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9dfd4] bg-[#fffdfa] text-[#51463d] lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e9dfd4] bg-[#f7f3ed] px-4 py-4 lg:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#f5e9df] text-[#a96343]"
                        : "text-[#6d5e52] hover:bg-[#fffdfa] hover:text-[#382f28]"
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.name}
                </NavLink>
              );
            })}

            <button
              onClick={() => {
                setMenuOpen(false);
                navigate(profilePath);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#6d5e52] transition hover:bg-[#fffdfa] hover:text-[#382f28]"
            >
              <FiUser size={18} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-800 transition hover:bg-red-50"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
