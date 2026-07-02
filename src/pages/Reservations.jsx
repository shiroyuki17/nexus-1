import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Copy, Monitor, RefreshCw, Users } from 'lucide-react';
import { cancelReservation, createSeatReservations, formatMoney, getState } from '@/lib/gamingCenterStore';
import { useAuth } from '@/lib/AuthContext';

const zoneLabel = {
  standard: 'Заал',
  vip: 'VIP',
  tournament: 'Тэмцээн',
};

export default function Reservations() {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [zone, setZone] = useState('vip');
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    startTime: '19:42',
    duration: '1',
  });

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  const visiblePcs = state.pcs.filter((pc) => pc.zone === zone);
  const reservations = isAdmin ? state.reservations : state.reservations.filter((item) => item.user_id === user.id);
  const activeReservations = reservations.filter((item) => item.status === 'confirmed');
  const selectedPcs = state.pcs.filter((pc) => selected.includes(pc.id));
  const total = selectedPcs.reduce((sum, pc) => sum + Number(form.duration) * pc.hourly_rate, 0);
  const canPay = user.balance >= total;

  const zoneSummary = useMemo(
    () => ['standard', 'vip', 'tournament'].map((item) => {
      const pcs = state.pcs.filter((pc) => pc.zone === item);
      return {
        id: item,
        label: zoneLabel[item],
        total: pcs.length,
        available: pcs.filter((pc) => pc.status === 'available').length,
        rate: pcs[0]?.hourly_rate ?? 0,
      };
    }),
    [state.pcs]
  );

  const togglePc = (pc) => {
    if (pc.status !== 'available') return;
    setSelected((current) => current.includes(pc.id) ? current.filter((id) => id !== pc.id) : [...current, pc.id]);
  };

  const confirm = () => {
    try {
      const created = createSeatReservations(user.id, selected, form.date, form.startTime, form.duration);
      setState(getState());
      setSelected([]);
      setMessage(`${created.length} PC захиалга баталгаажлаа.`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const cancel = (id) => {
    try {
      cancelReservation(id);
      setState(getState());
      setMessage('Захиалга цуцлагдлаа.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Хууллаа.');
    } catch {
      setMessage(text);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-muted/50">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Суудал сонгох</h1>
            <p className="text-sm text-muted-foreground">Заал / VIP өрөөнөөс PC сонгоод coin-р баталгаажуулна.</p>
          </div>
        </div>
        <button onClick={() => setState(getState())} className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-muted/50 text-primary">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {message ? <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr_0.95fr]">
        <div className="glass-card rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <input type="time" className="w-full bg-transparent font-mono" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} />
            </label>
            <label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <input type="number" min="1" className="w-full bg-transparent text-right font-mono" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
              цаг
            </label>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {zoneSummary.map((item) => (
              <button
                key={item.id}
                onClick={() => setZone(item.id)}
                className={`rounded-lg border p-3 text-left transition ${zone === item.id ? 'border-blue-400 bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.45)]' : 'border-border bg-muted/30 text-muted-foreground'}`}
              >
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{item.label}</span>
                  <span>{item.available}</span>
                </div>
                <p className="mt-1 text-xs opacity-80">{formatMoney(item.rate)} / цаг</p>
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-background/60 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>{zoneLabel[zone]} floor plan</span>
                <span>{selected.length}/{visiblePcs.length}</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {visiblePcs.map((pc) => {
                  const isSelected = selected.includes(pc.id);
                  const locked = pc.status !== 'available';
                  return (
                    <button
                      key={pc.id}
                      onClick={() => togglePc(pc)}
                      className={`relative h-12 rounded-lg border text-sm font-bold transition ${
                        isSelected
                          ? 'border-blue-300 bg-blue-500 text-white shadow-[0_0_18px_rgba(59,130,246,0.65)]'
                          : locked
                            ? 'border-border bg-muted/25 text-muted-foreground opacity-45'
                            : 'border-border bg-muted/50 text-foreground hover:border-blue-400'
                      }`}
                    >
                      {locked ? '🔒' : pc.pc_number}
                      {isSelected ? <CheckCircle2 className="absolute -right-1 -top-1 h-4 w-4 text-blue-100" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button disabled={selected.length === 0} onClick={confirm} className="mt-5 h-12 w-full rounded-xl bg-blue-500 font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] disabled:opacity-40">
            Үргэлжлүүлэх {selected.length ? `${selected.length}/${visiblePcs.length}` : ''}
          </button>
        </div>

        <div className="glass-card rounded-lg p-4">
          <h2 className="font-display text-xl font-bold">Баталгаажуулах</h2>
          <p className="mt-1 text-sm text-muted-foreground">Сонгосон PC</p>
          <div className="mt-4 space-y-2">
            {selectedPcs.length === 0 ? <p className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">Суудал сонгоогүй байна.</p> : selectedPcs.map((pc) => (
              <div key={pc.id} className="flex items-center justify-between rounded-lg bg-background/70 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-500/15 text-blue-400"><Monitor className="h-4 w-4" /></span>
                  <div>
                    <p className="text-xs text-muted-foreground">Суудал</p>
                    <strong>{zone === 'vip' ? 'VIP' : 'PC'}-{String(pc.pc_number).padStart(2, '0')}</strong>
                  </div>
                </div>
                <span className="rounded bg-muted px-2 py-1 text-xs uppercase">{pc.zone}</span>
              </div>
            ))}
          </div>

          <div className={`mt-5 rounded-xl border p-4 ${canPay ? 'border-border bg-muted/20' : 'border-yellow-500/40 bg-yellow-500/10'}`}>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Coin төлбөр</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Таны үлдэгдэл</span><strong>{formatMoney(user.balance)}</strong></div>
              <div className="flex justify-between"><span>Энэ захиалгад</span><strong>-{formatMoney(total)}</strong></div>
              <div className="border-t border-border pt-2 flex justify-between"><span>Үлдэх coin</span><strong className={canPay ? 'text-green-400' : 'text-yellow-300'}>{canPay ? formatMoney(user.balance - total) : 'Хүрэлцэхгүй'}</strong></div>
            </div>
            {!canPay ? <p className="mt-3 rounded-md bg-yellow-500/15 p-2 text-xs text-yellow-300">Coin дутуу байна. Admin хэсгээс дансаа цэнэглэнэ үү.</p> : null}
          </div>

          <button disabled={selected.length === 0 || !canPay} onClick={confirm} className="mt-5 h-12 w-full rounded-xl bg-blue-500 font-bold text-white disabled:opacity-40">
            Баталгаажуулах
          </button>
        </div>

        <div className="glass-card rounded-lg p-4">
          <h2 className="font-display text-xl font-bold">Захиалга</h2>
          <p className="text-sm text-muted-foreground">PC-д шууд нэвтрэх нэр/нууц</p>
          <div className="mt-4 space-y-3">
            {activeReservations.length === 0 ? <p className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">Баталгаажсан захиалга алга.</p> : activeReservations.map((reservation) => (
              <div key={reservation.id} className="rounded-xl border border-blue-500/25 bg-background/70 p-4">
                <div className="flex items-center justify-between">
                  <strong>PC-{reservation.pc_number}</strong>
                  <span className="rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs text-blue-300">Баталгаажсан</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{reservation.date} • {reservation.start_time} • {reservation.duration_hours}ц</p>
                <div className="mt-3 rounded-lg bg-black/40 p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Нэр</span>
                    <button onClick={() => copyText(reservation.login_name)} className="inline-flex items-center gap-2 font-bold">{reservation.login_name}<Copy className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-2 flex justify-between gap-2">
                    <span className="text-muted-foreground">Нууц</span>
                    <button onClick={() => copyText(reservation.access_code)} className="inline-flex items-center gap-2 font-display text-lg font-bold text-blue-400">{reservation.access_code}<Copy className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">Төлбөр</span>
                  <strong>{formatMoney(reservation.total_cost)}</strong>
                </div>
                <button onClick={() => cancel(reservation.id)} className="mt-3 h-9 w-full rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive">Цуцлах</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
