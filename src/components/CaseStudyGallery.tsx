import {useEffect, useMemo, useRef, useState} from "react";

type Source = { srcset: string; type: string };
export type GalleryItem = {
  src: string;                // e.g. "/assets/case-studies/slug/hero.webp"
  alt: string;                // meaningful alt, not filename
  caption?: string;           // optional line of context
  sources?: Source[];         // optional <source> candidates for <picture>
  width?: number;             // optional intrinsic width
  height?: number;            // optional intrinsic height
};

export default function CaseStudyGallery({
  items,
  thumbCols = { base: 1, sm: 2, md: 3, lg: 4 },
  rounded = "rounded-2xl",
}: {
  items: GalleryItem[];
  thumbCols?: { base?: number; sm?: number; md?: number; lg?: number };
  rounded?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const gridCls = useMemo(() => {
    const base = thumbCols.base ?? 1;
    const sm = thumbCols.sm ?? base;
    const md = thumbCols.md ?? sm;
    const lg = thumbCols.lg ?? md;
    return [
      "grid gap-4",
      `grid-cols-${base}`,
      `sm:grid-cols-${sm}`,
      `md:grid-cols-${md}`,
      `lg:grid-cols-${lg}`,
    ].join(" ");
  }, [thumbCols]);

  function openAt(i: number) {
    lastFocus.current = (document.activeElement as HTMLElement) || null;
    setIndex(i);
    setOpen(true);
  }
  function close() {
    setOpen(false);
    // return focus to the last focused element
    setTimeout(() => lastFocus.current?.focus(), 0);
  }
  function prev() { setIndex((i) => (i - 1 + items.length) % items.length); }
  function next() { setIndex((i) => (i + 1) % items.length); }

  // Key handlers when modal is open
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Simple focus trap
  useEffect(() => {
    if (!open) return;
    const dlg = dialogRef.current;
    if (!dlg) return;
    const focusable = dlg.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); (last || first).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); (first || last).focus();
      }
    }
    dlg.addEventListener("keydown", trap as any);
    // Initial focus
    (first || dlg).focus();
    return () => dlg.removeEventListener("keydown", trap as any);
  }, [open]);

  // Pointer swipe (basic)
  useEffect(() => {
    if (!open) return;
    const dlg = dialogRef.current; if (!dlg) return;
    let startX = 0, dx = 0, active = false;
    function down(e: PointerEvent) { active = true; startX = e.clientX; }
    function move(e: PointerEvent) { if (active) dx = e.clientX - startX; }
    function up() {
      if (!active) return;
      active = false;
      if (dx > 60) prev(); else if (dx < -60) next();
      dx = 0;
    }
    dlg.addEventListener("pointerdown", down);
    dlg.addEventListener("pointermove", move);
    dlg.addEventListener("pointerup", up);
    dlg.addEventListener("pointercancel", up);
    return () => {
      dlg.removeEventListener("pointerdown", down);
      dlg.removeEventListener("pointermove", move);
      dlg.removeEventListener("pointerup", up);
      dlg.removeEventListener("pointercancel", up);
    };
  }, [open]);

  return (
    <div>
      {/* Thumbs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
        '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' }
      }}>
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => openAt(i)}
            style={{ 
              position: 'relative', 
              overflow: 'hidden', 
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            aria-label={`Open image ${i + 1} of ${items.length}`}
          >
            <picture>
              {it.sources?.map((s, k) => (
                <source key={k} srcSet={s.srcset} type={s.type} />
              ))}
              <img
                loading="lazy"
                src={it.src}
                alt={it.alt}
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  height: '160px',
                  objectFit: 'cover' 
                }}
              />
            </picture>
            {it.caption && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: '0.875rem',
                padding: '0.5rem',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}>
                {it.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)'
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div ref={dialogRef} style={{ outline: 'none', position: 'relative', margin: '0 auto', maxWidth: '1200px', width: 'min(96vw, 1200px)' }}>
            <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: 'white' }}>
              <picture>
                {items[index].sources?.map((s, k) => (
                  <source key={k} srcSet={s.srcset} type={s.type} />
                ))}
                <img
                  src={items[index].src}
                  alt={items[index].alt}
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </picture>
              {items[index].caption && (
                <figcaption style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>
                  {items[index].caption}
                </figcaption>
              )}
            </div>

            {/* Controls */}
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{index + 1} / {items.length}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={prev}
                >← Prev</button>
                <button
                  style={{
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={next}
                >Next →</button>
                <button
                  style={{
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={close}
                >Close ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}