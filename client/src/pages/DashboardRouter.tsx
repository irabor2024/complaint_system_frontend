import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';

export default function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.role || 'patient';

  return (
    <DashboardLayout>
      {role === 'patient' && <PatientDashboard />}
      {role === 'staff' && <StaffDashboard />}
      {role === 'admin' && <AdminDashboard />}
    </DashboardLayout>
  );
}
