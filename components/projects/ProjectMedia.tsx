"use client";
import { useId, useState } from "react";
import { Image as ImageIcon, Play, Film } from "lucide-react";
import type { Project } from "@/data/projects";
import WorldEnginePreview from "./WorldEnginePreview";
import WearablePreview from "./WearablePreview";
import PatternLab from "./PatternLab";
import DripRecording from "./DripRecording";
export default function ProjectMedia({
  project,
  paused = false,
}: {
  project: Project;
  paused?: boolean;
}) {
  const [mode, setMode] = useState<"image" | "play">(
    project.slug === "morphogenesis" ? "play" : "image",
  );
  const id = useId();
  return (
    <div className={`project-media media-${project.slug}`}>
      <div
        className="project-media-panel"
        id={`${id}-panel`}
        role="tabpanel"
        aria-label={`${project.name} ${mode === "image" ? (project.slug === "drip" ? "recording" : "image") : "interactive preview"}`}
      >
        {mode === "image" ? (
          project.slug === "drip" ? (
            <DripRecording paused={paused} />
          ) : (
            <figure className="project-photo">
              <img
                src={project.image}
                alt={project.imageAlt}
                width="1440"
                height={project.slug === "dreamit" ? 960 : 1000}
                loading="lazy"
              />
              <figcaption>{project.imageCaption}</figcaption>
            </figure>
          )
        ) : project.slug === "morphogenesis" ? (
          <PatternLab paused={paused} />
        ) : project.slug === "dreamit" ? (
          <WorldEnginePreview />
        ) : (
          <WearablePreview paused={paused} />
        )}
      </div>
      <div
        className="project-media-switch"
        role="tablist"
        aria-label={`${project.name} presentation`}
      >
        <button
          role="tab"
          aria-selected={mode === "image"}
          aria-controls={`${id}-panel`}
          onClick={() => setMode("image")}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              setMode("play");
              (
                event.currentTarget.nextElementSibling as HTMLButtonElement
              )?.focus();
            }
          }}
        >
          {project.slug === "drip" ? (
            <Film size={12} />
          ) : (
            <ImageIcon size={12} />
          )}
          {project.slug === "drip" ? "Film" : "Image"}
        </button>
        <button
          role="tab"
          aria-selected={mode === "play"}
          aria-controls={`${id}-panel`}
          onClick={() => setMode("play")}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              setMode("image");
              (
                event.currentTarget.previousElementSibling as HTMLButtonElement
              )?.focus();
            }
          }}
        >
          <Play size={11} />
          Try {project.name} preview
        </button>
      </div>
    </div>
  );
}
