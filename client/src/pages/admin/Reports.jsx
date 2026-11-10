import {
  FiFlag,
  FiMapPin,
  FiUser,
  FiCheck,
  FiX,
  FiShieldOff,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const filters = ["open", "reviewed", "dismissed", "all"];

const reasonLabels = {
  misleading_listing: "Misleading listing",
  incorrect_price: "Incorrect price",
  duplicate_listing: "Duplicate listing",
  scam_or_suspicious: "Scam or suspicious",
  inappropriate_content: "Inappropriate content",
  other: "Other",
};

const statusStyles = {
  open: "bg-amber-100 text-amber-800",
  reviewed: "bg-emerald-100 text-emerald-800",
  dismissed: "bg-[#e3d7ca] text-[#6d5e52]",
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [activeFilter, setActiveFilter] = useState("open");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [activeFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = activeFilter === "all" ? {} : { status: activeFilter };
      const res = await api.get("/admin/reports", { params });
      setReports(res.data.reports || []);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (report, status) => {
    try {
      setUpdatingId(report._id);
      const res = await api.patch(`/admin/reports/${report._id}/status`, {
        status,
      });
      toast.success(res.data.msg);
      if (activeFilter !== "all" && status !== activeFilter) {
        setReports((current) => current.filter((item) => item._id !== report._id));
      } else {
        setReports((current) =>
          current.map((item) =>
            item._id === report._id ? { ...item, status } : item,
          ),
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Could not update report");
    } finally {
      setUpdatingId(null);
    }
  };

  const unpublishListing = async (report) => {
    try {
      setUpdatingId(report._id);
      await api.patch(
        `/admin/properties/${report.propertyId._id}/verification`,
        { isVerified: false },
      );
      setReports((current) =>
        current.map((item) =>
          item._id === report._id
            ? {
                ...item,
                propertyId: { ...item.propertyId, isVerified: false },
              }
            : item,
        ),
      );
      toast.success("Reported listing unpublished");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Could not unpublish listing");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e9df] text-[#a96343]">
            <FiFlag size={19} />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Listing reports</h1>
            <p className="mt-1 text-sm text-[#6d5e52]">
              Review concerns submitted by users and decide what action to take.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                activeFilter === filter
                  ? "bg-[#a96343] text-white"
                  : "border border-[#e9dfd4] bg-white text-[#6d5e52] hover:text-[#382f28]"
              }`}
            >
              {filter === "open" ? "Needs review" : filter}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            Loading reports...
          </p>
        ) : reports.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#e9dfd4] bg-white p-8 text-center">
            <p className="font-medium">No {activeFilter === "all" ? "" : `${activeFilter} `}reports</p>
            <p className="mt-1 text-sm text-[#837468]">
              New listing reports will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {reports.map((report) => (
              <article
                key={report._id}
                className="rounded-2xl border border-[#e9dfd4] bg-white p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f5e9df] px-2.5 py-1 text-xs font-medium text-[#a96343]">
                        {reasonLabels[report.reason] || report.reason}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[report.status]}`}>
                        {report.status}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold">
                      {report.propertyId?.title || "Property was removed"}
                    </h2>
                    {report.propertyId && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#837468]">
                        <FiMapPin size={12} /> {report.propertyId.location}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#837468]">
                      <FiUser size={12} /> Reported by {report.reporterId?.fullName || "Unknown user"}
                      {report.reporterId?.email ? ` · ${report.reporterId.email}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-[#9b8b7d]">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {report.message && (
                  <p className="mt-4 rounded-xl bg-[#f7f3ed] p-3 text-sm leading-6 text-[#6d5e52]">
                    {report.message}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-[#e9dfd4] pt-4">
                  <Link
                    to="/admin/properties"
                    className="rounded-lg border border-[#e9dfd4] px-3 py-2 text-xs font-medium text-[#6d5e52] hover:border-[#c89071]"
                  >
                    Review listings
                  </Link>
                  <div className="flex gap-2">
                    {report.propertyId?.isVerified && (
                      <button
                        disabled={updatingId === report._id}
                        onClick={() => unpublishListing(report)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
                      >
                        <FiShieldOff size={13} /> Unpublish listing
                      </button>
                    )}
                    {report.status !== "reviewed" && (
                      <button
                        disabled={updatingId === report._id}
                        onClick={() => updateStatus(report, "reviewed")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                      >
                        <FiCheck size={13} /> Mark reviewed
                      </button>
                    )}
                    {report.status !== "dismissed" && (
                      <button
                        disabled={updatingId === report._id}
                        onClick={() => updateStatus(report, "dismissed")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e9dfd4] px-3 py-2 text-xs font-semibold text-[#6d5e52] hover:border-red-300 hover:text-red-800 disabled:opacity-50"
                      >
                        <FiX size={13} /> Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
