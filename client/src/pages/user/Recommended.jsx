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
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e9df] text-[#a96343]">
            <FiZap size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Recommended for You</h1>
            <p className="mt-1 text-sm text-[#6d5e52]">
              AI picks based on the properties you've shown interest in.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            AI is finding the best matches for you...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            No recommendations available right now.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link
                key={property._id}
                to={`/user/properties/${property._id}`}
                className="group overflow-hidden rounded-2xl border border-[#e9dfd4] bg-white transition hover:border-[#c89071]"
              >
                <div className="flex h-44 items-center justify-center overflow-hidden bg-[#f3ede5] text-[#9b8b7d]">
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
                  <span className="rounded-full bg-[#f5e9df] px-2.5 py-1 text-[11px] font-medium text-[#a96343]">
                    {property.categoryId?.categoryName || "Property"}
                  </span>

                  <h3 className="mt-3 font-semibold group-hover:text-[#8f5035]">
                    {property.title}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#837468]">
                    <FiMapPin size={13} />
                    {property.location}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#e9dfd4] pt-3">
                    <p className="text-sm font-bold">
                      ₹{property.price.toLocaleString()}
                      <span className="text-xs font-normal text-[#837468]">
                        /mo
                      </span>
                    </p>
                    <p className="text-xs text-[#837468]">
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