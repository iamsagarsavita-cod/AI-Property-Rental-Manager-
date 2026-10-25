import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const emptyForm = { categoryName: "", description: "", status: "active" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories/all-categories");
      console.log(res);
      
      setCategories(res.data.category || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.msg || "Failed to load categories");
      }
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      categoryName: cat.categoryName,
      description: cat.description,
      status: cat.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let res;
      if (editingId) {
        res = await api.put(`/categories/update/${editingId}`, formData);
      } else {
        res = await api.post("/categories/add-category", formData);
      }

      toast.success(res.data.msg);
      cancelEdit();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      const res = await api.delete(`/categories/delete/${id}`);
      toast.success(res.data.msg || "Category Deleted Successfully");
      setCategories((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) cancelEdit();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#382f28]">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <p className="mt-1 text-sm text-[#6d5e52]">
          Property categories that owners can choose from.
        </p>

        {/* Add / Edit form */}
        <form
          onSubmit={submitHandler}
          className="mt-6 grid gap-3 rounded-2xl border border-[#e9dfd4] bg-white p-4 sm:grid-cols-4"
        >
          <input
            type="text"
            name="categoryName"
            placeholder="Category name"
            value={formData.categoryName}
            onChange={changeHandler}
            className="rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-2.5 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343]"
          />
          <input
            type="text"
            name="description"
            placeholder="Description (min 10 characters)"
            value={formData.description}
            onChange={changeHandler}
            className="rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-2.5 text-sm outline-none placeholder:text-[#9b8b7d] focus:border-[#a96343] sm:col-span-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={changeHandler}
            className="rounded-xl border border-[#e9dfd4] bg-[#f7f3ed] px-4 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#a96343]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex gap-2 sm:col-span-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#a96343] py-2.5 text-sm font-semibold transition hover:bg-[#8f5035] disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {/* FUNCTIONALITY: Cancel only shows while editing */}
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-[#e9dfd4] px-5 py-2.5 text-sm font-medium text-[#51463d] transition hover:bg-[#f3ede5]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        {loading ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#837468]">
            No categories yet. Add your first one above.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-[#e9dfd4] bg-white p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{cat.categoryName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                        cat.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#e3d7ca] text-[#6d5e52]"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#837468]">
                    {cat.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="flex items-center gap-1.5 rounded-lg border border-[#e9dfd4] px-3 py-1.5 text-xs font-medium text-[#51463d] transition hover:bg-[#f3ede5]"
                  >
                    <FiEdit2 size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-800 transition hover:bg-red-50"
                  >
                    <FiTrash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
