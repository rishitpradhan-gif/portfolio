"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectMedia from "@/components/projects/ProjectMedia";
export default function WorkSection({
  onSelect,
  paused,
}: {
  onSelect: (index: number) => void;
  paused: boolean;
}) {
  return (
    <section id="work" className="work-section real-projects">
      <div className="section-topline">
        <h2>Projects</h2>
        <span className="micro">Space, signals & scientific software</span>
      </div>
      <div className="real-project-list">
        {projects.map((project, index) => (
          <article
            className={`real-project real-project-${project.slug}`}
            key={project.slug}
            data-reveal
          >
            <span className="project-ghost-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div className="real-project-visual">
              <ProjectMedia project={project} paused={paused} />
            </div>
            <div className="real-project-copy">
              <span className="micro">
                0{index + 1} / {project.category}
              </span>
              <h3>{project.name}</h3>
              <p className="project-tagline">{project.summary}</p>
              <p>{project.detail}</p>
              <ul className="project-focus-list">
                {project.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="project-actions">
                <Link
                  className="project-case-link"
                  href={`/projects/${project.slug}`}
                >
                  View project
                  <ArrowRight size={15} />
                </Link>
                <button onClick={() => onSelect(index)}>
                  {project.liveUrl ? "Project overview" : "Quick preview"}
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="project-external-links">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                    <ArrowUpRight size={11} />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="supporting-work" aria-label="More open-source projects">
        <span className="micro">More open-source work</span>
        <div className="supporting-work-grid">
          <a href="https://github.com/rishitpradhan-gif/sift" target="_blank" rel="noreferrer"><span>Data quality</span><h3>Sift <ArrowUpRight size={18}/></h3><p>CSV profiling, schema drift, and a streaming API.</p></a>
          <a href="https://github.com/rishitpradhan-gif/trellis" target="_blank" rel="noreferrer"><span>Dependency graphs</span><h3>Trellis <ArrowUpRight size={18}/></h3><p>Critical paths, cycle witnesses, and delay impact.</p></a>
          <a href="https://github.com/rishitpradhan-gif/canopy" target="_blank" rel="noreferrer"><span>Wearable-network research</span><h3>Canopy <ArrowUpRight size={18}/></h3><p>Replayable findings and adversarial synthetic evaluations.</p></a>
        </div>
      </div>
    </section>
  );
}
