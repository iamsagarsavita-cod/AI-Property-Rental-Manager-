import { FiMapPin, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Navbar from "../../components/Navbar";

const sampleRequests = [
  {
    _id: "r1",
    propertyTitle: "Sunny 2BHK Apartment",
    location: "Andheri West, Mumbai",
    price: 18000,
    status: "pending",
  },
  {
    _id: "r2",
    propertyTitle: "Cozy Studio near Metro",
    location: "Koramangala, Bangalore",
    price: 12000,
    status: "approved",
  },
  {
    _id: "r3",
    propertyTitle: "Spacious 3BHK Villa",
    location: "Baner, Pune",
    price: 32000,
    status: "rejected",
  },
];

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
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">My Rental Requests</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track the status of properties you've requested.
        </p>

        <div className="mt-6 space-y-3">
          {sampleRequests.map((req) => {
            const { text, bg, Icon } = statusStyles[req.status];

            return (
              <div
                key={req._id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">{req.propertyTitle}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <FiMapPin size={13} />
                    {req.location}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-300">
                    ₹{req.price.toLocaleString()}/mo
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
      </div>
    </div>
  );
};

export default MyRequests;
