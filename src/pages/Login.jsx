import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Nexus Arena</h1>
        <p className="mt-2 text-sm text-muted-foreground">Local development auth is enabled.</p>
        <Link className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-primary-foreground" to="/">
          Continue
        </Link>
      </div>
    </div>
  );
}
