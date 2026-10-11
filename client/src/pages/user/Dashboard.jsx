import { Link } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiSearch,
  FiZap,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

const Dashboard = () => {
  const [name, setName] = useState("");
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [latestProperties, setLatestProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    const [profileRes, propertiesRes, requestsRes] = await Promise.allSettled([
      api.get("/users/my-profile"),
      api.get("/properties/all-properties", { params: { limit: 3 } }),
      api.get("/rental-requests/my-requests"),
    ]);

    if (profileRes.status === "fulfilled") {
      setName(profileRes.value.data.user?.fullName || "");
    }

    if (propertiesRes.status === "fulfilled") {
      setLatestProperties(propertiesRes.value.data.properties || []);

      setTotalAvailable(propertiesRes.value.data.totalProperties || 0);
    }

    if (requestsRes.status === "fulfilled") {
      setRequests(requestsRes.value.data.rentalRequests || []);
    }

    setLoading(false);
  };

  const countBy = (status) =>
    requests.filter((r) => r.status === status).length;

  const stats = [
    { label: "Available Properties", value: totalAvailable, Icon: FiHome },
    { label: "My Requests", value: requests.length, Icon: FiFileText },
    { label: "Pending", value: countBy("pending"), Icon: FiClock },
    { label: "Approved", value: countBy("approved"), Icon: FiCheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">
          Welcome back{name ? `, ${name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Here's a quick look at your rental activity.
        </p>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading dashboard...
          </p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Icon size={16} />
                  </div>
                  <p className="mt-3 text-2xl font-bold">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to="/user/properties"
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-indigo-500/50"
              >
                <FiSearch className="text-indigo-400" />
                <span className="text-sm font-medium">
                  Browse all properties
                </span>
              </Link>
              <Link
                to="/user/recommended"
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-indigo-500/50"
              >
                <FiZap className="text-indigo-400" />
                <span className="text-sm font-medium">
                  See AI recommendations
                </span>
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Latest properties */}
              <div className="lg:col-span-2">
                <h2 className="mb-3 text-lg font-semibold">
                  Latest properties
                </h2>
                {latestProperties.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No properties available yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {latestProperties.map((p) => (
                      <Link
                        key={p._id}
                        to={`/user/properties/${p._id}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-indigo-500/50"
                      >
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <FiMapPin size={12} />
                            {p.location}
                          </p>
                        </div>
                        <p className="text-sm font-bold">
                          ₹{p.price.toLocaleString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent requests */}
              <div>
                <h2 className="mb-3 text-lg font-semibold">Recent requests</h2>
                {requests.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    You haven't sent any requests yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {requests.slice(0, 3).map((r) => (
                      <div
                        key={r._id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                      >
                        <p className="text-sm font-medium">
                          {r.propertyId?.title}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[r.status]}`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))}
                    <Link
                      to="/user/requests"
                      className="block text-center text-xs font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      View all requests
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
