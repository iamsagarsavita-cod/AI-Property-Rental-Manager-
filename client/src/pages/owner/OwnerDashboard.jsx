import { Link } from "react-router-dom";
import {
  FiHome,
  FiCheckCircle,
  FiKey,
  FiInbox,
  FiPlus,
  FiGrid,
  FiUser,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const OwnerDashboard = () => {
  const [name, setName] = useState("");
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    const [profileRes, propertiesRes, requestsRes] = await Promise.allSettled([
      api.get("/users/my-profile"),
      api.get("/properties/my-properties"),
      api.get("/rental-requests/property-requests"),
    ]);

    if (profileRes.status === "fulfilled") {
      setName(profileRes.value.data.user?.fullName || "");
    }
    if (propertiesRes.status === "fulfilled") {
      setProperties(propertiesRes.value.data.properties || []);
    }
    if (requestsRes.status === "fulfilled") {
      setRequests(requestsRes.value.data.rentalRequests || []);
    }

    setLoading(false);
  };
  const pendingRequests = requests.filter((r) => r.status === "pending");

  const stats = [
    { label: "My Properties", value: properties.length, Icon: FiHome },
    {
      label: "Available",
      value: properties.filter((p) => p.status === "available").length,
      Icon: FiCheckCircle,
    },
    {
      label: "Rented",
      value: properties.filter((p) => p.status === "rented").length,
      Icon: FiKey,
    },
    { label: "Pending Requests", value: pendingRequests.length, Icon: FiInbox },
  ];

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">
          Welcome back{name ? `, ${name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-[#6d5e52]">
          Here's how your properties are doing.
        </p>

        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            Loading dashboard...
          </p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#e9dfd4] bg-white p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5e9df] text-[#a96343]">
                    <Icon size={16} />
                  </div>
                  <p className="mt-3 text-2xl font-bold">{value}</p>
                  <p className="text-xs text-[#837468]">{label}</p>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to="/owner/properties/add"
                className="flex items-center gap-3 rounded-2xl border border-[#e9dfd4] bg-white p-4 transition hover:border-[#c89071]"
              >
                <FiPlus className="text-[#a96343]" />
                <span className="text-sm font-medium">Add a new property</span>
              </Link>
              <Link
                to="/owner/properties"
                className="flex items-center gap-3 rounded-2xl border border-[#e9dfd4] bg-white p-4 transition hover:border-[#c89071]"
              >
                <FiGrid className="text-[#a96343]" />
                <span className="text-sm font-medium">
                  Manage my properties
                </span>
              </Link>
            </div>

            {/* Pending requests */}
            <h2 className="mb-3 mt-8 text-lg font-semibold">
              Requests waiting for you
            </h2>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-[#837468]">
                No pending requests right now.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between rounded-2xl border border-[#e9dfd4] bg-white p-4"
                  >
                    <div>
                      <p className="font-medium">{r.propertyId?.title}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#837468]">
                        <FiUser size={12} />
                        {r.userId?.fullName}
                      </p>
                    </div>
                    <Link
                      to="/owner/requests"
                      className="rounded-lg bg-[#a96343] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#8f5035]"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
