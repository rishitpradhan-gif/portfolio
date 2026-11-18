export type ExperimentKind =
  "cells" | "quantum" | "spatial" | "pulse" | "pattern";
export type Project = {
  liveUrl?: string;
  status?: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  detail: string;
  tech: string;
  color: string;
  kind: ExperimentKind;
  example: boolean;
  image: string;
  imageAlt: string;
  imageCaption: string;
  focus: string[];
  story: { title: string; text: string }[];
  links: { label: string; url: string }[];
};
export const projects: Project[] = [
{
  "slug": "parallax",
  "name": "Parallax",
  "category": "Spacecraft perspectives",
  "summary": "Earth, from the spacecraft’s point of view.",
  "detail": "Choose a real satellite, move to its calculated position, and look across Earth’s horizon. Parallax combines orbital mechanics, WebGL rendering, and dated NASA imagery in a working browser experience.",
  "tech": "SGP4 · Three.js · NASA imagery · Capacitor",
  "color": "#90cfff",
  "kind": "spatial",
  "example": false,
  "image": "/images/parallax-earth.webp",
  "imageAlt": "Parallax application screenshot · simulated ISS perspective with dated NASA Terra imagery",
  "imageCaption": "Parallax application screenshot · simulated ISS perspective with dated NASA Terra imagery",
  "focus": [
    "Real CelesTrak orbital elements",
    "First-person spacecraft camera",
    "Dated NASA imagery and pass planning"
  ],
  "story": [
    {
      "title": "What you can do",
      "text": "Open the app, choose a spacecraft, and look around from its propagated position. Switch between the orbital overview and a first-person horizon, inspect dated satellite imagery, or calculate when a satellite passes a chosen location."
    },
    {
      "title": "What I built",
      "text": "The shared JavaScript engine propagates CelesTrak orbital elements with SGP4. A Three.js renderer places the camera at the spacecraft’s Earth-fixed position, constructs the local horizon, and shades the Earth with its solar illumination. The pass planner exports results with source epochs and settings."
    },
    {
      "title": "Checking the geometry",
      "text": "The test suite includes five published Vallado SGP4 verification vectors, camera-position checks, tangent-horizon geometry, freshness rules, and export validation. Twenty-five core and adapter tests passed during the iPhone preparation. This does not establish sensor fidelity or current weather coverage."
    },
    {
      "title": "The iPhone version",
      "text": "A bundled Capacitor Xcode project adds saved views, offline Earth assets, and native sharing. Source and instructions are downloadable. Native compilation, simulator/device testing, and signing are pending; browser reload restoration testing also remains incomplete."
    },
    {
      "title": "What the picture means",
      "text": "The first-person Earth is rendered, not a live onboard camera feed. NASA photographs and composites are separately dated and attributed. Orbital estimates older than seven days are excluded for the requested time."
    }
  ],
  "links": [
    {
      "label": "Open Parallax",
      "url": "https://rp-parallax.vercel.app"
    },
    {
      "label": "Source & methods",
      "url": "https://github.com/rishitpradhan-gif/parallax"
    },
    {
      "label": "iPhone source",
      "url": "https://rp-parallax.vercel.app/ios.html"
    }
  ],
  "liveUrl": "https://rp-parallax.vercel.app",
  "status": "Working web application · iPhone source prepared"
},
{
  "slug": "axon",
  "name": "Axon",
  "category": "Neural signal analysis",
  "summary": "Open a recording. See the signal. Check the spectrum.",
  "detail": "A browser-local EEG workbench for inspecting calibrated recordings, comparing time windows, and exporting the numerical analysis with its settings. The focus is on what the computation actually did.",
  "tech": "EDF · FFT · Welch PSD · Browser-local processing",
  "color": "#e3bfa3",
  "kind": "pulse",
  "example": false,
  "image": "/images/axon-workbench.webp",
  "imageAlt": "Axon application screenshot · seeded synthetic demo, not a measured EEG",
  "imageCaption": "Axon application screenshot · seeded synthetic demo, not a measured EEG",
  "focus": [
    "Calibrated EDF and CSV import",
    "Welch power spectral density",
    "Executed SciPy numerical comparisons"
  ],
  "story": [
    {
      "title": "A recording you can inspect",
      "text": "Load supported EDF or CSV data, choose a channel and time window, and inspect its trace, spectrum, band-power calculations, and quality flags. Processing stays in browser memory; recordings are not uploaded."
    },
    {
      "title": "A numerical engine with explicit conventions",
      "text": "The standalone JavaScript engine implements a radix-2 FFT and Welch PSD with periodic Hann windows, mean removal, 50% overlap and density normalization. Results retain their actual frequency resolution, segment counts, and units."
    },
    {
      "title": "How it was checked",
      "text": "Tests compare the FFT with an independent direct DFT and check analytical signal power, missing segments, calibration and band boundaries. A separate executed comparison against SciPy covers twelve deterministic signals. These are numerical checks, not clinical or experimental validation."
    },
    {
      "title": "Limits",
      "text": "The demonstration is synthetic. Axon does not diagnose conditions, classify mental states, repair artifacts, connect to devices, or infer clinical meaning from band power. Supported EDF formats and rejection rules are documented in the source."
    }
  ],
  "links": [
    {
      "label": "Open Axon",
      "url": "https://rp-axon.vercel.app"
    },
    {
      "label": "Source & methods",
      "url": "https://github.com/rishitpradhan-gif/axon"
    }
  ],
  "liveUrl": "https://rp-axon.vercel.app",
  "status": "Working web application"
},
{
  "slug": "titer",
  "name": "Titer",
  "category": "Biochemistry & scientific software",
  "summary": "Compare assay endpoints without losing the experiment.",
  "detail": "Normalize concentration units while preserving censored bounds and experimental context. Titer makes incompatible comparisons visible before reporting a reference-relative endpoint ratio.",
  "tech": "Unit normalization · Context checks · Keyed local API",
  "color": "#d9cb8b",
  "kind": "pulse",
  "example": false,
  "image": "/images/titer-workbench.webp",
  "imageAlt": "Titer application screenshot · example assay records",
  "imageCaption": "Titer application screenshot · example assay records",
  "focus": [
    "Concentration-unit normalization",
    "Experimental-context compatibility checks",
    "Downloadable API with expiring keys"
  ],
  "story": [
    {
      "title": "The problem",
      "text": "Assay endpoints are easy to place side by side even when units, targets, assay conditions or censoring differ. Titer keeps those details attached to each record and checks declared context before calculating concentration ratios."
    },
    {
      "title": "Use the workbench",
      "text": "Open the example or import records in the browser. Select a reference and inspect normalized units, censored bounds, compatibility warnings and the calculated ratios. A ratio is a descriptive comparison, not a significance test or proof of biological equivalence."
    },
    {
      "title": "An API you can run yourself",
      "text": "The downloadable Node service exposes the same analysis behind locally issued, expiring API keys. Tokens use 256 random bits; only their hashes are stored. The public website does not issue credentials or host the private assay API."
    },
    {
      "title": "Scope",
      "text": "The tool relies on the metadata supplied by the user. It does not verify laboratory provenance, infer missing experimental conditions, fit dose-response curves, or establish clinical conclusions."
    }
  ],
  "links": [
    {
      "label": "Open Titer",
      "url": "https://rp-titer.vercel.app"
    },
    {
      "label": "Source & methods",
      "url": "https://github.com/rishitpradhan-gif/titer"
    }
  ],
  "liveUrl": "https://rp-titer.vercel.app",
  "status": "Working web application"
},
  {
    slug: "dreamit",
    name: "DreamIT",
    category: "3D world engines",
    summary: "From a world in your head to a world you can play together.",
    detail:
      "I’m building 3D world engines for multiplayer games—tools for turning environments into shared, playable experiences. My focus is the connection between creating a world, shaping how it behaves, and making it somewhere people can explore together.",
    tech: "World creation · Game engines · Multiplayer",
    color: "#c6ee67",
    kind: "spatial",
    example: false,
    image: "/images/dreamit-world-concept.webp",
    imageAlt:
      "Original DreamIT concept art: a floating garden world with glass bridges, green islands, waterfalls, and small player characters.",
    imageCaption: "Original concept artwork · not a product screenshot",
    focus: [
      "3D world creation",
      "Shared multiplayer spaces",
      "Playable interactions",
    ],
    story: [
      {
        title: "The idea",
        text: "A game world is more than a collection of objects. It is a place with rules, movement, interaction, and other people. DreamIT is about building the engine that brings those pieces together, so creating an environment can become creating a shared experience.",
      },
      {
        title: "What I’m working toward",
        text: "The focus is a world-building workflow that connects spatial design with multiplayer play. That means thinking about how creators shape a world and how players inhabit it together, rather than treating creation and play as completely separate activities.",
      },
      {
        title: "Explore the concept",
        text: "The interactive scene below is a small illustration of that direction. Move your character around the island, add demo players, plant a garden in Build mode, and switch the terrain. It is a portfolio concept preview, not the production DreamIT engine.",
      },
    ],
    links: [
      {
        label: "Sandbox source",
        url: "https://github.com/rishitpradhan-gif/world-garden",
      },
      {
        label: "My LinkedIn",
        url: "https://www.linkedin.com/in/rishit-pradhan-a49773352",
      },
    ],
  },
  {
    slug: "drip",
    name: "Drip",
    category: "Live wearable insights",
    summary: "A clearer picture of your body, as the data comes in.",
    detail:
      "Drip turns live wearable data into insights that are easier to understand and explore. I’m working on the layer between a continuous stream of body signals and a useful interface: showing what is changing, revealing patterns over time, and giving the data enough context to make sense.",
    tech: "Wearable signals · Real-time data · Insight interfaces",
    color: "#ef9b80",
    kind: "pulse",
    example: false,
    image: "/images/drip-demo-dashboard.webp",
    imageAlt:
      "The existing Drip prototype dashboard, with a stress-index chart, time-range controls, pattern insights, and trend analysis.",
    imageCaption: "Existing Drip prototype · illustrative dashboard data",
    focus: [
      "Continuous wearable streams",
      "Patterns over time",
      "Understandable insights",
    ],
    story: [
      {
        title: "The problem",
        text: "Wearables can produce a constant stream of measurements, but more measurements do not automatically create more understanding. A useful experience needs to connect the immediate signal with a longer view of how that signal is changing.",
      },
      {
        title: "What I’m building",
        text: "Drip focuses on live wearable-data insights: clear visualizations, patterns across time, and interfaces that help people explore their own signals. The existing prototype brings those ideas into a dashboard with time-range controls, charts, and insight panels.",
      },
      {
        title: "Try the interaction",
        text: "The preview below uses simulated activity and heart-rate data to demonstrate the interaction. Move the activity slider and see how the signal and interface respond. It is a design demonstration, not a connection to your device or a medical assessment.",
      },
    ],
    links: [
      {
        label: "Open Drip demo",
        url: "https://drip-demo-dashboard.vercel.app/",
      },
      {
        label: "Drip on LinkedIn",
        url: "https://www.linkedin.com/company/drip-tech/",
      },
      {
        label: "Signal demo source",
        url: "https://github.com/rishitpradhan-gif/wearable-signal-lab",
      },
    ],
  },
  {
    slug: "morphogenesis",
    name: "Morphogenesis",
    category: "Interactive pattern lab",
    summary: "Paint a seed. Let a world grow.",
    detail:
      "A small creative coding experiment I built for this portfolio: two simulated chemicals react and diffuse across a canvas, growing organic spots, stripes, and coral-like structures. Paint directly into the system, tune its chemistry, and save a pattern that only exists because you made it.",
    tech: "Reaction–diffusion · Canvas · Creative coding",
    color: "#d2ed73",
    kind: "pattern",
    example: true,
    image: "/images/morphogenesis.png",
    imageAlt:
      "Emerald and citron organic patterns produced by the interactive Morphogenesis simulation.",
    imageCaption: "Actual output from the live pattern lab",
    focus: [
      "Live reaction–diffusion simulation",
      "Paintable chemical seeds",
      "Adjustable chemistry & PNG export",
    ],
    story: [
      {
        title: "Small rules. Unexpected worlds.",
        text: "Morphogenesis explores how a simple local rule can produce a complex visual pattern. The experiment uses a Gray–Scott reaction–diffusion model: one virtual chemical feeds a reaction, a second spreads through the field, and their changing concentrations become color.",
      },
      {
        title: "You are part of the system",
        text: "Drag across the canvas to add chemical seeds. Try Coral, Fingerprint, or Spots as a starting point, then change feed and decay to shift the pattern. The simulation is deliberately open-ended: a small change can produce a very different result. Add seeds provides a keyboard-accessible alternative to drawing.",
      },
      {
        title: "Take a little piece with you",
        text: "Pause when you find a pattern you like and export it as a PNG. Everything runs locally in your browser; there is no upload or account. This is a creative simulation built for the portfolio, not a biological prediction or an external research project.",
      },
    ],
    links: [
      {
        label: "Source code",
        url: "https://github.com/rishitpradhan-gif/morphogenesis-lab",
      },
    ],
  },
];
