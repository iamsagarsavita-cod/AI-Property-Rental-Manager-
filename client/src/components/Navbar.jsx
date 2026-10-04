import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiSearch,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";

const navLinks = [
  { name: "Dashboard", path: "/user/dashboard", icon: FiHome },
  { name: "Browse", path: "/user/properties", icon: FiSearch },
  { name: "My Requests", path: "/user/requests", icon: FiFileText },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/user/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold shadow-lg shadow-indigo-500/20">
            PR
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white">
              Property Rental Manager
            </h1>
            <p className="text-[10px] text-slate-500">User Panel</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
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
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
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
          <button className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold">
              <FiUser size={14} />
            </div>
            <span className="text-sm font-medium text-slate-300">Profile</span>
          </button>

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 md:flex"
            title="Logout"
          >
            <FiLogOut size={17} />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 lg:hidden">
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
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.name}
                </NavLink>
              );
            })}

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10">
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
