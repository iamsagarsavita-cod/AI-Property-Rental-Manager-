import { Link } from "react-router-dom";
import { FiMapPin, FiHome, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const statusStyles = {
  available: "bg-emerald-500/10 text-emerald-400",
  rented: "bg-amber-500/10 text-amber-400",
  inactive: "bg-slate-700 text-slate-400",
};

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/properties/my-properties");
      setProperties(res.data.properties);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.msg || "Failed to load properties");
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );
    if (!confirmed) return;

    try {
      const res = await api.delete(`/properties/delete/${id}`);
      toast.success(res.data.msg || "Property Deleted Successfully");
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete property");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage the properties you've listed.
            </p>
          </div>

          <Link
            to="/owner/properties/add"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-500"
          >
            <FiPlus size={16} />
            Add Property
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading your properties...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            You haven't listed any properties yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property._id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
              >
                <div className="flex h-40 items-center justify-center overflow-hidden bg-slate-800 text-slate-600">
                  {property.images?.[0] ? (
                    <img
                      src={imageUrl(property.images[0])}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiHome size={32} />
                  )}
                </div>

                <div className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[property.status]}`}
                  >
                    {property.status}
                  </span>

                  <h3 className="mt-3 font-semibold">{property.title}</h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <FiMapPin size={13} />
                    {property.location}
                  </p>

                  <p className="mt-2 text-sm font-bold">
                    ₹{property.price.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500">
                      /mo
                    </span>
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-slate-800 pt-3">
                    <Link
                      to={`/owner/properties/edit/${property._id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-800 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                      <FiEdit2 size={13} />
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProperty(property._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                    >
                      <FiTrash2 size={13} />
                      Delete
                    </button>
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

export default MyProperties;
