import { useEffect, useState } from 'react';
import { CalendarClock, XCircle } from 'lucide-react';
import { cancelReservation, createReservation, formatMoney, getState } from '@/lib/gamingCenterStore';
import { useAuth } from '@/lib/AuthContext';

export default function Reservations() {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    pcId: 'pc-1',
    date: new Date().toISOString().slice(0, 10),
    startTime: '18:00',
    duration: '2',
  });

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  const reservations = isAdmin ? state.reservations : state.reservations.filter((item) => item.user_id === user.id);
  const selectedPc = state.pcs.find((pc) => pc.id === form.pcId);
  const estimate = Number(form.duration) * Number(selectedPc?.hourly_rate ?? 0);

  const submit = (event) => {
    event.preventDefault();
    try {
      createReservation(user.id, form.pcId, form.date, form.startTime, form.duration);
      setState(getState());
      setMessage('PC захиалга баталгаажлаа.');
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

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Reservations</h1>
        <p className="mt-1 text-sm text-muted-foreground">PC дугаар, өдөр, эхлэх цаг, үргэлжлэх хугацаагаар урьдчилсан захиалга үүсгэнэ.</p>
      </div>

      {message ? <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="glass-card h-fit rounded-lg p-4">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <CalendarClock className="h-5 w-5 text-primary" />
            Шинэ захиалга
          </h2>
          <label className="mt-4 block text-sm text-muted-foreground">PC</label>
          <select className="mt-2 h-10 w-full rounded-md border border-border bg-muted/50 px-3" value={form.pcId} onChange={(event) => setForm({ ...form, pcId: event.target.value })}>
            {state.pcs.map((pc) => <option key={pc.id} value={pc.id}>PC {pc.pc_number} - {pc.zone} - {formatMoney(pc.hourly_rate)}/цаг</option>)}
          </select>

          <label className="mt-4 block text-sm text-muted-foreground">Өдөр</label>
          <input type="date" className="mt-2 h-10 w-full rounded-md border border-border bg-muted/50 px-3" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-muted-foreground">
              Эхлэх цаг
              <input type="time" className="mt-2 h-10 w-full rounded-md border border-border bg-muted/50 px-3" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} />
            </label>
            <label className="text-sm text-muted-foreground">
              Хугацаа
              <input type="number" min="1" className="mt-2 h-10 w-full rounded-md border border-border bg-muted/50 px-3" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
            </label>
          </div>

          <div className="mt-4 flex justify-between rounded-md bg-muted/40 p-3 text-sm">
            <span className="text-muted-foreground">Тооцоолсон төлбөр</span>
            <strong>{formatMoney(estimate)}</strong>
          </div>
          <button className="mt-4 h-10 w-full rounded-md bg-primary font-semibold text-primary-foreground">Захиалах</button>
        </form>

        <div className="glass-card rounded-lg p-4">
          <h2 className="font-display text-lg font-semibold">Захиалгын жагсаалт</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Хэрэглэгч</th>
                  <th className="px-4 py-3 text-left">PC</th>
                  <th className="px-4 py-3 text-left">Огноо</th>
                  <th className="px-4 py-3 text-left">Цаг</th>
                  <th className="px-4 py-3 text-right">Төлбөр</th>
                  <th className="px-4 py-3 text-right">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-t border-border">
                    <td className="px-4 py-3">{reservation.user_name}</td>
                    <td className="px-4 py-3">PC {reservation.pc_number}</td>
                    <td className="px-4 py-3">{reservation.date}</td>
                    <td className="px-4 py-3">{reservation.start_time} - {reservation.end_time}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(reservation.total_cost)}</td>
                    <td className="px-4 py-3 text-right">
                      {reservation.status !== 'cancelled' ? (
                        <button onClick={() => cancel(reservation.id)} className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2 py-1 text-xs text-destructive">
                          <XCircle className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      ) : (
                        <span className="text-muted-foreground">cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan={6}>Захиалга хоосон байна.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
