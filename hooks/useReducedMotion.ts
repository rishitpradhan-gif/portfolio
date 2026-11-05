"use client";
import { useEffect, useState } from "react";
export function useReducedMotion() {
  const [reduced, set] = useState(true);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => set(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return reduced;
}
