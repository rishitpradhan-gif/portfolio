export const linkedInUrl =
  "https://www.linkedin.com/in/rishit-pradhan-a49773352";
export type ResearchEntry = {
  id: string;
  institution: string;
  fullName: string;
  field: string;
  description: string;
  context: string;
  note: string;
  focus: string[];
  links: { label: string; url: string }[];
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
};
export const research: ResearchEntry[] = [
  {
    id: "ucsf",
    institution: "UCSF",
    fullName: "University of California, San Francisco",
    field: "Neurosurgery & brain-tumor research",
    description:
      "My research at UCSF sits at the intersection of neuroscience and brain-tumor biology, with an interest in glial tumors and the living systems around them.",
    context:
      "This is where my chemical-biology background meets questions about the brain: connecting a molecular view of life with a complex neural environment.",
    note: "Neuroscience",
    focus: ["Glial tumor biology", "Neuroscience", "Chemical biology"],
    links: [
      { label: "UCSF Neurosurgery", url: "https://neurosurgery.ucsf.edu/" },
    ],
  },
  {
    id: "cdph",
    institution: "CDPH",
    fullName: "California Department of Public Health",
    field: "Public health research",
    description:
      "My research experience at CDPH connects an interest in biology with the wider context of public health—where scientific questions matter beyond the laboratory.",
    context:
      "It is part of a broader interest in how biological evidence becomes useful: moving between the scale of living systems and the people and communities they affect.",
    note: "Public health",
    focus: ["Biological research", "Public health", "Scientific evidence"],
    links: [
      {
        label: "California Department of Public Health",
        url: "https://www.cdph.ca.gov/",
      },
    ],
  },
  {
    id: "jgi",
    institution: "LBNL / JGI",
    fullName: "Lawrence Berkeley National Laboratory · Joint Genome Institute",
    field: "Genome science",
    description:
      "In summer 2024, I joined JGI through Berkeley’s CalTeach program, working with mentors Sajeet Haridas and Igor Grigoriev.",
    context:
      "The internship placed me in a collaborative genome-science environment, alongside researchers and fellow interns developing and presenting their summer work. The CalTeach poster session brought that experience into a shared scientific conversation.",
    note: "2024 · CalTeach",
    focus: ["Genome science", "CalTeach internship", "Research communication"],
    links: [
      {
        label: "2024 JGI internship story",
        url: "https://jgi.doe.gov/user-science/science-stories/exploring-and-thinking-critically-about-scientific-problems-jgi",
      },
      { label: "Joint Genome Institute", url: "https://jgi.doe.gov/" },
    ],
    image: "/images/jgi-calteach-2024.webp",
    imageAlt:
      "Rishit Pradhan with fellow interns and a mentor at the 2024 CalTeach poster session.",
    imageCredit:
      "2024 CalTeach poster session · Photo courtesy of Sajeet Haridas / JGI",
  },
];
