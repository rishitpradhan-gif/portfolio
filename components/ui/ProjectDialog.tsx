"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { projects } from "@/data/projects";
import WorldEnginePreview from "@/components/projects/WorldEnginePreview";
import WearablePreview from "@/components/projects/WearablePreview";
import PatternLab from "@/components/projects/PatternLab";
export default function ProjectDialog({
  index,
  onClose,
  paused,
}: {
  index: number | null;
  onClose: () => void;
  paused: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (index === null || !dialog) return;
    const trigger = document.activeElement as HTMLElement;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [index]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="project-title"
    >
      {index !== null && (
        <>
          <div className="concrete-dialog-art">
            {projects[index].slug === "morphogenesis" ? (
              <PatternLab paused={paused} />
            ) : projects[index].slug === "dreamit" ? (
              <WorldEnginePreview />
            ) : (
              <WearablePreview paused={paused} />
            )}
            <button
              className="dialog-close"
              autoFocus
              onClick={onClose}
              aria-label="Close project"
            >
              <X size={22} />
            </button>
          </div>
          <div className="dialog-copy">
            <span className="micro">Interactive concept preview</span>
            <h2 id="project-title">{projects[index].name}</h2>
            <p>{projects[index].detail}</p>
            <Link
              className="dialog-project-link"
              href={`/projects/${projects[index].slug}`}
            >
              Full project notes
              <ArrowUpRight size={14} />
            </Link>
            <button className="back-link" onClick={onClose}>
              Back <ArrowUpRight size={15} />
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
