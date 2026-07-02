import { useEffect, useState } from 'react';
import { Banknote, RefreshCcw, Settings, Users } from 'lucide-react';
import { formatMoney, getState, getStats, resetState, topUpUser, updatePcRate } from '@/lib/gamingCenterStore';
import { useAuth } from '@/lib/AuthContext';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [topUp, setTopUp] = useState({ userId: 'player', amount: '10000' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  if (!isAdmin) {
    return (
      <section className="glass-card rounded-lg p-6">
        <h1 className="font-display text-xl font-bold">Admin эрх шаардлагатай</h1>
        <p className="mt-2 text-sm text-muted-foreground">Энэ хэсэгт зөвхөн админ хэрэглэгч орно.</p>
      </section>
    );
  }

  const stats = getStats(state);

  const handleTopUp = (event) => {
    event.preventDefault();
    topUpUser(topUp.userId, topUp.amount);
    setState(getState());
    setMessage('Данс амжилттай цэнэглэгдлээ.');
  };

  const handleRate = (pcId, rate) => {
    updatePcRate(pcId, rate);
    setState(getState());
    setMessage('Цагийн үнэ шинэчлэгдлээ.');
  };

  const handleReset = () => {
    resetState();
    setState(getState());
    setMessage('Demo өгөгдөл дахин үүслээ.');
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin / Тайлан</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Хэрэглэгчийн данс, PC цагийн үнэ, төлбөрийн түүх, өдөр/сарын орлогын тайлан.
          </p>
        </div>
        <button onClick={handleReset} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-4 text-sm text-foreground">
          <RefreshCcw className="h-4 w-4" />
          Demo reset
        </button>
      </div>

      {message ? <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-lg p-4">
          <Banknote className="mb-3 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">Өнөөдрийн орлого</p>
          <strong className="font-display text-2xl">{formatMoney(stats.revenueToday)}</strong>
        </div>
        <div className="glass-card rounded-lg p-4">
          <Banknote className="mb-3 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">Сарын орлого</p>
          <strong className="font-display text-2xl">{formatMoney(stats.revenueMonth)}</strong>
        </div>
        <div className="glass-card rounded-lg p-4">
          <Users className="mb-3 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">Хэрэглэгч / Session</p>
          <strong className="font-display text-2xl">{state.users.length} / {state.sessions.length}</strong>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleTopUp} className="glass-card rounded-lg p-4">
          <h2 className="font-display text-lg font-semibold">Данс цэнэглэх</h2>
          <label className="mt-4 block text-sm text-muted-foreground">Хэрэглэгч</label>
          <select
            className="mt-2 h-10 w-full rounded-md border border-border bg-muted/50 px-3"
            value={topUp.userId}
            onChange={(event) => setTopUp({ ...topUp, userId: event.target.value })}
          >
            {state.users.map((user) => (
              <option key={user.id} value={user.id}>{user.username} - {formatMoney(user.balance)}</option>
            ))}
          </select>
          <label className="mt-4 block text-sm text-muted-foreground">Дүн</label>
          <input
            type="number"
            className="mt-2 h-10 w-full rounded-md border border-border bg-muted/50 px-3"
            value={topUp.amount}
            onChange={(event) => setTopUp({ ...topUp, amount: event.target.value })}
          />
          <button className="mt-5 h-10 w-full rounded-md bg-primary font-semibold text-primary-foreground">
            Цэнэглэх
          </button>
        </form>

        <div className="glass-card rounded-lg p-4">
          <h2 className="font-display text-lg font-semibold">PC цагийн үнэ тохируулах</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {state.pcs.map((pc) => (
              <label key={pc.id} className="rounded-md bg-muted/40 p-3 text-sm">
                <span className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  PC {pc.pc_number} • {pc.zone}
                </span>
                <input
                  type="number"
                  className="h-10 w-full rounded-md border border-border bg-background px-3"
                  value={pc.hourly_rate}
                  onChange={(event) => handleRate(pc.id, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-lg p-4">
        <h2 className="font-display text-lg font-semibold">Төлбөрийн түүх</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Огноо</th>
                <th className="px-4 py-3 text-left">Хэрэглэгч</th>
                <th className="px-4 py-3 text-left">Тайлбар</th>
                <th className="px-4 py-3 text-right">Дүн</th>
              </tr>
            </thead>
            <tbody>
              {state.payments.slice().reverse().map((payment) => (
                <tr key={payment.id} className="border-t border-border">
                  <td className="px-4 py-3">{new Date(payment.createdAt).toLocaleString('mn-MN')}</td>
                  <td className="px-4 py-3">{payment.user_name}</td>
                  <td className="px-4 py-3">{payment.description}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatMoney(payment.amount)}</td>
                </tr>
              ))}
              {state.payments.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>Түүх хоосон байна.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
