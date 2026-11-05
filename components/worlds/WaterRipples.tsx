"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Ephemeral light rings acknowledge clicks without changing native pointer behavior. */
export default function WaterRipples({ paused }: { paused: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || paused) return;
    const root = layer.current;
    if (!root) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const ripple = (event: PointerEvent) => {
      if (event.pointerType === "touch" && event.isPrimary === false) return;
      if (root.children.length >= 5) root.firstElementChild?.remove();
      const ring = document.createElement("i");
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      root.appendChild(ring);
      const timer = setTimeout(() => {
        ring.remove();
        timers.delete(timer);
      }, 1600);
      timers.add(timer);
    };
    window.addEventListener("pointerdown", ripple, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", ripple);
      timers.forEach(clearTimeout);
      root.replaceChildren();
    };
  }, [paused, reduced]);
  return <div className="water-ripple-layer" ref={layer} aria-hidden="true" />;
}
