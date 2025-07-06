
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import AboutUs from "@/pages/AboutUs";
import Checkout from "@/pages/Checkout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import CancellationPolicy from "@/pages/CancellationPolicy";
import Terms from "@/pages/Terms";
import AuthCallback from "@/pages/auth/callback";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "@/components/ui/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="products" element={<Products />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="contact" element={<Contact />} />
        <Route path="checkout/:productId" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="cancellation-policy" element={<CancellationPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="auth/callback" element={<AuthCallback />} />
      </Route>
    </Routes>
    </>
  );
};

export default App;
