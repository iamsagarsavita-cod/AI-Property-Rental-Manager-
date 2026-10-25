import { FiHome, FiMapPin, FiTag, FiImage, FiX, FiZap } from "react-icons/fi";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../components/Navbar";

const PropertyForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    location: "",
    price: "",
    bedRooms: "",
    bathRooms: "",
    area: "",
    description: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api
      .get("/categories/all-categories")
      .then((res) => setCategories(res.data.category || []))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/get-property/${id}`);
        const p = res.data.property;
        setFormData({
          title: p.title || "",
          categoryId: p.categoryId?._id || p.categoryId || "",
          location: p.location || "",
          price: p.price ?? "",
          bedRooms: p.bedRooms ?? "",
          bathRooms: p.bathRooms ?? "",
          area: p.area ?? "",
          description: p.description || "",
        });
        setExistingImages(p.images || []);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to load property");
      }
    };

    fetchProperty();
  }, [id]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const changeImagesHandler = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + newImages.length + existingImages.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateDescription = async () => {
    const { title, location, bedRooms, bathRooms, area, price, categoryId } =
      formData;

    if (
      !title ||
      !location ||
      !bedRooms ||
      !bathRooms ||
      !area ||
      !price ||
      !categoryId
    ) {
      toast.error(
        "Fill title, category, location, price, bedrooms, bathrooms and area first",
      );
      return;
    }

    const category = categories.find((c) => c._id === categoryId);

    try {
      setGenerating(true);

      const res = await api.post("/ai/generate-description", {
        title,
        location,
        bedRooms,
        bathRooms,
        area,
        price,
        categoryName: category?.categoryName,
      });

      setFormData((prev) => ({
        ...prev,
        description: res.data.description || "",
      }));
      toast.success("Description generated");
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to generate description",
      );
    } finally {
      setGenerating(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      newImages.forEach((file) => data.append("images", file));

      let res;
      if (isEditMode) {
        res = await api.put(`/properties/update/${id}`, data);
      } else {
        res = await api.post("/properties/add-property", data);
      }

      toast.success(res.data.msg || "Property Saved Successfully");
      navigate("/owner/properties");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Property" : "Add Property"}
        </h1>
        <p className="mt-1 text-sm text-[#6d5e52]">
          Fill in the details below to{" "}
          {isEditMode ? "update your" : "list a new"} property.
        </p>

        <form
          onSubmit={submitHandler}
          className="mt-6 space-y-5 rounded-2xl border border-[#e9dfd4] bg-white p-6"
        >
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              Property Title
            </label>
            <div className="relative">
              <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
              <input
                type="text"
                name="title"
                placeholder="e.g. Sunny 2BHK Apartment"
                value={formData.title}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
              />
            </div>
          </div>

          {/* Category + Location */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#51463d]">
                Category
              </label>
              <div className="relative">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={changeHandler}
                  className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm text-[#51463d] outline-none focus:border-[#a96343]"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#51463d]">
                Location
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#837468]" />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Andheri West, Mumbai"
                  value={formData.location}
                  onChange={changeHandler}
                  className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
                />
              </div>
            </div>
          </div>

          {/* Price, Bedrooms, Bathrooms, Area */}
          <div className="grid gap-5 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#51463d]">
                Price/mo
              </label>
              <input
                type="number"
                name="price"
                placeholder="18000"
                value={formData.price}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-3 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#51463d]">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedRooms"
                placeholder="2"
                value={formData.bedRooms}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-3 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#51463d]">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathRooms"
                placeholder="2"
                value={formData.bathRooms}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-3 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#51463d]">
                Area (sqft)
              </label>
              <input
                type="number"
                name="area"
                placeholder="950"
                value={formData.area}
                onChange={changeHandler}
                className="w-full rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-3 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-[#51463d]">
                Description
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating}
                className="flex items-center gap-1.5 rounded-lg bg-[#f5e9df] px-3 py-1.5 text-xs font-semibold text-[#a96343] transition hover:bg-[#8f5035]/20 disabled:opacity-60"
              >
                <FiZap size={12} />
                {generating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              rows="4"
              name="description"
              placeholder="Describe the property..."
              value={formData.description}
              onChange={changeHandler}
              className="w-full resize-none rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-3 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
            />
          </div>

          {/* Images */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51463d]">
              Property Images
              <span className="ml-2 text-xs text-[#9b8b7d]">
                Up to 5 images
              </span>
            </label>

            <label className="flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#ddcfc1] bg-[#f7f3ed] text-[#837468] transition hover:border-[#c89071]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={changeImagesHandler}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1.5">
                <FiImage size={22} />
                <span className="text-xs">Click to upload images</span>
              </div>
            </label>

            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <div
                    key={`existing-${i}`}
                    className="h-16 w-16 overflow-hidden rounded-lg bg-[#f3ede5]"
                  >
                    <img
                      src={imageUrl(img)}
                      alt="Existing"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}

                {newImages.map((file, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#f3ede5]"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New upload"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#a96343] py-3.5 text-sm font-semibold transition hover:bg-[#8f5035] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
