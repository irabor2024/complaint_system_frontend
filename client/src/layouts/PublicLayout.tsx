import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/Footer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col min-h-0 min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
