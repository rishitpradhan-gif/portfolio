"use client";
import { useEffect, useState, useId } from "react";
import { Activity, Heart, Radio } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export default function WearablePreview({
  paused = false,
}: {
  paused?: boolean;
}) {
  const sliderId = useId();
  const [activity, setActivity] = useState(22);
  const [tick, setTick] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || reduced) return;
    const interval = setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1);
    }, 900);
    return () => clearInterval(interval);
  }, [paused, reduced]);
  const bpm = Math.round(
    62 + activity * 0.72 + (paused || reduced ? 0 : Math.sin(tick * 0.8) * 2),
  );
  const waveform = Array.from({ length: 70 }, (_, i) => {
    const x = 10 + i * 3.7;
    const envelope = Math.exp(-Math.pow((((i + tick * 2) % 22) - 11) / 3, 2));
    const y =
      52 - Math.sin(i * 0.7 + tick * 0.4) * envelope * (15 + activity * 0.12);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <div className="wearable-preview">
      <div className="preview-topbar">
        <span>
          <i /> Drip / wearable stream
        </span>
        <span>Simulated data</span>
      </div>
      <div className="wearable-layout">
        <div className="watch-model" aria-hidden="true">
          <div className="watch-band" />
          <div className="watch-face">
            <span>drip</span>
            <Heart size={14} />
            <strong>{bpm}</strong>
            <small>BPM</small>
            <svg viewBox="0 0 100 35">
              <path d="M0 20h18l7-8 7 17 7-25 7 18h16l5-5 5 7h28" />
            </svg>
          </div>
          <div className="watch-crown" />
        </div>
        <div className="wearable-feed">
          <div className="feed-label">
            <Heart size={12} />
            Heart rate <Radio size={12} />
          </div>
          <div className="bpm-readout">
            <strong>{bpm}</strong>
            <span>bpm</span>
          </div>
          <svg
            className="wearable-waveform"
            viewBox="0 0 280 100"
            aria-label="Simulated heart rate waveform"
          >
            <path d={waveform} />
          </svg>
          <div className="sample-insight">
            <Activity size={13} />
            <span>
              {activity > 65
                ? "Higher activity"
                : activity > 30
                  ? "On the move"
                  : "Taking it easy"}
            </span>
          </div>
        </div>
      </div>
      <div className="wearable-slider">
        <label htmlFor={sliderId}>
          Try the data <span>{activity}% activity</span>
        </label>
        <input
          id={sliderId}
          type="range"
          min="0"
          max="100"
          value={activity}
          onChange={(event) => setActivity(Number(event.target.value))}
          aria-label="Simulated activity level"
        />
      </div>
    </div>
  );
}
