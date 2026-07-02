import { useEffect, useMemo, useState } from 'react';
import { Clock, Copy, Monitor, Play, Square } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { formatMoney, getState, startPcSession, stopPcSession } from '@/lib/gamingCenterStore';

function elapsed(startTime) {
  if (!startTime) return '00:00:00';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

const statusStyle = {
  available: 'bg-green-500/15 text-green-400',
  occupied: 'bg-primary/15 text-primary',
  reserved: 'bg-blue-500/15 text-blue-300',
  maintenance: 'bg-muted text-muted-foreground',
};

export default function PCStatus() {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [message, setMessage] = useState('');
  const [, forceTick] = useState(0);

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    const timer = setInterval(() => forceTick((tick) => tick + 1), 1000);
    return () => {
      window.removeEventListener('nexus-state-change', sync);
      clearInterval(timer);
    };
  }, []);

  const activeByPc = useMemo(
    () => Object.fromEntries(state.sessions.filter((session) => session.status === 'active').map((session) => [session.pc_id, session])),
    [state.sessions]
  );

  const handleStart = (pcId) => {
    try {
      startPcSession(pcId, user.id);
      setState(getState());
      setMessage('Session эхэллээ.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleStop = (pcId) => {
    try {
      const session = stopPcSession(pcId);
      setState(getState());
      setMessage(`Session дууслаа. Нийт төлбөр: ${formatMoney(session.total_cost)}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleStartAll = () => {
    try {
      const availablePCs = state.pcs.filter(pc => pc.status === 'available');
      console.log('Available PCs:', availablePCs.length);
      
      if (availablePCs.length === 0) {
        setMessage('Сул PC алга байна.');
        return;
      }

      let startedCount = 0;
      availablePCs.forEach(pc => {
        try {
          startPcSession(pc.id, user.id);
          startedCount++;
        } catch (err) {
          console.error(`Failed to start PC-${pc.pc_number}:`, err);
        }
      });
      
      setState(getState());
      setMessage(`${startedCount}/${availablePCs.length} PC-ийн session эхэллээ.`);
    } catch (err) {
      console.error('Start all error:', err);
      setMessage(err.message);
    }
  };

  const handleStopAll = () => {
    try {
      const activeSessions = state.sessions.filter(session => session.status === 'active');
      console.log('Active sessions:', activeSessions.length);
      
      if (activeSessions.length === 0) {
        setMessage('Идэвхитэй session алга байна.');
        return;
      }

      let totalCost = 0;
      let stoppedCount = 0;
      
      activeSessions.forEach(session => {
        try {
          const stoppedSession = stopPcSession(session.pc_id);
          totalCost += stoppedSession.total_cost;
          stoppedCount++;
        } catch (err) {
          console.error(`Failed to stop session for PC:`, err);
        }
      });
      
      setState(getState());
      setMessage(`${stoppedCount}/${activeSessions.length} session дууслаа. Нийт төлбөр: ${formatMoney(totalCost)}`);
    } catch (err) {
      console.error('Stop all error:', err);
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
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">PC-д нэвтрэх</h1>
        <p className="mt-1 text-sm text-muted-foreground">Сул PC дээр session эхлүүлэх эсвэл захиалсан PC-ийн нэр/нууцаар шууд нэвтэрнэ.</p>
      </div>

      {message ? <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

      {isAdmin && (
        <div className="flex gap-3">
          <button onClick={handleStartAll} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-green-500/90 px-4 text-sm font-semibold text-white hover:opacity-90">
            <Play className="h-4 w-4" />
            Бүгдийг эхлүүлэх
          </button>
          <button onClick={handleStopAll} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Square className="h-4 w-4" />
            Бүгдийг зогсоох
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.pcs.map((pc) => {
          const session = activeByPc[pc.id];
          const canStop = session && (isAdmin || session.user_id === user.id);
          const canStart = pc.status === 'available';

          return (
            <article key={pc.id} className="glass-card card-hover rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-bold">PC-{String(pc.pc_number).padStart(2, '0')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pc.zone} • {pc.specs}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyle[pc.status] ?? statusStyle.available}`}>
                  {pc.status}
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-blue-500/20 bg-black/30 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Нэвтрэх мэдээлэл</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Нэр</span>
                  <button onClick={() => copyText(pc.login_name)} className="inline-flex items-center gap-2 font-semibold">
                    {pc.login_name}
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Нууц</span>
                  <button onClick={() => copyText(pc.access_code)} className="inline-flex items-center gap-2 font-display text-lg font-bold text-blue-400">
                    {pc.access_code}
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-muted-foreground">Үнэ</p>
                  <strong>{formatMoney(pc.hourly_rate)} / цаг</strong>
                </div>
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-muted-foreground">Timer</p>
                  <strong className="font-mono">{elapsed(pc.session_start)}</strong>
                </div>
              </div>

              {session ? (
                <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm">
                  <Clock className="mr-2 inline h-4 w-4 text-primary" />
                  {session.user_name} session ажиллаж байна.
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                {canStart ? (
                  <button onClick={() => handleStart(pc.id)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-green-500/90 text-sm font-semibold text-white">
                    <Play className="h-4 w-4" />
                    Шууд нэвтрэх
                  </button>
                ) : (
                  <button disabled={!canStop} onClick={() => handleStop(pc.id)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
                    <Square className="h-4 w-4" />
                    Зогсоох
                  </button>
                )}
                <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted/30 text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
