"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Download, Pause, Play, Sparkles } from "lucide-react";
const W = 220,
  H = 140;
const presets = {
  Coral: { feed: 0.0545, kill: 0.062 },
  Fingerprint: { feed: 0.035, kill: 0.06 },
  Spots: { feed: 0.03, kill: 0.062 },
};
export default function PatternLab({ paused = false }: { paused?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null),
    seed = useRef<(() => void) | null>(null),
    brush = useRef(false),
    active = useRef(false),
    settings = useRef({ ...presets.Coral }),
    play = useRef(false);
  const [playing, setPlaying] = useState(false),
    [preset, setPreset] = useState("Coral"),
    [feed, setFeed] = useState(0.0545),
    [kill, setKill] = useState(0.062),
    [painted, setPainted] = useState(false);
  const id = useId();
  useEffect(() => {
    play.current = playing && !paused;
  }, [playing, paused]);
  useEffect(() => {
    const el = canvas.current!,
      ctx = el.getContext("2d")!,
      buffer = document.createElement("canvas");
    buffer.width = W;
    buffer.height = H;
    const bc = buffer.getContext("2d")!,
      pixels = bc.createImageData(W, H);
    let a = new Float32Array(W * H).fill(1),
      b = new Float32Array(W * H),
      an = new Float32Array(W * H),
      bn = new Float32Array(W * H),
      frame = 0;
    function plant(x: number, y: number, r = 5) {
      for (let j = Math.max(1, y - r); j < Math.min(H - 1, y + r); j++)
        for (let i = Math.max(1, x - r); i < Math.min(W - 1, x + r); i++)
          if ((i - x) ** 2 + (j - y) ** 2 < r * r) {
            b[j * W + i] = 0.9;
            a[j * W + i] = 0.25;
          }
    }
    function reset() {
      a.fill(1);
      b.fill(0);
      for (let k = 0; k < 22; k++)
        plant(
          12 + Math.floor(Math.random() * (W - 24)),
          12 + Math.floor(Math.random() * (H - 24)),
          3 + Math.floor(Math.random() * 5),
        );
      for (let i = 0; i < 650; i++) step();
      draw();
    }
    seed.current = reset;
    function step() {
      const { feed: f, kill: k } = settings.current;
      for (let y = 1; y < H - 1; y++)
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x,
            A = a[i],
            B = b[i],
            reaction = A * B * B;
          const la =
            -A +
            0.2 * (a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) +
            0.05 * (a[i - W - 1] + a[i - W + 1] + a[i + W - 1] + a[i + W + 1]);
          const lb =
            -B +
            0.2 * (b[i - 1] + b[i + 1] + b[i - W] + b[i + W]) +
            0.05 * (b[i - W - 1] + b[i - W + 1] + b[i + W - 1] + b[i + W + 1]);
          an[i] = Math.max(0, Math.min(1, A + la - reaction + f * (1 - A)));
          bn[i] = Math.max(
            0,
            Math.min(1, B + 0.5 * lb + reaction - (k + f) * B),
          );
        }
      for (let x = 0; x < W; x++) {
        an[x] = an[(H - 1) * W + x] = 1;
        bn[x] = bn[(H - 1) * W + x] = 0;
      }
      for (let y = 0; y < H; y++) {
        an[y * W] = an[y * W + W - 1] = 1;
        bn[y * W] = bn[y * W + W - 1] = 0;
      }
      [a, an] = [an, a];
      [b, bn] = [bn, b];
    }
    function draw() {
      for (let i = 0; i < a.length; i++) {
        const t = Math.min(1, b[i] * 2.8),
          rim = Math.max(0, 1 - Math.abs(t - 0.6) * 5);
        pixels.data[i * 4] = Math.round(6 + t * 190 + rim * 25);
        pixels.data[i * 4 + 1] = Math.round(52 + t * 180);
        pixels.data[i * 4 + 2] = Math.round(43 + t * 65);
        pixels.data[i * 4 + 3] = 255;
      }
      bc.putImageData(pixels, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(buffer, 0, 0, el.width, el.height);
    }
    function paint(e: PointerEvent) {
      if (!brush.current) return;
      const r = el.getBoundingClientRect();
      plant(
        Math.round(((e.clientX - r.left) / r.width) * W),
        Math.round(((e.clientY - r.top) / r.height) * H),
        5,
      );
      draw();
    }
    const down = (e: PointerEvent) => {
        brush.current = true;
        el.setPointerCapture(e.pointerId);
        paint(e);
        setPainted(true);
      },
      up = () => {
        brush.current = false;
      };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", paint);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    const observer = new IntersectionObserver(
      ([entry]) => (active.current = entry.isIntersecting),
    );
    observer.observe(el);
    function tick() {
      if (active.current && play.current && !document.hidden) {
        for (let i = 0; i < 6; i++) step();
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    reset();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      seed.current = null;
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", paint);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);
  function choose(name: keyof typeof presets) {
    const s = presets[name];
    settings.current = { ...s };
    setPreset(name);
    setFeed(s.feed);
    setKill(s.kill);
    seed.current?.();
    setPlaying(true);
  }
  return (
    <div className="pattern-lab">
      <div className="lab-top">
        <span className="micro">Morphogenesis / live canvas</span>
        <span className="lab-status">
          <i className={playing && !paused ? "is-live" : ""} />
          {playing && !paused ? "Growing" : "Still life"}
        </span>
      </div>
      <div className="pattern-stage">
        <canvas
          ref={canvas}
          width={880}
          height={560}
          aria-label="Living reaction-diffusion pattern. Drag to paint chemical seeds. Keyboard users can use the Add seeds button."
        />
        <span className="pattern-hint">
          {painted
            ? "Your mark is part of the system."
            : "Drag to plant a little chaos."}
        </span>
      </div>
      <div className="lab-controls">
        <div className="lab-presets" role="group" aria-label="Pattern presets">
          {(Object.keys(presets) as (keyof typeof presets)[]).map((name) => (
            <button
              key={name}
              aria-pressed={preset === name}
              onClick={() => choose(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="lab-actions">
          <button
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? "Pause growth" : "Grow pattern"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            <span>{playing ? "Pause" : "Grow"}</span>
          </button>
          <button
            onClick={() => {
              seed.current?.();
              setPainted(true);
            }}
            aria-label="Add seeds"
          >
            <Sparkles size={14} />
            <span>Reseed</span>
          </button>
          <button
            aria-label="Save pattern as PNG"
            onClick={() => {
              const link = document.createElement("a");
              link.download = "morphogenesis.png";
              link.href = canvas.current!.toDataURL("image/png");
              link.click();
            }}
          >
            <Download size={14} />
          </button>
        </div>
        <div className="lab-sliders">
          <label htmlFor={`${id}-feed`}>
            Feed <output>{feed.toFixed(4)}</output>
            <input
              id={`${id}-feed`}
              type="range"
              min="0.02"
              max="0.07"
              step="0.0005"
              value={feed}
              onChange={(e) => {
                const value = Number(e.target.value);
                setFeed(value);
                settings.current.feed = value;
                setPreset("Custom");
              }}
            />
          </label>
          <label htmlFor={`${id}-kill`}>
            Decay <output>{kill.toFixed(4)}</output>
            <input
              id={`${id}-kill`}
              type="range"
              min="0.045"
              max="0.075"
              step="0.0005"
              value={kill}
              onChange={(e) => {
                const value = Number(e.target.value);
                setKill(value);
                settings.current.kill = value;
                setPreset("Custom");
              }}
            />
          </label>
        </div>
      </div>
      <p className="lab-note">
        Two virtual chemicals. One evolving pattern. Inspired by
        reaction–diffusion; a creative simulation.
      </p>
    </div>
  );
}
