import { FiHome, FiMapPin, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const statusStyles = {
  available: "bg-emerald-500/10 text-emerald-400",
  rented: "bg-amber-500/10 text-amber-400",
  inactive: "bg-slate-700 text-slate-400",
};

const tabs = ["all", "available", "rented", "inactive"];

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchProperties();
  }, [activeTab]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = {};
      if (activeTab !== "all") params.status = activeTab;

      const res = await api.get("/admin/all-properties", { params });
      setProperties(res.data.properties || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.msg || "Failed to load properties");
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">All Properties</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every property listed on the platform, across all owners.
        </p>

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
            Loading properties...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            No properties found.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div
                key={p._id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
              >
                <div className="flex h-36 items-center justify-center overflow-hidden bg-slate-800 text-slate-600">
                  {p.images?.[0] ? (
                    <img
                      src={imageUrl(p.images[0])}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiHome size={30} />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
                      {p.categoryId?.categoryName || "Property"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold">{p.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <FiMapPin size={13} />
                    {p.location}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                    <p className="text-sm font-bold">
                      ₹{p.price.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500">
                        /mo
                      </span>
                    </p>

                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FiUser size={12} />
                      {p.ownerId?.fullName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
