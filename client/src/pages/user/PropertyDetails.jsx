import {
  FiMapPin,
  FiHome,
  FiUser,
  FiPhone,
  FiMail,
  FiZap,
} from "react-icons/fi";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/properties/get-property/${id}`);
      setProperty(res.data.property);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setSummarizing(true);
      const res = await api.get(`/ai/summary/${id}`);
      setSummary(res.data.summary || "");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to generate summary");
    } finally {
      setSummarizing(false);
    }
  };

  const sendRequest = async () => {
    try {
      setSending(true);

      const requestData = {
        propertyId: id,
      };

      if (message.trim()) {
        requestData.message = message.trim();
      }

      const res = await api.post("/rental-requests/send-request", requestData);

      toast.success(res.data.msg || "Rental Request Sent Successfully");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <p className="py-20 text-center text-sm text-slate-500">
          Loading property...
        </p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Image */}
        <div className="flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 text-slate-600 sm:h-96">
          {property.images?.[0] ? (
            <img
              src={imageUrl(property.images[0])}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FiHome size={48} />
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
              {property.categoryId?.categoryName || "Property"}
            </span>

            <h1 className="mt-3 text-2xl font-bold">{property.title}</h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
              <FiMapPin size={14} />
              {property.location}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                <p className="text-lg font-bold">{property.bedRooms}</p>
                <p className="text-xs text-slate-500">Bedrooms</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                <p className="text-lg font-bold">{property.bathRooms}</p>
                <p className="text-xs text-slate-500">Bathrooms</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                <p className="text-lg font-bold">{property.area}</p>
                <p className="text-xs text-slate-500">Sq.ft</p>
              </div>
            </div>

            <h2 className="mt-6 text-sm font-semibold text-slate-300">
              Description
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {property.description}
            </p>

            {/* AI Summary */}
            <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-medium text-indigo-300">
                  <FiZap size={14} />
                  AI Summary
                </p>
                <button
                  onClick={generateSummary}
                  disabled={summarizing}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {summarizing ? "Generating..." : "Generate"}
                </button>
              </div>

              {summary && (
                <p className="mt-2 text-sm text-slate-400">{summary}</p>
              )}
            </div>
          </div>

          {/* Right: Owner card + Request button */}
          <div className="h-fit rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-2xl font-bold">
              ₹{property.price.toLocaleString()}
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
                  <p className="text-sm font-medium">
                    {property.ownerId?.fullName}
                  </p>
                  <p className="text-xs text-slate-500">Property Owner</p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                  <FiMail size={12} /> {property.ownerId?.email}
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone size={12} /> {property.ownerId?.phone}
                </p>
              </div>
            </div>

            {property.status === "available" ? (
              <>
                <textarea
                  rows="3"
                  placeholder="Add a message for the owner (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-5 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />

                <button
                  onClick={sendRequest}
                  disabled={sending}
                  className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Rental Request"}
                </button>
              </>
            ) : (
              <p className="mt-5 rounded-xl bg-slate-800 py-3 text-center text-sm text-slate-400">
                This property is currently {property.status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
