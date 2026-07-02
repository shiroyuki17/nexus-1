import { useEffect, useMemo, useState } from 'react';
import { Gamepad2, Plus, Star } from 'lucide-react';
import { addGame, getState } from '@/lib/gamingCenterStore';
import { useAuth } from '@/lib/AuthContext';

export default function Games() {
  const { isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [category, setCategory] = useState('all');
  const [form, setForm] = useState({
    title: '',
    category: 'FPS',
    description: '',
    min_specs: 'RTX 3060 / 165Hz',
    popularity: '70',
    is_featured: false,
  });

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  const categories = useMemo(() => ['all', ...new Set(state.games.map((game) => game.category))], [state.games]);
  const games = category === 'all' ? state.games : state.games.filter((game) => game.category === category);

  const submit = (event) => {
    event.preventDefault();
    addGame(form);
    setState(getState());
    setForm({ ...form, title: '', description: '' });
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Game Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">PC тоглоомын газрын тоглоом, category, popularity, шаардлагатай specs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`h-9 rounded-md px-3 text-sm ${category === item ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'}`}
            >
              {item === 'all' ? 'All' : item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <article key={game.id} className="glass-card card-hover relative rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-muted">
                {game.image_url ? (
                  <img className="h-full w-full object-cover" src={game.image_url} alt={game.title} loading="lazy" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-primary"><Gamepad2 className="h-8 w-8" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
              {game.is_featured ? (
                <span className="absolute right-8 mt-2 inline-flex items-center gap-1 rounded-md bg-yellow-500/20 px-2 py-1 text-xs text-yellow-200 backdrop-blur">
                  <Star className="h-3.5 w-3.5" />
                  Featured
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">{game.title}</h2>
            <p className="mt-1 text-sm text-primary">{game.category}</p>
            <p className="mt-3 min-h-10 text-sm text-muted-foreground">{game.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-muted/40 p-3">
                <p className="text-muted-foreground">Popularity</p>
                <strong>{game.popularity}%</strong>
              </div>
              <div className="rounded-md bg-muted/40 p-3">
                <p className="text-muted-foreground">Specs</p>
                <strong className="text-xs">{game.min_specs}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      {isAdmin ? (
        <form onSubmit={submit} className="glass-card rounded-lg p-4">
          <h2 className="font-display text-lg font-semibold">Шинэ тоглоом нэмэх</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <input required placeholder="Title" className="h-10 rounded-md border border-border bg-muted/50 px-3" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <select className="h-10 rounded-md border border-border bg-muted/50 px-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {['FPS', 'MOBA', 'RPG', 'Battle Royale', 'Racing', 'Sports', 'Strategy', 'MMO'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input placeholder="Min specs" className="h-10 rounded-md border border-border bg-muted/50 px-3" value={form.min_specs} onChange={(event) => setForm({ ...form, min_specs: event.target.value })} />
            <input type="number" placeholder="Popularity" className="h-10 rounded-md border border-border bg-muted/50 px-3" value={form.popularity} onChange={(event) => setForm({ ...form, popularity: event.target.value })} />
            <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} />
              Featured
            </label>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" />
              Add game
            </button>
          </div>
          <textarea placeholder="Description" className="mt-3 min-h-20 w-full rounded-md border border-border bg-muted/50 p-3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </form>
      ) : null}
    </section>
  );
}
