import { useEffect, useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { formatMoney, getState, registerTournament } from '@/lib/gamingCenterStore';
import { useAuth } from '@/lib/AuthContext';

export default function Tournaments() {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [teamNames, setTeamNames] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  const register = (tournamentId) => {
    try {
      registerTournament(tournamentId, user.id, teamNames[tournamentId]);
      setState(getState());
      setMessage('Тэмцээнд амжилттай бүртгэгдлээ.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Tournaments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Тэмцээний жагсаалт, entry fee, prize pool, багийн бүртгэл.</p>
      </div>

      {message ? <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {state.tournaments.map((tournament) => {
          const registered = state.tournamentRegistrations.some((item) => item.tournament_id === tournament.id && item.user_id === user.id);
          const full = tournament.current_participants >= tournament.max_participants;
          return (
            <article key={tournament.id} className="glass-card card-hover rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-primary/15 px-2 py-1 text-xs text-primary">{tournament.status}</span>
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{tournament.title}</h2>
              <p className="mt-1 text-sm text-primary">{tournament.game}</p>
              <p className="mt-3 text-sm text-muted-foreground">{tournament.description}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">Огноо</p>
                  <strong>{new Date(tournament.date).toLocaleDateString('mn-MN')} {tournament.time}</strong>
                </div>
                <div className="rounded-md bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">Prize</p>
                  <strong>{tournament.prize_pool}</strong>
                </div>
                <div className="rounded-md bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">Entry</p>
                  <strong>{formatMoney(tournament.entry_fee)}</strong>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {tournament.current_participants}/{tournament.max_participants} оролцогч
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  disabled={registered || full}
                  placeholder="Team name"
                  className="h-10 flex-1 rounded-md border border-border bg-muted/50 px-3 disabled:opacity-40"
                  value={teamNames[tournament.id] ?? ''}
                  onChange={(event) => setTeamNames({ ...teamNames, [tournament.id]: event.target.value })}
                />
                <button disabled={registered || full} onClick={() => register(tournament.id)} className="h-10 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-40">
                  {registered ? 'Registered' : full ? 'Full' : 'Register'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {isAdmin ? (
        <div className="glass-card rounded-lg p-4">
          <h2 className="font-display text-lg font-semibold">Бүртгэлийн жагсаалт</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {state.tournamentRegistrations.map((item) => {
              const tournament = state.tournaments.find((entry) => entry.id === item.tournament_id);
              return (
                <div key={item.id} className="rounded-md bg-muted/40 p-3 text-sm">
                  <strong>{item.team_name}</strong>
                  <p className="text-muted-foreground">{item.user_name} • {tournament?.title}</p>
                </div>
              );
            })}
            {state.tournamentRegistrations.length === 0 ? <p className="text-sm text-muted-foreground">Бүртгэл хоосон байна.</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
