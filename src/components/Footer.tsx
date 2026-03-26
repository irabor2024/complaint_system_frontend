import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">SmartCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart Hospital Complaint Management System. Ensuring patient satisfaction through efficient complaint resolution.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/submit-complaint" className="block text-muted-foreground hover:text-primary transition-colors">Submit Complaint</Link>
              <Link to="/track" className="block text-muted-foreground hover:text-primary transition-colors">Track Complaint</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: complaints@smartcare.hospital</p>
              <p>Phone: +1-800-SMART-CARE</p>
              <p>24/7 Support Available</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © 2026 SmartCare Hospital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
