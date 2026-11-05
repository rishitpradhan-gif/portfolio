"use client";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { research, linkedInUrl } from "@/data/research";
import { useState } from "react";
export default function ResearchSection() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <section id="research" className="research-section content-section">
      <div className="section-topline">
        <h2>Research</h2>
        <a href={linkedInUrl} target="_blank" rel="noreferrer">
          LinkedIn <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="research-list" data-reveal>
        {research.map((item, index) => (
          <article
            className={`research-entry ${selected === item.id ? "is-expanded" : ""}`}
            key={item.id}
          >
            <button
              className="research-summary"
              aria-expanded={selected === item.id}
              aria-controls={`research-${item.id}`}
              onClick={() => setSelected(selected === item.id ? null : item.id)}
            >
              <span className="research-no micro">0{index + 1}</span>
              <span
                className={`research-emblem emblem-${item.id}`}
                aria-hidden="true"
              >
                {item.id === "ucsf" ? (
                  <svg viewBox="0 0 60 60">
                    <path d="M15 32q7-24 15-9t15-3M17 45q8-22 15-11t11-7" />
                    <circle cx="15" cy="32" r="4" />
                    <circle cx="30" cy="23" r="4" />
                    <circle cx="45" cy="20" r="4" />
                  </svg>
                ) : item.id === "cdph" ? (
                  <svg viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="18" />
                    <path d="M30 18v24M18 30h24" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 60 60">
                    <path d="M18 10c30 7-6 33 24 40M42 10c-30 7 6 33-24 40M20 16h20M22 25h16M22 35h16M20 44h20" />
                  </svg>
                )}
              </span>
              <span className="research-title">
                <strong>{item.institution}</strong>
                <span>{item.field}</span>
              </span>
              <span className="research-note micro">{item.note}</span>
              {selected === item.id ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <div
              id={`research-${item.id}`}
              className={`research-detail ${item.image ? "has-research-image" : ""}`}
              hidden={selected !== item.id}
            >
              <div className="research-detail-copy">
                <span className="research-full-name">{item.fullName}</span>
                <p>{item.description}</p>
                <p>{item.context}</p>
                <ul className="research-focus">
                  {item.focus.map((focus) => (
                    <li key={focus}>{focus}</li>
                  ))}
                </ul>
                <div className="research-links">
                  {item.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              </div>
              {item.image && (
                <figure className="research-photo">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    width="768"
                    height="472"
                    loading="lazy"
                  />
                  <figcaption>{item.imageCredit}</figcaption>
                </figure>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
