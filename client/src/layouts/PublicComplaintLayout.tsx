import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PublicComplaintLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between gap-2 px-4">
          <Link to="/" className="font-semibold text-foreground shrink-0">
            SmartCare
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link to="/track">
              <Button variant="ghost" size="sm" className="rounded-xl">
                Track
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="ghost" size="sm" className="rounded-xl">
                Submit
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="rounded-xl">
                Sign in
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto flex-1 min-h-0 min-w-0 w-full px-4 py-6 sm:py-10">
        <Outlet />
      </div>
    </div>
  );
}
