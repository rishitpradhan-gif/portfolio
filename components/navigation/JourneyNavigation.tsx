"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const chapters = [
  { id: "home", label: "Surface", number: "00" },
  { id: "about", label: "About me", number: "01" },
  { id: "research", label: "Research", number: "02" },
  { id: "work", label: "Projects", number: "03" },
  { id: "offscreen", label: "Off the clock", number: "04" },
];

export default function JourneyNavigation() {
  const [active, setActive] = useState("home");
  const current = useRef("home");
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame = 0;
    let offsets: { id: string; top: number }[] = [];
    const measure = () => {
      offsets = chapters.map((chapter) => ({
        id: chapter.id,
        top:
          (document.getElementById(chapter.id)?.getBoundingClientRect().top ??
            0) + scrollY,
      }));
    };
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight,
      );
      const section =
        [...offsets]
          .reverse()
          .find((chapter) => chapter.top <= y + innerHeight * 0.36)?.id ??
        "home";
      document.documentElement.style.setProperty(
        "--journey-progress",
        String(Math.min(1, y / max)),
      );
      document.documentElement.style.setProperty(
        "--hero-exit",
        String(Math.min(1, y / (innerHeight * 0.85))),
      );
      document.documentElement.dataset.chapter = section;
      if (current.current !== section) {
        current.current = section;
        setActive(section);
        window.dispatchEvent(new Event("journey-chapter"));
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      measure();
      scroll();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-enter");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((node) => revealObserver.observe(node));
    measure();
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    document.fonts.ready.then(resize);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);
  return (
    <nav className="journey-navigation" aria-label="Page chapters">
      <span className="journey-active-label" aria-hidden="true">
        <i />
        {chapters.find((chapter) => chapter.id === active)?.label}
      </span>
      <div className="journey-markers">
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className={active === chapter.id ? "chapter-active" : ""}
            aria-label={`${chapter.number} ${chapter.label}`}
            aria-current={active === chapter.id ? "location" : undefined}
          >
            <span />
            <small>{chapter.label}</small>
          </a>
        ))}
      </div>
      <span className="journey-index" aria-hidden="true">
        {chapters.find((chapter) => chapter.id === active)?.number} / 04
      </span>
    </nav>
  );
}
