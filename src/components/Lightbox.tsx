import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  altPrefix?: string;
};

/** Fullscreen image lightbox with keyboard nav, backdrop close, and prev/next. */
export function Lightbox({ images, index, onClose, onNavigate, altPrefix = "Photo" }: LightboxProps) {
  const goPrev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate],
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <img
        key={images[index]}
        src={images[index]}
        alt={`${altPrefix} ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl animate-fade-in"
      />

      {images.length > 1 && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {index + 1} / {images.length}
        </span>
      )}
    </div>,
    document.body,
  );
}