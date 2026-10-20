import { Link } from "react-router-dom";
import { FiMapPin, FiHome, FiZap } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const Recommended = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ai/recommend");

      setProperties(res.data.recommendedProperty || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.msg || "Failed to get recommendations",
        );
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <FiZap size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Recommended for You</h1>
            <p className="mt-1 text-sm text-slate-400">
              AI picks based on the properties you've shown interest in.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            AI is finding the best matches for you...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            No recommendations available right now.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link
                key={property._id}
                to={`/user/properties/${property._id}`}
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

                  <h3 className="mt-3 font-semibold group-hover:text-indigo-400">
                    {property.title}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <FiMapPin size={13} />
                    {property.location}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                    <p className="text-sm font-bold">
                      ₹{property.price.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500">
                        /mo
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {property.bedRooms} Bed • {property.bathRooms} Bath
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommended;