"use client";
import { useState, useId } from "react";
import { Users, Plus, RotateCcw, TreePine } from "lucide-react";
const project = (x: number, z: number) => ({
  x: 300 + (x - z) * 29,
  y: 210 + (x + z) * 14,
});
const point = (x: number, z: number) => {
  const p = project(x, z);
  return `${p.x},${p.y}`;
};
export default function WorldEnginePreview() {
  const uid = useId().replace(/:/g, "");
  const [building, setBuilding] = useState(false);
  const [planted, setPlanted] = useState<[number, number][]>([]);
  const [player, setPlayer] = useState({ x: 1, z: 1 });
  const [players, setPlayers] = useState(3);
  const [terrain, setTerrain] = useState(false);
  const others = [
    { x: -1.5, z: -1.2, color: "#d8b89e" },
    { x: 2, z: -2, color: "#a4c7d8" },
    { x: -2, z: 2, color: "#d2c69f" },
    { x: 0, z: -2.5, color: "#c0b1cb" },
    { x: 2.5, z: 1.5, color: "#bfd09c" },
  ];
  const baseTrees = terrain
    ? [
        [-2, -2],
        [2, 2],
        [1, -2],
        [-2, 1],
      ]
    : [
        [-2.4, -2.1],
        [-2.2, 0.4],
        [1.9, -2.4],
        [2.5, 2.1],
      ];
  const trees = [...baseTrees, ...planted];
  const plant = (x: number, z: number) =>
    setPlanted((items) =>
      items.length >= 12
        ? items
        : [...items, [Math.round(x * 2) / 2, Math.round(z * 2) / 2]],
    );
  const avatar = (
    x: number,
    z: number,
    color: string,
    label: string,
    index: number,
  ) => {
    const p = project(x, z);
    return (
      <g
        key={index}
        className="world-avatar"
        transform={`translate(${p.x} ${p.y})`}
      >
        <ellipse cy="3" rx="11" ry="5" fill="#4b7e6c22" />
        <path
          d="M-7 0v-13q7-7 14 0V0Z"
          fill={color}
          stroke="#f7ffed90"
          strokeWidth=".6"
        />
        <circle cy="-21" r="7.5" fill={color} />
        <path
          d="M-3-25q3-2 5 0"
          stroke="#ffffffb0"
          strokeWidth="1.5"
          fill="none"
        />
        <text y="-37" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };
  return (
    <div className="world-preview">
      <div className="preview-topbar">
        <span>
          <i /> Shared world
        </span>
        <span>
          <Users size={12} />
          {players} demo players
        </span>
      </div>
      <svg
        viewBox="0 0 600 400"
        className="island-scene"
        tabIndex={0}
        role="img"
        aria-label={
          building
            ? "DreamIT build mode. Click the island to plant trees. Use Plant tree for a keyboard alternative."
            : "DreamIT world preview. Click the island or use arrow keys to move your player."
        }
        onPointerDown={(event) => {
          const matrix = event.currentTarget.getScreenCTM();
          if (!matrix) return;
          const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
            matrix.inverse(),
          );
          const u = (p.x - 300) / 29,
            v = (p.y - 210) / 14;
          if (building) {
            plant(
              Math.max(-3.3, Math.min(3.3, (u + v) / 2)),
              Math.max(-3.3, Math.min(3.3, (v - u) / 2)),
            );
            return;
          }
          setPlayer({
            x: Math.max(-3.3, Math.min(3.3, (u + v) / 2)),
            z: Math.max(-3.3, Math.min(3.3, (v - u) / 2)),
          });
        }}
        onKeyDown={(event) => {
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-0.4, 0],
            ArrowRight: [0.4, 0],
            ArrowUp: [0, -0.4],
            ArrowDown: [0, 0.4],
          };
          if (moves[event.key]) {
            event.preventDefault();
            const [x, z] = moves[event.key];
            setPlayer((p) => ({
              x: Math.max(-3.3, Math.min(3.3, p.x + x)),
              z: Math.max(-3.3, Math.min(3.3, p.z + z)),
            }));
          }
        }}
      >
        <defs>
          <linearGradient
            id={`${uid}-island-grass`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop stopColor={terrain ? "#c9d7b0" : "#d3e9b5"} />
            <stop offset="1" stopColor="#9ec69a" />
          </linearGradient>
          <radialGradient id={`${uid}-tree-canopy`} cx=".3" cy=".2" r=".8">
            <stop stopColor="#e5f3cc" />
            <stop offset=".4" stopColor="#abd190" />
            <stop offset="1" stopColor="#639e79" />
          </radialGradient>
          <radialGradient id={`${uid}-island-shadow`}>
            <stop stopColor="#5a8e8055" />
            <stop offset="1" stopColor="#6eaa8c00" />
          </radialGradient>
        </defs>
        <ellipse
          cx="300"
          cy="330"
          rx="230"
          ry="38"
          fill={`url(#${uid}-island-shadow)`}
        />
        <polygon
          points={`${point(-4, 4)} ${point(4, 4)} ${point(4, -4)} 532,245 300,357 68,245`}
          fill="#adc9ad"
        />
        <path d="M68 210 300 322 300 357 68 245Z" fill="#9cb99e" />
        <path d="M300 322 532 210 532 245 300 357Z" fill="#86ad98" />
        <polygon
          points={`${point(-4, -4)} ${point(4, -4)} ${point(4, 4)} ${point(-4, 4)}`}
          fill={`url(#${uid}-island-grass)`}
          stroke="#f1ffe4"
          strokeWidth="1.4"
        />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} stroke="#f4ffe870" strokeWidth=".7">
            <line
              x1={project(i - 4, -4).x}
              y1={project(i - 4, -4).y}
              x2={project(i - 4, 4).x}
              y2={project(i - 4, 4).y}
            />
            <line
              x1={project(-4, i - 4).x}
              y1={project(-4, i - 4).y}
              x2={project(4, i - 4).x}
              y2={project(4, i - 4).y}
            />
          </g>
        ))}
        <path
          d={`M${point(-1, -1)} ${point(1, -1)} ${point(1, 1)} ${point(-1, 1)}Z`}
          fill="#e9efce70"
        />
        {trees.map(([x, z], i) => {
          const p = project(x, z);
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <ellipse rx="20" ry="7" fill="#558b6220" />
              <path d="M0 0v-28" stroke="#9eaa7a" strokeWidth="5" />
              <circle
                cy="-39"
                r={i % 2 ? 23 : 27}
                fill={`url(#${uid}-tree-canopy)`}
              />
              <circle cx="-9" cy="-45" r="12" fill="#dff3be45" />
            </g>
          );
        })}
        {others
          .slice(0, players - 1)
          .map((p, i) => avatar(p.x, p.z, p.color, `p${i + 2}`, i))}
        {avatar(player.x, player.z, "#53998a", "you", 10)}
      </svg>
      <div className="preview-bottom">
        <span>
          {building ? `${planted.length} / 12 trees planted` : "Click to move"}
        </span>
        <div>
          <button
            onClick={() => setBuilding(!building)}
            aria-pressed={building}
            aria-label="Build mode"
          >
            <TreePine size={12} />
            {building ? "Explore" : "Build"}
          </button>
          {building && (
            <button
              onClick={() => plant(player.x, player.z)}
              disabled={planted.length >= 12}
            >
              Plant tree
            </button>
          )}
          <button
            onClick={() => {
              setTerrain(!terrain);
              setPlanted([]);
            }}
            aria-label="Change DreamIT world"
          >
            <RotateCcw size={12} />
          </button>
          <button
            onClick={() => setPlayers((value) => Math.min(6, value + 1))}
            disabled={players >= 6}
          >
            <Plus size={12} />
            Add player
          </button>
        </div>
      </div>
    </div>
  );
}
