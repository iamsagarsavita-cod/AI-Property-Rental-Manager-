import { FiMapPin, FiHome, FiUser, FiPhone, FiMail } from "react-icons/fi";
import Navbar from "../../components/Navbar";

const PropertyDetails = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Image */}
        <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-800 text-slate-600 sm:h-96">
          <FiHome size={48} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
              Apartment
            </span>

            <h1 className="mt-3 text-2xl font-bold">Sunny 2BHK Apartment</h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
              <FiMapPin size={14} />
              Andheri West, Mumbai
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                <p className="text-lg font-bold">2</p>
                <p className="text-xs text-slate-500">Bedrooms</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                <p className="text-lg font-bold">2</p>
                <p className="text-xs text-slate-500">Bathrooms</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                <p className="text-lg font-bold">950</p>
                <p className="text-xs text-slate-500">Sq.ft</p>
              </div>
            </div>

            <h2 className="mt-6 text-sm font-semibold text-slate-300">
              Description
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A bright and airy 2BHK apartment close to the metro station, with
              modern fittings and ample natural light throughout.
            </p>
          </div>

          {/* Right: Owner card + Request button */}
          <div className="h-fit rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-2xl font-bold">
              ₹18,000
              <span className="text-sm font-normal text-slate-500">/month</span>
            </p>

            <div className="mt-5 border-t border-slate-800 pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Listed by
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                  <FiUser size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Rahul Sharma</p>
                  <p className="text-xs text-slate-500">Property Owner</p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                  <FiMail size={12} /> owner@example.com
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone size={12} /> +91 98765 43210
                </p>
              </div>
            </div>

            <textarea
              rows="3"
              placeholder="Add a message for the owner (optional)"
              className="mt-5 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />

            <button className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold transition hover:bg-indigo-500">
              Send Rental Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
