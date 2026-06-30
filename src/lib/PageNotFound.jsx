import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
      <h1 className="font-display text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link className="text-primary hover:underline" to="/">
        Back to dashboard
      </Link>
    </div>
  );
}
