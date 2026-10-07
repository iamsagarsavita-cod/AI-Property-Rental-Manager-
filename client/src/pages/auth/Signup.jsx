import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiArrowRight,
  FiCamera,
  FiHome,
  FiKey,
} from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    role: "user",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeImageHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile Image must be less than 2MB");
      return;
    }

    let allowedFiles = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    if (!allowedFiles.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const selectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("bio", formData.bio);
      data.append("role", formData.role);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      let response = await api.post("/users/signup", data);

      toast.success(response?.data?.msg || "Signup Successfull");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        bio: "",
        role: "user",
      });
      setProfileImage(null);
      setPreview(null);

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-violet-700 via-indigo-700 to-slate-950" />

          <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 font-bold backdrop-blur-xl">
                PR
              </div>

              <div>
                <h2 className="font-bold">Property Rental Manager</h2>
                <p className="text-xs text-white/60">Find. Rent. Manage.</p>
              </div>
            </div>

            <div className="max-w-lg">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/75 backdrop-blur-xl">
                Start Your Journey
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight xl:text-6xl">
                List, browse
                <span className="block text-cyan-300">or rent — your way.</span>
              </h1>

              <p className="mt-6 max-w-md leading-7 text-white/60">
                Create an account as a renter looking for a home, or as an owner
                ready to list your properties.
              </p>
            </div>

            <p className="text-sm text-white/40">Browse • List • Rent</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 font-bold">
                PR
              </div>

              <div>
                <h2 className="font-bold">Property Rental Manager</h2>
                <p className="text-xs text-slate-500">Find. Rent. Manage.</p>
              </div>
            </div>

            <div className="mb-7">
              <p className="mb-2 text-sm font-medium text-indigo-400">
                Get started
              </p>

              <h2 className="text-3xl font-bold">Create your account</h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Tell us who you are and we'll set up your dashboard.
              </p>
            </div>

            <form className="space-y-4" onSubmit={submitHandler}>
              {/* Role Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  I want to
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => selectRole("user")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-medium transition ${
                      formData.role === "user"
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <FiHome size={16} />
                    Rent a Property
                  </button>

                  <button
                    type="button"
                    onClick={() => selectRole("owner")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-medium transition ${
                      formData.role === "user"
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <FiKey size={16} />
                    List Properties
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-900 text-slate-500">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiCamera size={22} />
                  )}
                </div>

                <div>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={changeImageHandler}
                  />

                  <label
                    htmlFor="profileImage"
                    className="cursor-pointer text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Upload profile photo
                  </label>

                  <p className="mt-1 text-xs text-slate-600">
                    JPG, PNG, WEBP up to 2MB
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full name
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.fullName}
                    name="fullName"
                    onChange={changeHandler}
                  />
                </div>
              </div>

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
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.email}
                    name="email"
                    onChange={changeHandler}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone number
                </label>

                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.phone}
                    name="phone"
                    onChange={changeHandler}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.password}
                    name="password"
                    onChange={changeHandler}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Short bio
                  <span className="ml-2 text-xs text-slate-600">Optional</span>
                </label>

                <textarea
                  rows="3"
                  placeholder="Tell us a little about yourself..."
                  className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  value={formData.bio}
                  name="bio"
                  onChange={changeHandler}
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold transition hover:bg-indigo-500 active:scale-[0.99]"
              >
                Create Account
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
