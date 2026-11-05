"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export default function DripRecording({
  paused = false,
}: {
  paused?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false),
    [choice, setChoice] = useState<boolean | null>(null),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    const node = video.current!;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = video.current!;
    const update = () => {
      if (!document.hidden && visible && !paused && (choice ?? !reduced))
        void node.play().catch(() => setPlaying(false));
      else node.pause();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [visible, paused, choice, reduced]);
  return (
    <figure className="project-photo drip-recording">
      <video
        ref={video}
        src="/videos/drip-dashboard.webm"
        poster="/images/drip-demo-dashboard.webp"
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Screen recording of the Drip prototype dashboard with sample data"
      />
      <div className="recording-badge">
        <i className={playing ? "recording-active" : ""} />
        {playing ? "Prototype in motion" : "Drip prototype"}
      </div>
      <button
        className="recording-control"
        disabled={paused}
        onClick={() => setChoice(!playing)}
        aria-label={playing ? "Pause Drip recording" : "Play Drip recording"}
      >
        {playing ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <figcaption>
        Recorded Drip prototype · illustrative dashboard data
      </figcaption>
    </figure>
  );
}
