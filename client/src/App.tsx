import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientComplaints from "./pages/patient/PatientComplaints";
import SubmitComplaint from "./pages/patient/SubmitComplaint";
import TrackComplaint from "./pages/patient/TrackComplaint";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientSettings from "./pages/patient/PatientSettings";

import StaffDashboard from "./pages/staff/StaffDashboard";
import AssignedComplaints from "./pages/staff/AssignedComplaints";
import ComplaintDetail from "./pages/staff/ComplaintDetail";
import StaffProfile from "./pages/staff/StaffProfile";
import StaffSettings from "./pages/staff/StaffSettings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSettings from "./pages/admin/AdminSettings";

import { useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

function DashboardHome() {
  const { user } = useAuth();
  if (user?.role === 'staff') return <StaffDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  return <PatientDashboard />;
}

function DashboardComplaints() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <ComplaintManagement />;
  if (user?.role === 'staff') return <AssignedComplaints />;
  return <PatientComplaints />;
}

function DashboardProfile() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminProfile />;
  if (user?.role === 'staff') return <StaffProfile />;
  return <PatientProfile />;
}

function DashboardSettings() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminSettings />;
  if (user?.role === 'staff') return <StaffSettings />;
  return <PatientSettings />;
}

function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="submit" element={<SubmitComplaint />} />
          <Route path="track" element={<TrackComplaint />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="assigned" element={<AssignedComplaints />} />
          <Route path="complaint/:id" element={<ComplaintDetail />} />
          <Route path="complaints" element={<DashboardComplaints />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="staff" element={<StaffManagement />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/dashboard/*" element={<DashboardRoutes />} />
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
