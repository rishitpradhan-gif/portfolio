"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play, Dna } from "lucide-react";
import AeroWorld from "@/components/worlds/AeroWorld";
import WorkSection from "./WorkSection";
import AboutSection from "./AboutSection";
import ResearchSection from "./ResearchSection";
import OffscreenSection from "./OffscreenSection";
import JourneyNavigation from "@/components/navigation/JourneyNavigation";
import WaterRipples from "@/components/worlds/WaterRipples";
import ProjectDialog from "@/components/ui/ProjectDialog";

export default function Portfolio() {
  const drag = useRef<{ x: number; start: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const [lagoon, setLagoon] = useState(false);
  const [unzipped, setUnzipped] = useState(false);
  const [project, setProject] = useState<number | null>(null);
  useEffect(() => {
    document.documentElement.dataset.lagoon = String(lagoon);
  }, [lagoon]);
  return (
    <div className={`portfolio-shell ${paused ? "motion-paused" : ""}`}>
      <AeroWorld paused={paused} unzipped={unzipped} lagoon={lagoon} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="monogram" href="#" aria-label="Rishit Pradhan home">
          rp<span>•</span>
        </a>
        <span className="header-discipline">
          Chemical biology & creative computation
        </span>
        <nav className="compact-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="#work">Projects</a>
          <a href="#offscreen">
            Off the clock <ArrowUpRight size={13} />
          </a>
        </nav>
      </header>
      <main id="main">
        <section id="home" className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              Rishit
              <br />
              <span>Pradhan</span>
              <span className="name-period">.</span>
            </h1>
            <p>
              Chemical biology at UC Berkeley.
              <br />
              Building across molecules, minds, and machines.
            </p>
          </div>
          <div className="specimen-caption" aria-hidden="true">
            <span>Fig. 01</span>
            <i />
            <span>A living thread</span>
          </div>
          <button
            className="dna-hit-area"
            aria-label="Interact with DNA"
            aria-description="Drag horizontally to rotate. Click or press Enter to separate the strands. Arrow keys rotate the helix."
            onPointerDown={(event) => {
              drag.current = { x: event.clientX, start: event.clientX };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!drag.current) return;
              window.dispatchEvent(
                new CustomEvent("dna-drag", {
                  detail: event.clientX - drag.current.x,
                }),
              );
              drag.current.x = event.clientX;
            }}
            onPointerUp={(event) => {
              if (
                drag.current &&
                Math.abs(event.clientX - drag.current.start) < 5
              )
                setUnzipped((value) => !value);
              drag.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("dna-drag", {
                    detail: event.key === "ArrowLeft" ? -14 : 14,
                  }),
                );
              }
            }}
            onClick={(event) => {
              if (event.detail === 0) setUnzipped((value) => !value);
            }}
          />
          <button
            className="dna-control"
            onClick={() => setUnzipped(!unzipped)}
            aria-pressed={unzipped}
            aria-label={unzipped ? "Join DNA strands" : "Unzip DNA strands"}
          >
            <Dna size={16} />
            <span>{unzipped ? "Join strands" : "Unzip DNA"}</span>
          </button>
          <div className="hero-bottom">
            <a
              href="#research"
              className="scroll-link"
              aria-label="Explore research"
            >
              <ArrowDown size={19} strokeWidth={1.1} />
            </a>
            <span className="micro">Berkeley, California</span>
            <div className="art-controls">
              <button
                onClick={() => setLagoon(!lagoon)}
                className="palette-button"
                aria-pressed={lagoon}
                aria-label="Toggle lagoon atmosphere"
              >
                <i />
                <i />
                <i />
              </button>
              <button
                onClick={() => setPaused(!paused)}
                aria-label={
                  paused ? "Play ambient motion" : "Pause ambient motion"
                }
                aria-pressed={paused}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          </div>
        </section>
        <AboutSection />
        <ResearchSection />
        <WorkSection onSelect={setProject} paused={paused} />
        <OffscreenSection paused={paused} />
      </main>
      <JourneyNavigation />
      <WaterRipples paused={paused} />
      <footer className="site-footer">
        <span>Rishit Pradhan</span>
        <a href="#" aria-label="Back to top">
          <ArrowUpRight size={21} strokeWidth={1.2} />
        </a>
        <span className="micro">Biology × Computation</span>
      </footer>
      <ProjectDialog
        index={project}
        onClose={() => setProject(null)}
        paused={paused}
      />
    </div>
  );
}
