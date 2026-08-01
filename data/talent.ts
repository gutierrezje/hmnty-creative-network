export type Aspect = "16:9" | "9:16";

export type Work = {
  title: string;
  /** Vimeo / YouTube / IG / TikTok link. Embeds only — we never host video. */
  url: string;
  aspect: Aspect;
  /** Optional still. Without one the card renders a graded placeholder frame. */
  poster?: string;
};

export type Creative = {
  id: string;
  name: string;
  roles: string[];
  city: string;
  /** "NOW", or a short month tag like "AUG". Shown on the card in monospace. */
  availability: string;
  rate?: string;
  /** One credit line. One. The work is meant to do the talking. */
  credit?: string;
  works: Work[];
  /**
   * Seed data written before real reels came in. Every one of these must be
   * replaced by a real local creative who gave permission — a wall of invented
   * people is a mockup, a wall of real ones is the business.
   */
  placeholder?: boolean;
};

export const ROLES = [
  "DP",
  "GAFFER",
  "1ST AC",
  "COLORIST",
  "EDITOR",
  "SOUND",
  "MOTION",
  "UGC",
] as const;

export const TALENT: Creative[] = [
  {
    id: "c01",
    name: "Placeholder — Gaffer",
    roles: ["GAFFER"],
    city: "SD",
    availability: "AUG",
    rate: "$450/day",
    credit: "Two seasons of local commercial work",
    works: [{ title: "Night exterior test", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c02",
    name: "Placeholder — Colorist",
    roles: ["COLORIST"],
    city: "SD",
    availability: "NOW",
    rate: "$60/hr",
    works: [{ title: "Short film grade", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c03",
    name: "Placeholder — UGC",
    roles: ["UGC"],
    city: "SD",
    availability: "NOW",
    rate: "$300/spot",
    works: [{ title: "Brand spot, vertical", url: "#", aspect: "9:16" }],
    placeholder: true,
  },
  {
    id: "c04",
    name: "Placeholder — 1st AC",
    roles: ["1ST AC"],
    city: "SD",
    availability: "AUG",
    works: [{ title: "Handheld doc reel", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c05",
    name: "Placeholder — Editor",
    roles: ["EDITOR"],
    city: "SD",
    availability: "NOW",
    rate: "$50/hr",
    credit: "Nonprofit campaign, 2025",
    works: [{ title: "Documentary sequence", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c06",
    name: "Placeholder — Sound",
    roles: ["SOUND"],
    city: "SD",
    availability: "SEP",
    works: [{ title: "Location mix, interview", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c07",
    name: "Placeholder — DP",
    roles: ["DP"],
    city: "SD",
    availability: "NOW",
    rate: "$700/day",
    works: [{ title: "Spec commercial", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c08",
    name: "Placeholder — Short form",
    roles: ["UGC", "EDITOR"],
    city: "SD",
    availability: "NOW",
    works: [{ title: "Series intro, vertical", url: "#", aspect: "9:16" }],
    placeholder: true,
  },
  {
    id: "c09",
    name: "Placeholder — Motion",
    roles: ["MOTION"],
    city: "SD",
    availability: "AUG",
    rate: "$55/hr",
    works: [{ title: "Title sequence", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c10",
    name: "Placeholder — Gaffer / DP",
    roles: ["GAFFER", "DP"],
    city: "SD",
    availability: "NOW",
    works: [{ title: "Interview setup", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c11",
    name: "Placeholder — UGC",
    roles: ["UGC"],
    city: "SD",
    availability: "NOW",
    works: [{ title: "Product, handheld", url: "#", aspect: "9:16" }],
    placeholder: true,
  },
  {
    id: "c12",
    name: "Placeholder — Editor",
    roles: ["EDITOR", "MOTION"],
    city: "SD",
    availability: "AUG",
    works: [{ title: "Sizzle cut", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
];
