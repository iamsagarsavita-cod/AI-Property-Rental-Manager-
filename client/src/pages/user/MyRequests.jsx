import { FiMapPin, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
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

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rental-requests/my-requests");
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">My Rental Requests</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track the status of properties you've requested.
        </p>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            You haven't sent any rental requests yet.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {requests.map((req) => {
              const { text, bg, Icon } = statusStyles[req.status];

              return (
                <div
                  key={req._id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold">{req.propertyId?.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <FiMapPin size={13} />
                      {req.propertyId?.location}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-300">
                      ₹{req.propertyId?.price?.toLocaleString()}/mo
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

export default MyRequests;
