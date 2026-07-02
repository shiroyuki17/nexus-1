import { useEffect, useState } from 'react';
import { Activity, Banknote, Monitor, Users } from 'lucide-react';
import { formatMoney, getState, getStats } from '@/lib/gamingCenterStore';

function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`rounded-lg border p-3 ${tone === 'green' ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-primary/20 bg-primary/10 text-primary'}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [state, setState] = useState(() => getState());

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    const timer = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('nexus-state-change', sync);
      clearInterval(timer);
    };
  }, []);

  const stats = getStats(state);
  const recentPayments = state.payments.slice(-5).reverse();
  const activeSessions = state.sessions.filter((session) => session.status === 'active');

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Gaming Center Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          PC ашиглалт, идэвхтэй session, орлого болон хэрэглэгчийн мэдээллийг нэг дор хянах хэсэг.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Monitor} label="Сул PC" value={`${stats.availablePcs}/${stats.totalPcs}`} />
        <StatCard icon={Activity} label="Идэвхтэй session" value={stats.activeSessions} tone="green" />
        <StatCard icon={Banknote} label="Өнөөдрийн орлого" value={formatMoney(stats.revenueToday)} />
        <StatCard icon={Users} label="Хэрэглэгч" value={stats.users} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">PC status</h2>
            <span className="text-sm text-muted-foreground">Сонгох, эхлүүлэх, зогсоох хэсэг</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.pcs.map((pc) => (
              <div key={pc.id} className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-bold">PC {pc.pc_number}</p>
                  <span className={`rounded px-2 py-1 text-xs ${pc.status === 'available' ? 'bg-green-500/15 text-green-400' : 'bg-primary/15 text-primary'}`}>
                    {pc.status === 'available' ? 'Сул' : 'Ашиглаж байна'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{pc.zone} • {pc.specs}</p>
                <p className="mt-1 text-sm text-foreground">{formatMoney(pc.hourly_rate)} / цаг</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-lg p-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Тайлан</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between rounded-md bg-muted/40 p-3">
                <span className="text-muted-foreground">Сарын орлого</span>
                <strong>{formatMoney(stats.revenueMonth)}</strong>
              </div>
              <div className="flex justify-between rounded-md bg-muted/40 p-3">
                <span className="text-muted-foreground">Нийт session</span>
                <strong>{state.sessions.length}</strong>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Идэвхтэй session</h2>
            <div className="mt-3 space-y-2 text-sm">
              {activeSessions.length === 0 ? (
                <p className="text-muted-foreground">Одоогоор идэвхтэй session алга.</p>
              ) : (
                activeSessions.map((session) => (
                  <div key={session.id} className="rounded-md bg-muted/40 p-3">
                    PC {session.pc_number} • {session.user_name}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-lg p-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Төлбөрийн түүх</h2>
            <div className="mt-3 space-y-2 text-sm">
              {recentPayments.length === 0 ? (
                <p className="text-muted-foreground">Төлбөрийн түүх хоосон байна.</p>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex justify-between rounded-md bg-muted/40 p-3">
                    <span>{payment.user_name} • {payment.description}</span>
                    <strong>{formatMoney(payment.amount)}</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
