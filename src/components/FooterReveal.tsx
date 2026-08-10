import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Sticky footer reveal: the page content slides up as you reach the bottom,
 * exposing the footer that sits fixed underneath it.
 */
export function FooterReveal({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;
    const measure = () => setHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="relative z-10 bg-background" style={{ marginBottom: height }}>
        {children}
      </div>
      <div ref={footerRef} className="fixed inset-x-0 bottom-0 z-0 bg-surface">
        {footer}
      </div>
    </>
  );
}
