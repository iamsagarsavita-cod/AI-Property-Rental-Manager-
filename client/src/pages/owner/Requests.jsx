import {
  FiMapPin,
  FiUser,
  FiCheck,
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const statusStyles = {
  pending: { text: "text-amber-400", bg: "bg-amber-500/10", Icon: FiClock },
  approved: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    Icon: FiCheckCircle,
  },
  rejected: { text: "text-red-400", bg: "bg-red-500/10", Icon: FiXCircle },
};

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rental-requests/property-requests");
      setRequests(res.data.rentalRequests);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.msg || "Failed to load requests");
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      setActingOn(requestId);

      const method = action === "approve" ? "put" : "patch";
      const res = await api[method](`/rental-requests/${action}/${requestId}`);
      toast.success(res.data.msg);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Action failed");
    } finally {
      setActingOn(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Rental Requests</h1>
        <p className="mt-1 text-sm text-slate-400">
          Requests from users interested in your properties.
        </p>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            No rental requests yet.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {requests.map((req) => {
              const { text, bg, Icon } = statusStyles[req.status];
              const isActing = actingOn === req._id;

              return (
                <div
                  key={req._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{req.propertyId?.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <FiMapPin size={13} />
                        {req.propertyId?.location}
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${bg} ${text}`}
                    >
                      <Icon size={13} />
                      {req.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3 text-sm text-slate-300">
                    <FiUser size={14} className="text-slate-500" />
                    {req.userId?.fullName}
                  </div>

                  {req.message && (
                    <p className="mt-1.5 text-sm italic text-slate-500">
                      "{req.message}"
                    </p>
                  )}

                  {req.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => respondToRequest(req._id, "approve")}
                        disabled={isActing}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-semibold transition hover:bg-emerald-500 disabled:opacity-60"
                      >
                        <FiCheck size={14} />
                        {isActing ? "Please wait..." : "Approve"}
                      </button>
                      <button
                        onClick={() => respondToRequest(req._id, "reject")}
                        disabled={isActing}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                      >
                        <FiX size={14} />
                        {isActing ? "Please wait..." : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
