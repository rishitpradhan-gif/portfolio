"use client";
import TennisGame from "@/components/play/TennisGame";
export default function OffscreenSection({ paused }: { paused: boolean }) {
  return (
    <section id="offscreen" className="offscreen-section content-section">
      <div className="section-topline">
        <h2>Off the clock</h2>
        <span className="micro">Stay for a game</span>
      </div>
      <div className="offscreen-layout" data-reveal>
        <TennisGame paused={paused} />
        <div className="other-interests personal-offscreen-copy">
          <span className="micro">Away from the desk</span>
          <h3>
            I’ll take
            <br />
            the next set.
          </h3>
          <p>
            Tennis is my favorite reason to close the laptop. Footwork, a little
            strategy, and the very unreasonable belief that the next shot will
            be the good one.
          </p>
          <p>
            Until we get on a real court, try this one. Three lives. One more
            rally.
          </p>
          <div className="court-rules">
            <span>
              <b>+1</b>Return the ball
            </span>
            <span>
              <b>+3</b>Beat the opponent
            </span>
            <span>
              <b>3</b>Chances to keep going
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
