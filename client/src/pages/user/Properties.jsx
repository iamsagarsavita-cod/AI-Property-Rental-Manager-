import { Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";

const sampleProperties = [
  {
    _id: "1",
    title: "Sunny 2BHK Apartment",
    location: "Andheri West, Mumbai",
    price: 18000,
    bedrooms: 2,
    bathrooms: 2,
    category: "Apartment",
  },
  {
    _id: "2",
    title: "Cozy Studio near Metro",
    location: "Koramangala, Bangalore",
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    category: "Studio",
  },
  {
    _id: "3",
    title: "Spacious 3BHK Villa",
    location: "Baner, Pune",
    price: 32000,
    bedrooms: 3,
    bathrooms: 3,
    category: "Villa",
  },
];

const Properties = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Browse Properties</h1>
        <p className="mt-1 text-sm text-slate-400">
          Find a place that feels like home.
        </p>

        {/* Search + Filter Bar */}
        <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title or location..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          <select className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
            <option>All Categories</option>
            <option>Apartment</option>
            <option>Studio</option>
            <option>Villa</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />

          <input
            type="number"
            placeholder="Max Price"
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        {/* Property Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sampleProperties.map((property) => (
            <Link
              to={`/user/properties/${property._id}`}
              key={property._id}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-indigo-500/50"
            >
              <div className="flex h-44 items-center justify-center bg-slate-800 text-slate-600">
                <FiHome size={36} />
              </div>

              <div className="p-4">
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
                  {property.category}
                </span>

                <h3 className="mt-3 font-semibold text-white group-hover:text-indigo-400">
                  {property.title}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <FiMapPin size={13} />
                  {property.location}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                  <p className="text-sm font-bold text-white">
                    ₹{property.price.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500">
                      /mo
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {property.bedrooms} Bed • {property.bathrooms} Bath
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400">
            <FiChevronLeft size={16} />
          </button>

          <span className="text-sm text-slate-400">Page 1 of 1</span>

          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400">
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Properties;
