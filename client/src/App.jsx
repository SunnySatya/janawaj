import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Polls from "./pages/Polls";
import NewsDetails from "./pages/NewsDetails";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminPolls from "./pages/admin/AdminPolls";
import AdminSliders from "./pages/admin/AdminSliders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminLoginHistory from "./pages/admin/AdminLoginHistory";

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/community" element={<Community />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/polls" element={<Polls />} />
      <Route path="/news/:id" element={<NewsDetails />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="polls" element={<AdminPolls />} />
        <Route path="sliders" element={<AdminSliders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="login-history" element={<AdminLoginHistory />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {!isAdminRoute && <Navbar />}
        <main className={`flex-grow ${isAdminRoute ? "p-0" : ""}`}>
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
