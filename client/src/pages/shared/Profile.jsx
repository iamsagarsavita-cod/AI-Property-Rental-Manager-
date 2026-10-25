import {
  FiUser,
  FiMail,
  FiPhone,
  FiCamera,
  FiLock,
  FiTrash2,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
  });

  const [role, setRole] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/my-profile");
      const user = res.data.user;

      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bio: user.bio || "",
        password: "",
      });
      setRole(user.role);
      setExistingImage(user.profileImage);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile Image must be less than 2MB");
      return;
    }

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);

      if (formData.password) {
        data.append("password", formData.password);
      }

      if (newImage) {
        data.append("profileImage", newImage);
      }

      const res = await api.put("/users/update", data);
      toast.success(res.data.msg || "Profile Updated Successfully");

      setFormData((prev) => ({ ...prev, password: "" }));
      setExistingImage(res.data.updatedUserProfile.profileImage);
      setNewImage(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await api.delete("/users/delete");
      toast.success("Account deleted");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
        <Navbar />
        <p className="py-20 text-center text-sm text-[#837468]">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-sm text-[#6d5e52]">
          Manage your account information.
        </p>

        <form
          onSubmit={submitHandler}
          className="mt-6 space-y-5 rounded-2xl border border-[#e9dfd4] bg-white p-6"
        >
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-[#ddcfc1] bg-[#f3ede5] text-[#837468]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : existingImage ? (
                <img
                  src={imageUrl(existingImage)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser size={28} />
              )}
            </div>

            <div>
              <input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={changeImageHandler}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#a96343] hover:text-[#8f5035]"
              >
                <FiCamera size={15} />
                Change photo
              </label>
              <p className="mt-1 text-xs text-[#9b8b7d]">
                JPG, PNG, WEBP up to 2MB
              </p>
            </div>
          </div>

          {/* Role badge */}
          <div>
            <span className="rounded-full bg-[#f5e9df] px-3 py-1 text-xs font-medium capitalize text-[#a96343]">
              {role}
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              Full name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a96343]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              Email address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a96343]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              Phone number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a96343]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              Bio
              <span className="ml-2 text-xs text-[#9b8b7d]">Optional</span>
            </label>
            <textarea
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={changeHandler}
              className="w-full resize-none rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-3 text-sm outline-none focus:border-[#a96343]"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              New password
              <span className="ml-2 text-xs text-[#9b8b7d]">
                Leave blank to keep current
              </span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#a96343] py-3.5 text-sm font-semibold transition hover:bg-[#8f5035] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Danger Zone */}
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-sm font-semibold text-red-800">Danger Zone</h2>
          <p className="mt-1 text-xs text-[#837468]">
            Deleting your account is permanent and cannot be undone.
          </p>

          <button
            onClick={deleteAccount}
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-800 transition hover:bg-red-50"
          >
            <FiTrash2 size={15} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
