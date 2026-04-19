import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Pipeline from "@/pages/Pipeline";
import Contacts from "@/pages/Contacts";
import Deadlines from "@/pages/Deadlines";
import Questions from "@/pages/Questions";
import Firms from "@/pages/Firms";
import GPA from "@/pages/GPA";
import Events from "@/pages/Events";
import Market from "@/pages/Market";
import News from "@/pages/News";
import Jobs from "@/pages/Jobs";
import Community from "@/pages/Community";
import Alumni from "@/pages/Alumni";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/deadlines" element={<Deadlines />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/firms" element={<Firms />} />
              <Route path="/gpa" element={<GPA />} />
              <Route path="/events" element={<Events />} />
              <Route path="/market" element={<Market />} />
              <Route path="/news" element={<News />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/community" element={<Community />} />
              <Route path="/alumni" element={<Alumni />} />
            </Route>
          </Route>

          {/* Admin — standalone, no Layout or AuthProvider guard */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
