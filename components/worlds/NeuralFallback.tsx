export default function NeuralFallback() {
  const nodes = [
    { x: 910, y: 320 },
    { x: 1190, y: 600 },
    { x: 770, y: 790 },
    { x: 1380, y: 120 },
    { x: 1150, y: 970 },
  ];
  return (
    <div className="neural-backup" aria-hidden="true">
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="neural-glow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <radialGradient id="soma">
            <stop stopColor="#d8cdff" />
            <stop offset=".2" stopColor="#a393cc" />
            <stop offset="1" stopColor="#8278b0" stopOpacity="0" />
          </radialGradient>
        </defs>
        {nodes.map((n, i) => (
          <g key={i}>
            {Array.from({ length: 8 }, (_, j) => {
              const a = (j * Math.PI) / 4 + i;
              const x = n.x + Math.cos(a) * 180,
                y = n.y + Math.sin(a) * 170;
              return (
                <g key={j}>
                  <path
                    d={`M${n.x},${n.y} Q${n.x + Math.cos(a + 0.35) * 95},${n.y + Math.sin(a + 0.35) * 70} ${x},${y}`}
                    className="fallback-branch"
                  />
                  {[0.45, 0.7, 0.9].map((f, k) => (
                    <path
                      key={k}
                      d={`M${n.x + (x - n.x) * f},${n.y + (y - n.y) * f} q${Math.cos(a + (k % 2 ? 1 : -1)) * 60},${Math.sin(a + (k % 2 ? 1 : -1)) * 60} ${Math.cos(a + (k % 2 ? 0.8 : -0.8)) * 105},${Math.sin(a + (k % 2 ? 0.8 : -0.8)) * 85}`}
                      className="fallback-twig"
                    />
                  ))}
                </g>
              );
            })}
            <circle
              cx={n.x}
              cy={n.y}
              r="35"
              fill="url(#soma)"
              filter="url(#neural-glow)"
            />
            <circle cx={n.x} cy={n.y} r="5" fill="#c9b7ef" />
            <circle
              cx={n.x}
              cy={n.y}
              r="14"
              className="fallback-pulse"
              style={{ animationDelay: `${i * 1.7}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
