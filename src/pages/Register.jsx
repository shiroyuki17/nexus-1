import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    try {
      register(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background grid-bg px-4">
      <form onSubmit={submit} className="glass-elevated w-full max-w-sm rounded-lg p-6">
        <h1 className="font-display text-xl font-bold">Хэрэглэгч бүртгүүлэх</h1>
        <p className="mt-1 text-sm text-muted-foreground">Шинэ тоглогчийн данс үүсгэнэ.</p>
        {error ? <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

        <label className="mt-5 block text-sm text-muted-foreground">Нэр</label>
        <input
          required
          className="mt-2 h-11 w-full rounded-md border border-border bg-muted/50 px-3 text-foreground"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />
        <label className="mt-4 block text-sm text-muted-foreground">Нууц үг</label>
        <input
          required
          type="password"
          className="mt-2 h-11 w-full rounded-md border border-border bg-muted/50 px-3 text-foreground"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button className="mt-6 h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground">
          Бүртгүүлэх
        </button>
        <Link className="mt-4 block text-center text-sm text-primary hover:underline" to="/login">
          Нэвтрэх хэсэг рүү буцах
        </Link>
      </form>
    </div>
  );
}
