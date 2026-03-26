import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

import Landing from "./pages/Landing";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import NotFound from "./pages/NotFound";

import StaffLayout from "./layouts/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffComplaints from "./pages/staff/StaffComplaints";
import ComplaintDetail from "./pages/staff/ComplaintDetail";
import StaffNotifications from "./pages/staff/StaffNotifications";
import StaffProfile from "./pages/staff/StaffProfile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminStaff from "./pages/admin/AdminStaff";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/submit-complaint" element={<SubmitComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />

            {/* Staff routes */}
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<StaffDashboard />} />
              <Route path="complaints" element={<StaffComplaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="notifications" element={<StaffNotifications />} />
              <Route path="profile" element={<StaffProfile />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="departments" element={<AdminDepartments />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
