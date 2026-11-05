"use client";
import { useEffect, useRef, useState } from "react";
import FishSchool from "./FishSchool";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export type AeroMood = "aero" | "noir" | "notes" | "micro";
const bases = [
  "A",
  "G",
  "T",
  "C",
  "C",
  "A",
  "T",
  "G",
  "A",
  "C",
  "G",
  "T",
  "A",
  "A",
  "G",
  "C",
  "T",
  "G",
  "C",
  "A",
  "T",
  "G",
  "A",
  "C",
  "T",
  "G",
  "C",
];
const complement: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
const tau = Math.PI * 2;
const turns = (y: number) => ((y - 55) / 24 / 10.5) * tau;
const initialPath = (strand: number) =>
  Array.from({ length: 101 }, (_, i) => {
    const y = 55 + i * 6.24;
    return `${i ? "L" : "M"}${(325 + Math.sin(turns(y) + strand * Math.PI) * 106).toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

export default function AeroWorld({
  paused,
  unzipped,
  lagoon,
}: {
  paused: boolean;
  unzipped: boolean;
  lagoon: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const helix = useRef<SVGGElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [popped, setPopped] = useState<number[]>([]);
  const phase = useRef(0);
  const separation = useRef(0);
  const unzipTarget = useRef(unzipped);
  useEffect(() => {
    unzipTarget.current = unzipped;
  }, [unzipped]);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!root.current || !svg.current || !helix.current || !stage.current)
      return;
    const element = root.current,
      group = helix.current,
      scene = stage.current;
    const strands = [
      ...svg.current.querySelectorAll<SVGPathElement>("[data-strand]"),
    ];
    const halves = [
      ...svg.current.querySelectorAll<SVGLineElement>("[data-half]"),
    ];
    const beads = [
      ...svg.current.querySelectorAll<SVGCircleElement>("[data-bead]"),
    ];
    const letters = [
      ...svg.current.querySelectorAll<SVGTextElement>("[data-base]"),
    ];
    const bubbles = [
      ...document.querySelectorAll<HTMLButtonElement>(".aero-bubble"),
    ];
    let frame = 0,
      last = 0;
    const camera = { x: 0, y: 0, angle: 0, scale: 1, opacity: 1, lens: 1 };
    const target = { x: 0, y: 0 },
      pointer = { x: 0, y: 0 };
    let scroll = window.scrollY;
    const move = (event: PointerEvent) => {
      target.x = event.clientX / innerWidth - 0.5;
      target.y = event.clientY / innerHeight - 0.5;
    };
    const draw = (time: number) => {
      const elapsed = last ? Math.min(time - last, 45) : 0;
      last = time;
      if (!reduced && !paused) phase.current += elapsed * 0.00015;
      const t = phase.current;
      separation.current +=
        (Number(unzipTarget.current) - separation.current) *
        (reduced || paused ? 1 : 0.055);
      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;
      const dive = Math.min(scroll / (innerHeight * 0.85), 1);
      element.style.setProperty("--dive", String(dive));
      element.dataset.depth = dive > 0.5 ? "underwater" : "surface";
      const chapter = document.documentElement.dataset.chapter ?? "home";
      const views: Record<
        string,
        {
          x: number;
          y: number;
          angle: number;
          scale: number;
          opacity: number;
          lens: number;
        }
      > = {
        home: { x: 0, y: 0, angle: 0, scale: 1, opacity: 1, lens: 1 },
        about: { x: -30, y: 9, angle: 28, scale: 0.7, opacity: 0.2, lens: 0 },
        research: {
          x: -14,
          y: -10,
          angle: -22,
          scale: 1.35,
          opacity: 0.29,
          lens: 0,
        },
        work: { x: -30, y: 1, angle: -70, scale: 1.2, opacity: 0.13, lens: 0 },
        offscreen: {
          x: -3,
          y: 8,
          angle: 12,
          scale: 0.8,
          opacity: 0.22,
          lens: 0,
        },
      };
      const destination = views[chapter] ?? views.home;
      const spring = reduced || paused ? 1 : 0.028;
      for (const key of [
        "x",
        "y",
        "angle",
        "scale",
        "opacity",
        "lens",
      ] as const)
        camera[key] += (destination[key] - camera[key]) * spring;
      scene.style.transform = reduced
        ? "none"
        : `translate(${camera.x}vw,${camera.y}vh) rotate(${camera.angle}deg) scale(${camera.scale})`;
      scene.style.opacity = String(camera.opacity);
      element.style.setProperty("--specimen-lens", String(camera.lens));
      group.style.transform = `translate(${reduced ? 0 : pointer.x * 25}px,${reduced ? 0 : pointer.y * 18}px) rotate(${23 + (reduced ? 0 : pointer.x * 5)}deg)`;
      for (let strand = 0; strand < 2; strand++) {
        let path = "";
        for (let i = 0; i <= 100; i++) {
          const y = 55 + i * 6.24;
          const angle =
            turns(y) + strand * Math.PI + t + (reduced ? 0 : pointer.x * 0.3);
          const x =
            325 +
            Math.sin(angle) * 106 +
            (strand ? 1 : -1) * separation.current * 78;
          path += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `;
        }
        strands
          .filter((n) => Number(n.dataset.strand) === strand)
          .forEach((n) => n.setAttribute("d", path));
      }
      bases.forEach((_, i) => {
        const y = 55 + i * 24,
          angle = turns(y) + t + (reduced ? 0 : pointer.x * 0.3);
        const x = 325 + Math.sin(angle) * 106 - separation.current * 78;
        const x2 = 325 - Math.sin(angle) * 106 + separation.current * 78;
        const mid = 325;
        const a = halves[i * 2],
          b = halves[i * 2 + 1];
        a.setAttribute("x1", String(x));
        a.setAttribute("x2", String(mid - separation.current * 42));
        b.setAttribute("x1", String(mid + separation.current * 42));
        b.setAttribute("x2", String(x2));
        [a, b].forEach((n) =>
          n.setAttribute(
            "opacity",
            String(0.45 + (0.25 * (Math.cos(angle) + 1)) / 2),
          ),
        );
        beads[i * 2]?.setAttribute("cx", String(x));
        beads[i * 2 + 1]?.setAttribute("cx", String(x2));
        beads[i * 2]?.setAttribute("r", String(12 + Math.cos(angle) * 3));
        beads[i * 2 + 1]?.setAttribute("r", String(12 - Math.cos(angle) * 3));
        const aLabel = letters[i * 2],
          bLabel = letters[i * 2 + 1];
        aLabel?.setAttribute(
          "x",
          String((x + mid - separation.current * 42) / 2),
        );
        bLabel?.setAttribute(
          "x",
          String((x2 + mid + separation.current * 42) / 2),
        );
      });
      bubbles.forEach((bubble, i) => {
        if (reduced || paused) {
          bubble.style.transform = "none";
          return;
        }
        const x = pointer.x * 18 * Math.sin(i + 1),
          y = pointer.y * 12 + Math.sin(t * 0.65 + i * 2) * 12;
        bubble.style.transform = `translate(${x}px,${y}px)`;
      });
      if (visible && !reduced && !paused) frame = requestAnimationFrame(draw);
    };
    const scrollEvent = () => {
      scroll = window.scrollY;
      if (reduced || paused) draw(0);
    };
    const unzipEvent = () => {
      if (reduced || paused) draw(0);
    };
    const dragEvent = (event: Event) => {
      phase.current += (event as CustomEvent<number>).detail * 0.014;
      if (reduced || paused) draw(0);
    };
    window.addEventListener("scroll", scrollEvent, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("dna-toggle", unzipEvent);
    window.addEventListener("dna-drag", dragEvent);
    window.addEventListener("journey-chapter", unzipEvent);
    draw(0);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scrollEvent);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("dna-toggle", unzipEvent);
      window.removeEventListener("dna-drag", dragEvent);
      window.removeEventListener("journey-chapter", unzipEvent);
    };
  }, [reduced, paused, visible]);
  useEffect(() => {
    window.dispatchEvent(new Event("dna-toggle"));
  }, [unzipped]);
  const pop = (index: number) => {
    setPopped((values) => [...values, index]);
    setTimeout(
      () => setPopped((values) => values.filter((value) => value !== index)),
      1100,
    );
  };
  return (
    <>
      <div
        ref={root}
        className={`aero-scene ${paused ? "is-paused" : ""} ${lagoon ? "lagoon" : ""} ${unzipped ? "dna-separated" : ""}`}
      >
        <div className="aero-sky" aria-hidden="true" />
        <div className="aero-underwater" aria-hidden="true" />
        <div className="cloud-wisp wisp-one" aria-hidden="true" />
        <div className="cloud-wisp wisp-two" aria-hidden="true" />
        <div className="cellular-hill" aria-hidden="true" />
        <div className="waterline" aria-hidden="true">
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none">
            <path d="M0 75 Q180 35 360 80 T720 75 T1080 70 T1440 75 V160 H0Z" />
          </svg>
        </div>
        <FishSchool paused={paused} />
        <div ref={stage} className="dna-stage" aria-hidden="true">
          <div className="specimen-lens">
            <div className="lens-orbit" />
            <div className="lens-refraction" />
          </div>
          <svg
            ref={svg}
            className="dna-sculpture"
            viewBox="0 0 650 800"
            fill="none"
          >
            <defs>
              <linearGradient
                id="dna-green"
                x1="180"
                y1="40"
                x2="400"
                y2="740"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#edffc8" />
                <stop offset=".22" stopColor="#98db90" />
                <stop offset=".53" stopColor="#49ae81" />
                <stop offset=".8" stopColor="#289a95" />
                <stop offset="1" stopColor="#baefd1" />
              </linearGradient>
              <linearGradient
                id="dna-blue"
                x1="400"
                y1="40"
                x2="230"
                y2="740"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#e4fffa" />
                <stop offset=".24" stopColor="#8ed9d8" />
                <stop offset=".55" stopColor="#3da6ae" />
                <stop offset=".8" stopColor="#78d1bf" />
                <stop offset="1" stopColor="#d4edd2" />
              </linearGradient>
              <radialGradient id="dna-bead" cx=".28" cy=".2" r=".85">
                <stop stopColor="white" />
                <stop offset=".25" stopColor="#dbf4e8" />
                <stop offset=".62" stopColor="#9ccdbd" />
                <stop offset="1" stopColor="#4a938c" />
              </radialGradient>
              <radialGradient id="dna-lime" cx=".28" cy=".2" r=".85">
                <stop stopColor="#ffffee" />
                <stop offset=".3" stopColor="#d5efb4" />
                <stop offset=".65" stopColor="#9cd17e" />
                <stop offset="1" stopColor="#578e68" />
              </radialGradient>
              <linearGradient id="tube-glint">
                <stop stopColor="white" stopOpacity=".9" />
                <stop offset="1" stopColor="white" stopOpacity=".05" />
              </linearGradient>
            </defs>
            <g ref={helix} className="helix-group">
              {bases.map((base, i) => {
                const y = 55 + i * 24,
                  x = 325 + Math.sin(turns(y)) * 106,
                  x2 = 650 - x;
                return (
                  <g key={i}>
                    <line
                      data-half
                      x1={x}
                      y1={y}
                      x2="325"
                      y2={y}
                      stroke={
                        base === "A" || base === "T" ? "#99c889" : "#6fb4b8"
                      }
                      strokeWidth="9"
                      strokeLinecap="round"
                      opacity=".6"
                    />
                    <line
                      data-half
                      x1="325"
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={
                        base === "A" || base === "T" ? "#9dccbb" : "#b9caaa"
                      }
                      strokeWidth="9"
                      strokeLinecap="round"
                      opacity=".6"
                    />
                    <circle
                      data-bead
                      cx={x}
                      cy={y}
                      r="12"
                      fill="url(#dna-lime)"
                    />
                    <circle
                      data-bead
                      cx={x2}
                      cy={y}
                      r="12"
                      fill="url(#dna-bead)"
                    />
                    <text
                      data-base
                      x={(x + 325) / 2}
                      y={y + 3}
                      className="base-letter"
                    >
                      {base}
                    </text>
                    <text
                      data-base
                      x={(x2 + 325) / 2}
                      y={y + 3}
                      className="base-letter"
                    >
                      {complement[base]}
                    </text>
                  </g>
                );
              })}
              {[0, 1].map((strand) => (
                <g key={strand}>
                  <path
                    data-strand={strand}
                    d={initialPath(strand)}
                    stroke={`url(#${strand ? "dna-blue" : "dna-green"})`}
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <path
                    data-strand={strand}
                    d={initialPath(strand)}
                    stroke="url(#tube-glint)"
                    strokeWidth="2.5"
                    transform="translate(-3 -2)"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </g>
          </svg>
          <div className="dna-shadow" />
        </div>
        <div className="underwater-particles" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 29) % 100}%`,
                animationDelay: `${i * -0.8}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className={`aero-bubble-layer ${paused ? "is-paused" : ""}`}>
        {["Molecule", "Cell", "Qubit", "Signal"].map((name, i) => (
          <button
            key={name}
            className={`aero-bubble bubble-${i} ${popped.includes(i) ? "bubble-popped" : ""}`}
            onClick={() => pop(i)}
            aria-label={`Pop ${name.toLowerCase()} bubble`}
          >
            <svg viewBox="0 0 40 40" aria-hidden="true">
              {i === 0 ? (
                <path d="m12 15 8-5 8 5v10l-8 5-8-5z M20 10V5 M28 15l6-3" />
              ) : i === 1 ? (
                <>
                  <circle cx="20" cy="20" r="11" />
                  <circle cx="21" cy="19" r="4" />
                </>
              ) : i === 2 ? (
                <>
                  <ellipse
                    cx="20"
                    cy="20"
                    rx="14"
                    ry="6"
                    transform="rotate(40 20 20)"
                  />
                  <ellipse
                    cx="20"
                    cy="20"
                    rx="14"
                    ry="6"
                    transform="rotate(-40 20 20)"
                  />
                  <circle cx="20" cy="20" r="2" />
                </>
              ) : (
                <path d="M4 21h8l4-9 7 18 4-9h9" />
              )}
            </svg>
          </button>
        ))}
      </div>
    </>
  );
}
