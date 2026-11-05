import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectMedia from "@/components/projects/ProjectMedia";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? {
        title: `${project.name} — Rishit Pradhan`,
        description: project.detail,
        openGraph: {
          title: `${project.name} — Rishit Pradhan`,
          description: project.summary,
          images: [project.image],
        },
      }
    : { title: "Project not found" };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next =
    projects[
      (projects.findIndex((item) => item.slug === slug) + 1) % projects.length
    ];
  return (
    <div className={`project-case-shell case-${slug}`}>
      <header className="case-header">
        <Link href="/" className="monogram" aria-label="Rishit Pradhan home">
          rp<span>•</span>
        </Link>
        <Link href="/#work">
          <ArrowLeft size={14} />
          All projects
        </Link>
      </header>
      <main className="case-main">
        <div className="case-intro">
          <span className="micro">Rishit Pradhan / {project.category}</span>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          <div className="case-external-links">
            {project.links.map((link) => (
              <a
                href={link.url}
                key={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
        <ProjectMedia project={project} />
        <div className="case-body">
          <aside>
            <span className="micro">Focus</span>
            <ul>
              {project.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="micro case-note">
              {project.example
                ? "Built for this portfolio · Interactive experiment"
                : "Project notes · In development"}
            </span>
          </aside>
          <div className="case-story">
            {project.story.map((section, index) => (
              <section key={section.title}>
                <span className="micro">0{index + 1}</span>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            ))}
          </div>
        </div>
        <Link className="case-next" href={`/projects/${next.slug}`}>
          <span>
            <small className="micro">Next project</small>
            {next.name}
          </span>
          <ArrowRight size={32} strokeWidth={1} />
        </Link>
      </main>
      <footer className="case-footer">
        <span>Rishit Pradhan</span>
        <Link href="/">
          Back to the surface
          <ArrowUpRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
