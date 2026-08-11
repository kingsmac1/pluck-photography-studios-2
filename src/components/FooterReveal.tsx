import { useEffect, useRef, useState, type ReactNode } from "react";

export function FooterReveal({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const measure = () => {
      setHeight(node.offsetHeight);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Page content */}
      <div
        className="relative z-10 bg-background md:mb-[var(--footer-height)]"
        style={
          {
            "--footer-height": `${height}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="
          relative
          z-0
          bg-surface

          md:fixed
          md:inset-x-0
          md:bottom-0
        "
      >
        {footer}
      </div>
    </>
  );
}