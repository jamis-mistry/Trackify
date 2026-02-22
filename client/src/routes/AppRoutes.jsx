import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// User pages
import UserDashboard from "../pages/user/UserDashboard";
import CreateComplaint from "../pages/user/CreateComplaint";
import MyComplaints from "../pages/user/MyComplaints";
import ComplaintDetail from "../pages/user/ComplaintDetail";
import UserOrgComplaints from "../pages/user/UserOrgComplaints";
import CreateOrgComplaint from "../pages/user/CreateOrgComplaint";
import UserProfile from "../pages/user/UserProfile";
import UserHistory from "../pages/user/UserHistory";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllComplaints from "../pages/admin/AllComplaints";
import UpdateComplaint from "../pages/admin/UpdateComplaint";
import AdminOrganizations from "../pages/admin/AdminOrganizations";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminRoles from "../pages/admin/AdminRoles";

// Organization pages
import OrgDashboard from "../pages/organization/OrgDashboard";
import ManageUsers from "../pages/organization/ManageUsers";
import OrgComplaints from "../pages/organization/OrgComplaints";

// Worker pages	
import WorkerDashboard from "../pages/worker/WorkerDashboard";
import WorkerAssignments from "../pages/worker/WorkerAssignments";
import WorkerHistory from "../pages/worker/WorkerHistory";

// Public pages
// Public pages
import Home from "../pages/Home";
import HowItWorks from "../pages/HowItWorks";
import Testimonials from "../pages/Testimonials";
import Features from "../pages/Features";

// Legal pages
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsOfService from "../pages/legal/TermsOfService";
import CookiePolicy from "../pages/legal/CookiePolicy";
import Security from "../pages/legal/Security";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import PageTransition from "../components/layout/PageTransition";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PageTransition />}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/features" element={<Features />} />

        {/* Legal routes */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/security" element={<Security />} />

        {/* User routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <UserDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <CreateComplaint />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <MyComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/complaints/:id"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <ComplaintDetail />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/org-complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <UserOrgComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/org-complaints/create"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <CreateOrgComplaint />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/history"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <UserHistory />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AllComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <UpdateComplaint />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/organizations"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminOrganizations />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminUsers />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminCategories />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminRoles />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Organization routes */}
        <Route
          path="/organization/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="organization">
                <OrgDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/organization/users"
          element={
            <ProtectedRoute>
              <RoleRoute role="organization">
                <ManageUsers />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/organization/complaints"
          element={
            <ProtectedRoute>
              <RoleRoute role={["organization", "worker"]}>
                <OrgComplaints />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Worker routes */}
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="worker">
                <WorkerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/assignments"
          element={
            <ProtectedRoute>
              <RoleRoute role="worker">
                <WorkerAssignments />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/history"
          element={
            <ProtectedRoute>
              <RoleRoute role="worker">
                <WorkerHistory />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Shared routes */}
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Default route - Smart Redirect */}
        <Route
          path="/"
          element={
            <Home />
          }
        />

        {/* Fallback - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
