import { useRef, useState } from "react";

const ITEM_HEIGHT = 76;
const SPIN_MS = 1800;

export default function ReelCard({ genres, onSettled }) {
  const [items, setItems] = useState([{ name: genres[0] }]);
  const [offset, setOffset] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef(null);

  function spin() {
    if (spinning) return;
    setSpinning(true);

    const spins = [];
    for (let i = 0; i < 14; i++) {
      spins.push(genres[Math.floor(Math.random() * genres.length)]);
    }
    const final = genres[Math.floor(Math.random() * genres.length)];
    spins.push(final);

    setTransitioning(false);
    setItems(spins.map((name) => ({ name })));
    setOffset(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitioning(true);
        setOffset((spins.length - 1) * ITEM_HEIGHT);
      });
    });

    timeoutRef.current = setTimeout(() => {
      setSpinning(false);
      onSettled?.(final);
    }, SPIN_MS + 50);
  }

  return (
    <div>
      <div className="text-center py-6">
        <div className="inline-block min-w-[240px] rounded-2xl bg-card px-6">
          <div className="h-[76px] overflow-hidden relative">
            <div
              className={transitioning ? "transition-transform ease-out" : ""}
              style={{
                transform: `translateY(-${offset}px)`,
                transitionDuration: transitioning ? `${SPIN_MS}ms` : "0ms",
                transitionTimingFunction: "cubic-bezier(0.15, 0.75, 0.25, 1)"
              }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className="h-[76px] flex flex-col justify-center"
                >
                  <p className="text-xs text-cardlabel m-0 mb-1">now spinning</p>
                  <p className="text-2xl font-medium text-cardtext m-0 whitespace-nowrap">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="w-full py-3 text-sm font-medium bg-neutral-900 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <i className="ti ti-refresh text-lg" aria-hidden="true"></i>
        <span>Spin</span>
      </button>
      <p className="text-xs text-neutral-400 text-center mt-2">
        tap spin to see the reel settle on a genre
      </p>
    </div>
  );
}
