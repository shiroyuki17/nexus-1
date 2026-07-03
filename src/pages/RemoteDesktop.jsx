import { useState } from 'react';
import { Monitor, Play, Square, X } from 'lucide-react';

export default function RemoteDesktop() {
  const [selectedPC, setSelectedPC] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const pcs = [
    { id: 1, name: 'PC-01', ip: '192.168.1.101', status: 'online' },
    { id: 2, name: 'PC-02', ip: '192.168.1.102', status: 'online' },
    { id: 3, name: 'PC-03', ip: '192.168.1.103', status: 'online' },
  ];

  const handleConnect = (pc) => {
    setSelectedPC(pc);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedPC(null);
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Remote Desktop</h1>
        <p className="mt-1 text-sm text-muted-foreground">Windows computer-үүдийг notebook-той холбох</p>
      </div>

      {!isConnected ? (
        <div className="grid gap-4 md:grid-cols-3">
          {pcs.map((pc) => (
            <article key={pc.id} className="glass-card card-hover rounded-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-bold">{pc.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pc.ip}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                  pc.status === 'online' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {pc.status}
                </span>
              </div>

              <div className="mt-4 rounded-md bg-muted/40 p-3">
                <p className="text-sm text-muted-foreground">Систем</p>
                <p className="font-semibold">Windows 10/11</p>
              </div>

              <button
                onClick={() => handleConnect(pc)}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Play className="h-4 w-4" />
                Холбох
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-black/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{selectedPC?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedPC?.ip}</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-500/90 px-4 text-sm font-semibold text-white hover:opacity-90"
            >
              <Square className="h-4 w-4" />
              Салгах
            </button>
          </div>

          <div className="aspect-video rounded-lg bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Remote Desktop Connection</p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedPC?.name} руу холбогдсон байна
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                RDP connection: {selectedPC?.ip}:3389
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
