import { Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/all-categories");
        console.log(res);

        setCategories(res.data.category);
      } catch (error) {
        console.log(error.response?.data?.msg);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProperties();
    }, 400);

    return () => clearTimeout(delay);
  }, [filters, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = { page, limit: 6 };
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await api.get("/properties/all-properties", { params });

      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      if (error.response?.status === 404) {
        setProperties([]);
        setTotalPages(1);
      } else {
        toast.error(error.response?.data?.msg || "Failed to load properties");
      }
    } finally {
      setLoading(false);
    }
  };

  const changeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

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
              name="search"
              placeholder="Search by title or location..."
              value={filters.search}
              onChange={changeFilter}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={changeFilter}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={changeFilter}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={changeFilter}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading properties...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            No properties found. Try changing your filters.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link
                to={`/user/properties/${property._id}`}
                key={property._id}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-indigo-500/50"
              >
                <div className="flex h-44 items-center justify-center overflow-hidden bg-slate-800 text-slate-600">
                  {property.images?.[0] ? (
                    <img
                      src={imageUrl(property.images[0])}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiHome size={36} />
                  )}
                </div>

                <div className="p-4">
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
                    {property.categoryId?.categoryName || "Property"}
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-40"
            >
              <FiChevronLeft size={16} />
            </button>

            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-40"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
