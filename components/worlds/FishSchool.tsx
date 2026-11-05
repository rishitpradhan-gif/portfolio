"use client";
import { useEffect, useRef, useId } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function FishSchool({ paused }: { paused: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const time = useRef(0);
  useEffect(() => {
    const root = layer.current;
    if (!root) return;
    const fish = [...root.querySelectorAll<HTMLDivElement>(".aero-fish")];
    let frame = 0,
      last = 0;
    const pointer = { x: -1000, y: -1000 };
    let visible = !document.hidden;
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const draw = (stamp: number) => {
      const dt = last ? Math.min(stamp - last, 45) : 0;
      last = stamp;
      if (!paused && !reduced) time.current += dt * 0.001;
      const t = time.current;
      const dive = Math.min(scrollY / (innerHeight * 0.85), 1);
      root.style.opacity = String(0.28 + dive * 0.65);
      fish.forEach((node, i) => {
        const direction = i % 2 ? 1 : -1;
        const progress = (t * (0.012 + i * 0.0018) + i * 0.21) % 1;
        const x =
          (direction === 1 ? progress : 1 - progress) * (innerWidth + 280) -
          140;
        const baseY =
          innerHeight * (0.71 + (i % 3) * 0.1 - dive * (0.45 - (i % 2) * 0.1));
        let y =
          baseY + (reduced || paused ? 0 : Math.sin(t * 0.6 + i * 2) * 18);
        const distance = Math.hypot(pointer.x - x, pointer.y - y);
        if (distance < 140 && !reduced && !paused)
          y += (y > pointer.y ? 1 : -1) * (140 - distance) * 0.24;
        node.style.transform = `translate3d(${x}px,${y}px,0) scaleX(${direction}) rotate(${Math.sin(t * 0.6 + i) * 3}deg)`;
      });
      if (visible && !paused && !reduced) frame = requestAnimationFrame(draw);
    };
    const scroll = () => {
      if (paused || reduced) draw(0);
    };
    const visibility = () => {
      visible = !document.hidden;
      cancelAnimationFrame(frame);
      if (visible) {
        last = 0;
        draw(0);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    draw(0);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reduced]);
  return (
    <div
      ref={layer}
      className={`fish-school ${paused ? "is-paused" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <div className={`aero-fish fish-${i}`} key={i}>
          <svg viewBox="0 0 170 90">
            <defs>
              <linearGradient
                id={`${id}-body-${i}`}
                x1="0"
                y1="0"
                x2=".5"
                y2="1"
              >
                <stop stopColor="#fffff4" />
                <stop offset=".22" stopColor={i % 2 ? "#dce7bd" : "#b9dfd9"} />
                <stop offset=".5" stopColor={i % 2 ? "#95ba95" : "#76b7b1"} />
                <stop offset=".8" stopColor="#d1e7cf" />
                <stop offset="1" stopColor="#faffec" />
              </linearGradient>
              <linearGradient id={`${id}-fin-${i}`}>
                <stop stopColor="#ffffffa0" />
                <stop offset="1" stopColor="#71a99c10" />
              </linearGradient>
            </defs>
            <g className="fish-tail">
              <path
                d="M53 43Q26 17 17 21q10 23 0 47 23-4 36-25"
                fill={`url(#${id}-fin-${i})`}
                stroke="#bed9c966"
                strokeWidth=".7"
              />
              <path
                d="M48 43 22 26M48 43 20 42M48 43 23 63"
                stroke="#84b5a966"
                strokeWidth=".5"
              />
            </g>
            <path
              d="M48 43Q77 12 121 30q18 7 27 16-11 19-39 19-39 0-61-22"
              fill={`url(#${id}-body-${i})`}
              stroke="#8eb7a660"
              strokeWidth=".6"
            />
            <path
              d="M75 28q14-26 30-14l11 15M84 62q10 18 24 13l7-11"
              fill={`url(#${id}-fin-${i})`}
              stroke="#b2cfbf66"
              strokeWidth=".6"
            />
            <path
              className="fish-fin"
              d="M99 45q-24 3-17 18 19-6 17-18"
              fill="#eef8d866"
              stroke="#91b3a755"
              strokeWidth=".6"
            />
            <path
              d="M124 35q-10 11-1 23M57 43q34 8 68 0"
              fill="none"
              stroke="#639b9160"
              strokeWidth=".7"
            />
            <path
              d="M63 36q23-11 52-3"
              fill="none"
              stroke="#ffffff90"
              strokeWidth="1.5"
            />
            <circle cx="132" cy="41" r="3.5" fill="#f6ffe9" />
            <circle cx="133" cy="41" r="1.8" fill="#37665d" />
            <circle cx="133.5" cy="40.4" r=".5" fill="white" />
            {Array.from({ length: 4 }, (_, j) => (
              <path
                key={j}
                d={`M${72 + j * 11} 37q-7 8 0 15`}
                fill="none"
                stroke="#6faaa738"
                strokeWidth=".6"
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}
