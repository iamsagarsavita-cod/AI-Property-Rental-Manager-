import { Link } from "react-router-dom";
import { FiMapPin, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import PropertyImageCarousel from "../../components/PropertyImageCarousel";

const statusStyles = {
  available: "bg-emerald-100 text-emerald-800",
  rented: "bg-amber-100 text-amber-800",
  inactive: "bg-[#e3d7ca] text-[#6d5e52]",
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
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="mt-1 text-sm text-[#6d5e52]">
              Manage the properties you've listed.
            </p>
          </div>

          <Link
            to="/owner/properties/add"
            className="flex items-center gap-2 rounded-xl bg-[#a96343] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#8f5035]"
          >
            <FiPlus size={16} />
            Add Property
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            Loading your properties...
          </p>
        ) : properties.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            You haven't listed any properties yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property._id}
                className="overflow-hidden rounded-2xl border border-[#e9dfd4] bg-white"
              >
                <PropertyImageCarousel
                  images={property.images}
                  title={property.title}
                  heightClass="h-40"
                  autoPlay
                  showArrows={false}
                />

                <div className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[property.status]}`}
                  >
                    {property.status}
                  </span>

                  <h3 className="mt-3 font-semibold">{property.title}</h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#837468]">
                    <FiMapPin size={13} />
                    {property.location}
                  </p>

                  <p className="mt-2 text-sm font-bold">
                    ₹{property.price.toLocaleString()}
                    <span className="text-xs font-normal text-[#837468]">
                      /mo
                    </span>
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-[#e9dfd4] pt-3">
                    <Link
                      to={`/owner/properties/edit/${property._id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e9dfd4] py-2 text-xs font-medium text-[#51463d] transition hover:bg-[#f3ede5]"
                    >
                      <FiEdit2 size={13} />
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProperty(property._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-800 transition hover:bg-red-50"
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
