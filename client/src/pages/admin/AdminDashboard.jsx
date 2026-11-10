import {
  FiUsers,
  FiHome,
  FiGrid,
  FiFileText,
  FiShield,
  FiFlag,
  FiArrowUpRight,
  FiCheckCircle,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async (showError = true) => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data.stats);
      } catch (error) {
        if (showError) {
          toast.error(
            error.response?.data?.msg || "Failed to load dashboard stats",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    const refreshDashboard = () => {
      if (document.visibilityState === "visible") {
        fetchStats(false);
      }
    };

    fetchStats();
    const refreshInterval = window.setInterval(refreshDashboard, 15000);
    window.addEventListener("focus", refreshDashboard);
    document.addEventListener("visibilitychange", refreshDashboard);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshDashboard);
      document.removeEventListener("visibilitychange", refreshDashboard);
    };
  }, []);

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
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-[#6d5e52]">
          Overview of everything happening on the platform.
        </p>

        <div className="mt-6 rounded-2xl border border-[#e9dfd4] bg-white p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#a96343]">
                Admin workspace
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                Review and manage the marketplace
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["Owners", "/admin/users"],
                ["Listings", "/admin/properties"],
                ["Reports", "/admin/reports"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#e9dfd4] px-3 py-2 text-xs font-medium text-[#6d5e52] transition hover:border-[#c89071] hover:text-[#a96343]"
                >
                  {label} <FiArrowUpRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            Loading stats...
          </p>
        ) : (
          <>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {groups.map(({ title, Icon, items }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#e9dfd4] bg-white p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5e9df] text-[#a96343]">
                      <Icon size={16} />
                    </div>
                    <h2 className="font-semibold">{title}</h2>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {items.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] p-3"
                      >
                        <p className="text-2xl font-bold">{item.value}</p>
                        <p className="mt-0.5 text-xs text-[#837468]">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <h2 className="mt-8 text-lg font-semibold">Needs your review</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Owners awaiting verification",
                  value: stats?.users?.pendingOwnerVerifications || 0,
                  href: "/admin/users",
                  Icon: FiShield,
                },
                {
                  label: "Listings awaiting approval",
                  value: stats?.properties?.pendingPropertyReviews || 0,
                  href: "/admin/properties",
                  Icon: FiHome,
                },
                {
                  label: "Open reports",
                  value: stats?.reports?.openReports || 0,
                  href: "/admin/reports",
                  Icon: FiFlag,
                },
              ].map(({ label, value, href, Icon }) => (
                <Link
                  key={label}
                  to={href}
                  className="flex items-center justify-between rounded-2xl border border-[#e9dfd4] bg-white p-4 transition hover:border-[#c89071]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e9df] text-[#a96343]">
                      <Icon size={17} />
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="flex items-center gap-2 text-lg font-bold">
                    {value}
                    <FiArrowUpRight className="text-[#a96343]" size={15} />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <FiCheckCircle size={16} />
              Metrics refresh automatically while this page is open.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
