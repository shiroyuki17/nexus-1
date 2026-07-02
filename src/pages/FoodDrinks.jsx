import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { formatMoney, getState, placeFoodOrder, toggleProductAvailability } from '@/lib/gamingCenterStore';
import { useAuth } from '@/lib/AuthContext';

export default function FoodDrinks() {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState(() => getState());
  const [cart, setCart] = useState({});
  const [pcNumber, setPcNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setState(getState());
    window.addEventListener('nexus-state-change', sync);
    return () => window.removeEventListener('nexus-state-change', sync);
  }, []);

  const cartItems = useMemo(
    () => Object.entries(cart)
      .filter(([, quantity]) => quantity > 0)
      .map(([product_id, quantity]) => {
        const product = state.products.find((item) => item.id === product_id);
        return { product_id, name: product?.name, quantity, price: product?.price ?? 0 };
      }),
    [cart, state.products]
  );
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const updateQty = (productId, delta) => {
    setCart((current) => ({ ...current, [productId]: Math.max(0, (current[productId] ?? 0) + delta) }));
  };

  const order = () => {
    try {
      placeFoodOrder(user.id, cartItems, pcNumber, notes);
      setCart({});
      setPcNumber('');
      setNotes('');
      setState(getState());
      setMessage('Захиалга амжилттай үүслээ.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Food & Drinks</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ундаа, snack, meal захиалга үүсгэж PC дугаар руу хүргэлтээр бүртгэнэ.</p>
      </div>

      {message ? <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {state.products.map((product) => (
            <article key={product.id} className="glass-card rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <span className={`rounded-md px-2 py-1 text-xs ${product.available ? 'bg-green-500/15 text-green-400' : 'bg-destructive/15 text-destructive'}`}>
                  {product.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-primary">{product.category}</p>
              <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <strong>{formatMoney(product.price)}</strong>
                <div className="flex items-center gap-2">
                  <button disabled={!product.available} onClick={() => updateQty(product.id, -1)} className="grid h-9 w-9 place-items-center rounded-md bg-muted/60 disabled:opacity-40"><Minus className="h-4 w-4" /></button>
                  <span className="w-6 text-center font-mono">{cart[product.id] ?? 0}</span>
                  <button disabled={!product.available} onClick={() => updateQty(product.id, 1)} className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              {isAdmin ? (
                <button onClick={() => { toggleProductAvailability(product.id); setState(getState()); }} className="mt-3 h-9 w-full rounded-md border border-border bg-muted/40 text-sm">
                  Toggle availability
                </button>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="glass-card h-fit rounded-lg p-4">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Cart
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            {cartItems.length === 0 ? <p className="text-muted-foreground">Сагс хоосон байна.</p> : cartItems.map((item) => (
              <div key={item.product_id} className="flex justify-between rounded-md bg-muted/40 p-3">
                <span>{item.name} x {item.quantity}</span>
                <strong>{formatMoney(item.quantity * item.price)}</strong>
              </div>
            ))}
          </div>
          <input placeholder="PC дугаар" className="mt-4 h-10 w-full rounded-md border border-border bg-muted/50 px-3" value={pcNumber} onChange={(event) => setPcNumber(event.target.value)} />
          <textarea placeholder="Тайлбар" className="mt-3 min-h-20 w-full rounded-md border border-border bg-muted/50 p-3" value={notes} onChange={(event) => setNotes(event.target.value)} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Нийт</span>
            <strong className="text-lg">{formatMoney(total)}</strong>
          </div>
          <button disabled={cartItems.length === 0} onClick={order} className="mt-4 h-10 w-full rounded-md bg-primary font-semibold text-primary-foreground disabled:opacity-40">
            Захиалах
          </button>
        </aside>
      </div>
    </section>
  );
}
