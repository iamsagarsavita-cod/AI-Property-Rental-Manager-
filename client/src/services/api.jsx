import Axios from "axios";

const api = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export default api;
