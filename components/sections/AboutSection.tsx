import { ArrowUpRight } from "lucide-react";
import { linkedInUrl } from "@/data/research";

export default function AboutSection() {
  return (
    <section id="about" className="about-section content-section">
      <div className="section-topline">
        <h2>About me</h2>
        <span className="micro">Berkeley, California</span>
      </div>
      <div className="personal-about-layout" data-reveal>
        <h3>
          A scientist’s
          <br />
          <em>curiosity.</em>
          <br />A builder’s instinct.
        </h3>
        <div className="personal-about-copy">
          <p>
            I’m a chemical biology student at UC Berkeley, concentrating in
            computational chemistry. I’m interested in how living systems
            process information—from molecules and cells to the brain.
          </p>
          <p>
            I like turning that curiosity into things I can test. That means
            research across neuroscience, public health, and genome science,
            alongside building multiplayer worlds with DreamIT and live wearable
            insights with Drip.
          </p>
          <div className="personal-about-links">
            <a href="#research">
              My research
              <ArrowUpRight size={13} />
            </a>
            <a href="#work">
              What I’m building
              <ArrowUpRight size={13} />
            </a>
            <a
              href="https://github.com/rishitpradhan-gif"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ArrowUpRight size={13} />
            </a>
            <a href={linkedInUrl} target="_blank" rel="noreferrer">
              LinkedIn
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
