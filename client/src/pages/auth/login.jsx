import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const dashBoardByRole = {
  user: "/user/dashboard",
  owner: "/owner-dashboard",
  admin: "/admin-dashboard",
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);

      let role = response?.data?.user?.role;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);

      toast.success(response.data.msg || "Login Successfull");

      navigate(dashBoardByRole[role] || "/login");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen md:grid-cols-2">
        {/* Left Section */}
        <div className="relative hidden overflow-hidden md:flex">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-700 to-slate-950" />

          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur-xl">
                  PR
                </div>

                <div>
                  <h2 className="text-lg font-bold">Property Rental Manager</h2>
                  <p className="text-xs text-white/60">Find. Rent. Manage.</p>
                </div>
              </div>

              <div className="max-w-lg pt-12">
                <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-xl">
                  AI Powered Property Rentals
                </span>

                <h1 className="text-5xl font-bold leading-tight xl:text-6xl">
                  Find your next home.
                  <span className="block text-cyan-300">
                    Rent it with ease.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-white/65 mb-3">
                  Browse verified properties, connect with owners and track your
                  rental requests, all in one place.
                </p>
              </div>
            </div>

            <div className="grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xl font-bold">AI</p>
                <p className="mt-1 text-xs text-white/55">Smart Matches</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xl font-bold">Verified</p>
                <p className="mt-1 text-xs text-white/55">Listings</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xl font-bold">Track</p>
                <p className="mt-1 text-xs text-white/55">Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 font-bold">
                PR
              </div>

              <div>
                <h2 className="font-bold">Property Rental Manager</h2>
                <p className="text-xs text-slate-500">Find. Rent. Manage.</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-indigo-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Continue browsing or managing your rental properties.
              </p>
            </div>

            <form className="space-y-5" onSubmit={submitHandler}>
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.email}
                    onChange={changeHandler}
                    name="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.password}
                    name="password"
                    onChange={changeHandler}
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold transition hover:bg-indigo-500 active:scale-[0.99]"
              >
                {loading ? "Signing In.." : "Sign In"}
                {!loading && (
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-600">OR</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
