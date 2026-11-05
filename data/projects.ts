export type ExperimentKind =
  "cells" | "quantum" | "spatial" | "pulse" | "pattern";
export type Project = {
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
    links: [],
  },
];
