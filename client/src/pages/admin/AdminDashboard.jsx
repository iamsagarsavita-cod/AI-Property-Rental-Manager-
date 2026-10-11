import { FiUsers, FiHome, FiGrid, FiFileText } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard-stats");
      setStats(res.data.stats);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to load dashboard stats",
      );
    } finally {
      setLoading(false);
    }
  };

  const groups = stats
    ? [
        {
          title: "Users",
          Icon: FiUsers,
          items: [
            { label: "Total Users", value: stats.users?.totalUsers || 0 },
            { label: "Total Owners", value: stats.users?.totalOwners || 0 },
          ],
        },
        {
          title: "Categories",
          Icon: FiGrid,
          items: [
            {
              label: "Total Categories",
              value: stats.categories?.totalCategories || 0,
            },
          ],
        },
        {
          title: "Properties",
          Icon: FiHome,
          items: [
            { label: "Total", value: stats.properties?.totalProperties || 0 },
            {
              label: "Available",
              value: stats.properties?.availableProperties || 0,
            },
            { label: "Rented", value: stats.properties?.rentedProperties || 0 },
            {
              label: "Inactive",
              value: stats.properties?.inactiveProperties || 0,
            },
          ],
        },
        {
          title: "Rental Requests",
          Icon: FiFileText,
          items: [
            {
              label: "Total",
              value: stats.rentalRequests?.totalRentalRequests || 0,
            },
            {
              label: "Pending",
              value: stats.rentalRequests?.pendingRequests || 0,
            },
            {
              label: "Approved",
              value: stats.rentalRequests?.approvedRequests || 0,
            },
            {
              label: "Rejected",
              value: stats.rentalRequests?.rejectedRequests || 0,
            },
          ],
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of everything happening on the platform.
        </p>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading stats...
          </p>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {groups.map(({ title, Icon, items }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Icon size={16} />
                  </div>
                  <h2 className="font-semibold">{title}</h2>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {items.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
