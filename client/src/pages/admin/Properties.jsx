import { FiMapPin, FiUser, FiShield, FiShieldOff } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import PropertyImageCarousel from "../../components/PropertyImageCarousel";

const statusStyles = {
  available: "bg-emerald-100 text-emerald-800",
  rented: "bg-amber-100 text-amber-800",
  inactive: "bg-[#e3d7ca] text-[#6d5e52]",
};

const tabs = ["all", "available", "rented", "inactive"];

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [verificationUpdating, setVerificationUpdating] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [activeTab, verificationFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = {};
      if (activeTab !== "all") params.status = activeTab;
      if (verificationFilter !== "all") {
        params.verification = verificationFilter;
      }

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

  const togglePropertyVerification = async (property) => {
    try {
      setVerificationUpdating(property._id);
      const isVerified = !property.isVerified;
      const res = await api.patch(
        `/admin/properties/${property._id}/verification`,
        { isVerified },
      );
      setProperties((current) =>
        current.map((item) =>
          item._id === property._id ? { ...item, isVerified } : item,
        ),
      );
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Could not update listing status");
    } finally {
      setVerificationUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">All Properties</h1>
        <p className="mt-1 text-sm text-[#6d5e52]">
          Every property listed on the platform, across all owners.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-[#a96343] text-white"
                  : "border border-[#e9dfd4] bg-[#fffdfa] text-[#6d5e52] hover:text-[#382f28]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["all", "All review states"],
            ["pending", "Needs review"],
            ["verified", "Published"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setVerificationFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                verificationFilter === value
                  ? "bg-[#382f28] text-white"
                  : "border border-[#e9dfd4] bg-white text-[#6d5e52] hover:border-[#c89071]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            Loading properties...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            No properties found.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div
                key={p._id}
                className="overflow-hidden rounded-2xl border border-[#e9dfd4] bg-white"
              >
                <PropertyImageCarousel
                  images={p.images}
                  title={p.title}
                  heightClass="h-36"
                  autoPlay
                  showArrows={false}
                />

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f5e9df] px-2.5 py-1 text-[11px] font-medium text-[#a96343]">
                      {p.categoryId?.categoryName || "Property"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        p.isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.isVerified ? "Published" : "Needs review"}
                    </span>
                    <button
                      disabled={verificationUpdating === p._id}
                      onClick={() => togglePropertyVerification(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e9dfd4] px-2.5 py-1.5 text-xs font-medium text-[#6d5e52] transition hover:border-[#c89071] disabled:opacity-50"
                    >
                      {p.isVerified ? <FiShieldOff size={13} /> : <FiShield size={13} />}
                      {verificationUpdating === p._id
                        ? "Saving..."
                        : p.isVerified
                          ? "Unpublish"
                          : "Approve listing"}
                    </button>
                  </div>

                  <h3 className="mt-3 font-semibold">{p.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#837468]">
                    <FiMapPin size={13} />
                    {p.location}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#e9dfd4] pt-3">
                    <p className="text-sm font-bold">
                      ₹{p.price.toLocaleString()}
                      <span className="text-xs font-normal text-[#837468]">
                        /mo
                      </span>
                    </p>

                    <p className="flex items-center gap-1.5 text-xs text-[#837468]">
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
