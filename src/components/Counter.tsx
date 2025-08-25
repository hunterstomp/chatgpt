import { useState } from 'react';

export default function Counter({ start = 0 }: { start?: number }) {
  const [n, setN] = useState(start);
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 border">
      <button aria-label="decrement" onClick={() => setN(n - 1)}>-</button>
      <span className="tabular-nums">{n}</span>
      <button aria-label="increment" onClick={() => setN(n + 1)}>+</button>
    </div>
  );
}
