export function Footer() {
  return (
    <footer className="mt-auto shrink-0 border-t border-border bg-card">
      <div className="container mx-auto px-4 py-4 sm:py-5">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SmartCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
