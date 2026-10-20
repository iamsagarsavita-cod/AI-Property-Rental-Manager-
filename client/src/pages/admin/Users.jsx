import { FiUser, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const roleStyles = {
  user: "bg-sky-500/10 text-sky-400",
  owner: "bg-amber-500/10 text-amber-400",
  admin: "bg-indigo-500/10 text-indigo-400",
};

const tabs = ["all", "user", "owner", "admin"];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};
      if (activeTab !== "all") params.role = activeTab;

      const res = await api.get("/users/all-users", { params });
      setUsers(res.data.users || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.msg || "Failed to load users");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm("Delete this user permanently?");
    if (!confirmed) return;

    try {
      const res = await api.delete(`/users/delete-user/${id}`);
      toast.success(res.data.msg || "User Deleted Successfully");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-400">
          View and remove users and property owners.
        </p>

        {/* Role filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading users...
          </p>
        ) : users.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            No users found.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full min-w-150 text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-800/60 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-slate-500">
                          {user.profileImage ? (
                            <img
                              src={imageUrl(user.profileImage)}
                              alt={user.fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiUser size={15} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${roleStyles[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          <FiTrash2 size={13} />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
