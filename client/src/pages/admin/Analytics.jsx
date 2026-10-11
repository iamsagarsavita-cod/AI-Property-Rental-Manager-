import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const Bar = ({ label, value, total, color }) => (
  <div>
    <div className="mb-1.5 flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-300">{value}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${total ? (value / total) * 100 : 0}%` }}
      />
    </div>
  </div>
);

const statusStyles = {
  pending: { text: "text-amber-400", bg: "bg-amber-500/10", Icon: FiClock },
  approved: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    Icon: FiCheckCircle,
  },
  rejected: { text: "text-red-400", bg: "bg-red-500/10", Icon: FiXCircle },
};

const tabs = ["all", "pending", "approved", "rejected"];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard-stats")
      .then((res) => setStats(res.data.stats))
      .catch((error) =>
        toast.error(error.response?.data?.msg || "Failed to load stats"),
      );
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const params = {};
      if (activeTab !== "all") params.status = activeTab;

      const res = await api.get("/admin/all-rental-requests", { params });
      setRequests(res.data.rentalRequests || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.msg || "Failed to load requests");
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const p = stats?.properties;
  const r = stats?.rentalRequests;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Platform statistics and all rental requests.
        </p>

        {stats && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold">Properties by status</h2>
              <Bar
                label="Available"
                value={p?.availableProperties || 0}
                total={p?.totalProperties || 0}
                color="bg-emerald-500"
              />
              <Bar
                label="Rented"
                value={p?.rentedProperties || 0}
                total={p?.totalProperties || 0}
                color="bg-amber-500"
              />
              <Bar
                label="Inactive"
                value={p?.inactiveProperties || 0}
                total={p?.totalProperties || 0}
                color="bg-slate-500"
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold">Rental requests by status</h2>
              <Bar
                label="Pending"
                value={r?.pendingRequests || 0}
                total={r?.totalRentalRequests || 0}
                color="bg-amber-500"
              />
              <Bar
                label="Approved"
                value={r?.approvedRequests || 0}
                total={r?.totalRentalRequests || 0}
                color="bg-emerald-500"
              />
              <Bar
                label="Rejected"
                value={r?.rejectedRequests || 0}
                total={r?.totalRentalRequests || 0}
                color="bg-red-500"
              />
            </div>
          </div>
        )}

        {/* Rental requests overview */}
        <h2 className="mt-8 text-lg font-semibold">All Rental Requests</h2>

        <div className="mt-3 flex flex-wrap gap-2">
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
          <p className="mt-8 text-center text-sm text-slate-500">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            No rental requests found.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {requests.map((req) => {
              const { text, bg, Icon } = statusStyles[req.status];
              return (
                <div
                  key={req._id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold">{req.propertyId?.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Requested by {req.userId?.fullName} • Owner:{" "}
                      {req.ownerId?.fullName}
                    </p>
                  </div>

                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${bg} ${text}`}
                  >
                    <Icon size={13} />
                    {req.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
