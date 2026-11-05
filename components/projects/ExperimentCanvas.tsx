"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ExperimentKind } from "@/data/projects";

export default function ExperimentCanvas({
  kind,
  paused = false,
  large = false,
  stimulus = 0,
}: {
  kind: ExperimentKind;
  paused?: boolean;
  large?: boolean;
  stimulus?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 1,
      height = 1,
      frame = 0,
      time = 0,
      last = 0,
      inside = false,
      active = true,
      seed = stimulus;
    const pointer = { x: 0.5, y: 0.5 },
      smooth = { x: 0.5, y: 0.5 };
    let repaint = () => {};
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      repaint();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const move = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - r.left) / r.width;
      pointer.y = (event.clientY - r.top) / r.height;
      inside = true;
    };
    const leave = () => {
      inside = false;
      pointer.x = 0.5;
      pointer.y = 0.5;
    };
    const click = () => {
      seed += 1;
      canvas.dataset.state = String(seed);
      if (reduced || paused) draw(0);
    };
    const draw = (stamp: number) => {
      const delta = last ? Math.min(stamp - last, 50) : 0;
      last = stamp;
      if (!reduced && !paused) time += delta * 0.001;
      smooth.x += (pointer.x - smooth.x) * 0.04;
      smooth.y += (pointer.y - smooth.y) * 0.04;
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5,
        cy = height * 0.5,
        scale = Math.min(width, height) * 0.36;
      if (kind === "cells") {
        for (let i = 0; i < 16; i++) {
          const a = i * 2.399 + seed * 0.7;
          const radius = scale * (0.15 + Math.sqrt(i / 16) * 0.8);
          const x =
            cx + Math.cos(a + time * 0.08) * radius + (smooth.x - 0.5) * 50;
          const y =
            cy +
            Math.sin(a + time * 0.08) * radius * 0.8 +
            (smooth.y - 0.5) * 30;
          const r = scale * (0.14 + 0.06 * Math.sin(i * 4 + time * 0.5));
          const glow = ctx.createRadialGradient(
            x - r * 0.3,
            y - r * 0.35,
            1,
            x,
            y,
            r,
          );
          glow.addColorStop(0, "#f8ffe6");
          glow.addColorStop(0.25, "#bedf85");
          glow.addColorStop(0.65, "#8bc29a");
          glow.addColorStop(0.87, "#4e8d78");
          glow.addColorStop(1, "#c4e2c090");
          ctx.beginPath();
          for (let j = 0; j <= 70; j++) {
            const t = (j / 70) * Math.PI * 2;
            const deform = 1 + Math.sin(t * 3 + time + i) * 0.09;
            const px = x + Math.cos(t) * r * deform,
              py = y + Math.sin(t) * r * deform;
            j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
          }
          ctx.fillStyle = glow;
          ctx.fill();
          ctx.strokeStyle = "#d8ff8850";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + r * 0.07, y + r * 0.05, r * 0.23, 0, Math.PI * 2);
          ctx.fillStyle = "#5c9173";
          ctx.fill();
        }
      } else if (kind === "quantum") {
        ctx.translate(cx, cy);
        const count = 16;
        for (let i = 0; i < count; i++) {
          const rot = (i / count) * Math.PI + time * 0.035 + smooth.x * 0.4;
          ctx.save();
          ctx.rotate(rot);
          const r =
            scale * (0.65 + 0.14 * Math.sin(time * 0.3 + i * 0.1 + seed));
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * (0.16 + 0.12 * smooth.y), 0, 0, Math.PI * 2);
          ctx.strokeStyle =
            i % 3 === 0 ? "#c4dba2" : i % 2 ? "#5c9c9980" : "#74a5b780";
          ctx.lineWidth = 1.2;
          ctx.stroke();
          const a = time * 0.45 + i * 1.2 + seed;
          const x = Math.cos(a) * r,
            y = Math.sin(a) * r * 0.23;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 ? "#b9e2c8" : "#e5efba";
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, scale * 0.13, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(-8, -9, 1, 0, 0, scale * 0.14);
        g.addColorStop(0, "#fff6f9");
        g.addColorStop(0.35, "#9dc8be");
        g.addColorStop(1, "#568c8d");
        ctx.fillStyle = g;
        ctx.fill();
        ctx.setTransform(
          canvas.width / width,
          0,
          0,
          canvas.height / height,
          0,
          0,
        );
      } else if (kind === "spatial") {
        const layers = 7;
        for (let i = layers; i >= 0; i--) {
          const offset = (i - 3) * 14;
          ctx.save();
          ctx.translate(
            cx + offset + (smooth.x - 0.5) * i * 12,
            cy - offset * 0.65,
          );
          ctx.rotate(-0.5 + time * 0.055);
          const s = scale * (0.8 - i * 0.045);
          ctx.transform(1, 0.12, 0.5, 0.72, 0, 0);
          ctx.fillStyle = `rgba(134,211,255,${0.04 + i * 0.012})`;
          ctx.strokeStyle = i === 0 ? "#397c78" : "#80b3a680";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.roundRect(-s, -s, s * 2, s * 2, 9);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      } else {
        for (let row = 0; row < 9; row++) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 3) {
            const mid = width * (inside ? smooth.x : 0.5);
            const envelope = Math.exp(-Math.pow((x - mid) / (width * 0.17), 2));
            const y =
              cy +
              (row - 4) * 18 +
              Math.sin(x * 0.035 + time * 1.4 + row * 0.4 + seed) *
                envelope *
                (35 + row * 3) *
                (1 + smooth.y * 0.5);
            x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.strokeStyle =
            row === 4
              ? "#4e8a78"
              : `rgba(80,${135 + row * 5},${110 + row * 5},${0.3 + row * 0.055})`;
          ctx.lineWidth = row === 4 ? 2 : 1;
          ctx.stroke();
        }
      }
      if (active && !reduced && !paused) frame = requestAnimationFrame(draw);
    };
    repaint = () => {
      cancelAnimationFrame(frame);
      draw(0);
    };
    const visibility = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          last = 0;
          cancelAnimationFrame(frame);
          draw(0);
        } else cancelAnimationFrame(frame);
      },
      { rootMargin: "100px" },
    );
    visibility.observe(canvas);
    const hidden = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else if (active && !reduced && !paused) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", click);
    document.addEventListener("visibilitychange", hidden);
    draw(0);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerdown", click);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [kind, reduced, paused, stimulus]);
  return (
    <canvas
      ref={ref}
      className={`experiment-canvas ${large ? "large" : ""}`}
      aria-label={`${kind} interactive visual experiment`}
      role="img"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.currentTarget.dispatchEvent(new PointerEvent("pointerdown"));
        }
      }}
    />
  );
}
