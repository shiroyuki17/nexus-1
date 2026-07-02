import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    try {
      login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background grid-bg px-4">
      <form onSubmit={submit} className="glass-elevated w-full max-w-sm rounded-lg p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg border border-primary/20 bg-primary/15 p-3 text-primary neon-glow-pink">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">NEXUS ARENA</h1>
            <p className="text-sm text-muted-foreground">Gaming center login</p>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

        <label className="text-sm text-muted-foreground">Нэвтрэх нэр</label>
        <input
          className="mt-2 h-11 w-full rounded-md border border-border bg-muted/50 px-3 text-foreground"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />

        <label className="mt-4 block text-sm text-muted-foreground">Нууц үг</label>
        <input
          type="password"
          className="mt-2 h-11 w-full rounded-md border border-border bg-muted/50 px-3 text-foreground"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />

        <button className="mt-6 h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground btn-glow-cyan">
          Нэвтрэх
        </button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Шинэ хэрэглэгч үү? <Link className="text-primary hover:underline" to="/register">Бүртгүүлэх</Link>
        </p>
      </form>
    </div>
  );
}
