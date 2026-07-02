import { useEffect, useState } from 'react';
import { Crown, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { formatMoney, getState } from '@/lib/gamingCenterStore';

export default function Profile() {
  const { user } = useAuth();
  const [state, setState] = useState(() => getState());

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  const current = state.users.find((item) => item.id === user.id) ?? user;
  const payments = state.payments.filter((payment) => payment.user_id === current.id).slice(-8).reverse();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Хэрэглэгчийн мэдээлэл</h1>
        <p className="mt-1 text-sm text-muted-foreground">Нэр, дансны үлдэгдэл, rank, point болон төлбөрийн түүх.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{current.username}</h2>
              <p className="text-sm text-muted-foreground">{current.role === 'admin' ? 'Админ хэрэглэгч' : 'Энгийн хэрэглэгч'}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between rounded-md bg-muted/40 p-3">
              <span className="text-muted-foreground">Дансны үлдэгдэл</span>
              <strong>{formatMoney(current.balance)}</strong>
            </div>
            <div className="flex justify-between rounded-md bg-muted/40 p-3">
              <span className="text-muted-foreground">Rank</span>
              <strong className="inline-flex items-center gap-2"><Crown className="h-4 w-4 text-primary" />{current.rank}</strong>
            </div>
            <div className="flex justify-between rounded-md bg-muted/40 p-3">
              <span className="text-muted-foreground">Нийт цаг</span>
              <strong>{current.total_hours} цаг</strong>
            </div>
            <div className="flex justify-between rounded-md bg-muted/40 p-3">
              <span className="text-muted-foreground">Point</span>
              <strong>{current.points}</strong>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-5">
          <h2 className="font-display text-lg font-semibold">Миний төлбөрийн түүх</h2>
          <div className="mt-4 space-y-2 text-sm">
            {payments.length === 0 ? (
              <p className="text-muted-foreground">Түүх хоосон байна.</p>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} className="flex justify-between rounded-md bg-muted/40 p-3">
                  <span>{payment.description}</span>
                  <strong>{formatMoney(payment.amount)}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
