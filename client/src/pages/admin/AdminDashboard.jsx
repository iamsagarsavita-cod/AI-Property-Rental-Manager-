import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage users, properties, categories and view analytics.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
