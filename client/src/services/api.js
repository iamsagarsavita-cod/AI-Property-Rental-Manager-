import Axios from "axios";

const api = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const imageUrl = (filename) => {
  if (!filename) return "";
  const baseUrl = (api.defaults.baseURL || "").replace(/\/+$/, "");
  return `${baseUrl}/uploads/${filename.replace(/^\/+/, "")}`;
};

export default api;
