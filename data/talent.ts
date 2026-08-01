export type Aspect = "16:9" | "9:16";

export type Work = {
  title: string;
  /** Vimeo / YouTube / IG / TikTok link. Embeds only — we never host video. */
  url: string;
  aspect: Aspect;
  /** Optional still. Without one the card renders a graded placeholder frame. */
  poster?: string;
};

/** A prompt answer. Tier B — shown in the detail panel, never on a card,
 *  never filterable. The moment personality is a browsing dimension the bias
 *  the wall exists to remove comes straight back in. */
export type PromptAnswer = { prompt: string; answer: string };

/** A single consent grant. Granular and dated, so its scope is legible and
 *  auditable. One blanket yes is not consent. */
export type ConsentGrant = { granted: boolean; at: string; statement: string };

/**
 * The three independent consent grants. Agreeing to appear on the wall is not
 * agreeing to be introduced — each grant stands alone.
 *
 * - appearOnWall — may this creative's work, roles, city, and availability
 *   appear on the public wall. This is the gate for wall rendering.
 * - showToEmployer — may HMNTY reveal this creative (name, prompts, rate) to a
 *   specific employer while assembling a shortlist for one brief.
 * - mayIntroduce — may HMNTY hand this creative's contact to an employer. The
 *   highest grant; an introduction cannot fire without it, separate from the
 *   employer accepting.
 */
export type Consent = {
  appearOnWall: ConsentGrant;
  showToEmployer: ConsentGrant;
  mayIntroduce: ConsentGrant;
};

/**
 * The creative's own attestation, signed at intake. Rendered as call-sheet
 * facts in the detail panel — not a verification badge.
 */
export type Attestation = {
  /** "this is my own work, made by me," affirmed. */
  ownWork: boolean;
  /** What they actually did on the piece — shot it, cut it, graded it.
   *  "my own work" means something specific per role. Required at intake. */
  roleOnProject: string;
  /** Optional link to where it ran, the credits, or a behind-the-scenes ref. */
  sourceLink?: string;
  /** The date it was signed. */
  at: string;
};

/**
 * A named curator's authenticity call, recorded while assembling a shortlist.
 * Private — the curator reads the work, attestation, and source notes and
 * records why they stand behind it. Accountable, not an "admin," not an
 * "algorithm."
 */
export type Verification = {
  verifiedBy: string;
  decision: "confirmed" | "needs-follow-up";
  note: string;
  at: string;
};

export type Creative = {
  id: string;
  /** Tier B — appears in the detail panel and nowhere else. Never on the wall. */
  name: string;
  roles: string[];
  city: string;
  /** "NOW", or a short month tag like "AUG". Shown on the card in monospace. */
  availability: string;
  /** Tier B — an employer eventually needs it, but it is also the field most
   *  likely to bias a first read, so it is reveal-only, never on the wall. */
  rate?: string;
  /** One credit line. One. The work is meant to do the talking. */
  credit?: string;
  works: Work[];
  /** Tier B — up to three. A mono label, an Inter answer. */
  prompts?: PromptAnswer[];
  /** Tier C — email or phone. Required to make an introduction, published to
   *  no one. */
  contact?: string;
  /** Tier C — the granular consent record. */
  consent?: Consent;
  /** Tier B facts / signed at intake. The human-behind-the-work evidence. */
  attestation?: Attestation;
  /** Tier C — the named curator's authenticity call. */
  curatorVerification?: Verification | null;
  /**
   * Tier C, curator-only. AI may attach a private flag for the curator to
   * review. It never removes a card, never blocks intake, never touches
   * consent, and is never shown to the creative, an employer, or the wall.
   * The human decides; the flag is an input, never a verdict.
   */
  aiFlag?: { flagged: boolean; reason: string } | null;
  /** How this creative came in. Provenance, so the curator knows the path. */
  source?: "self" | "referral";
  /**
   * The wall gate. A record only renders on the wall when this is "confirmed"
   * AND consent.appearOnWall.granted is true. A record with no consentState
   * (or "pending") fails closed — it does not show. A referred person stays
   * "pending" until they confirm and consent themselves.
   */
  consentState?: "pending" | "confirmed";
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
    name: "Placeholder: Gaffer",
    roles: ["GAFFER"],
    city: "SD",
    availability: "AUG",
    rate: "$450/day",
    credit: "Two seasons of local commercial work",
    works: [{ title: "Night exterior test", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    // Still a placeholder — no real person here — but carries an example
    // confirmed consent + attestation so the wall and detail panel can be
    // demonstrated end to end before real, consenting creatives replace it.
    id: "c02",
    name: "Placeholder: Colorist",
    roles: ["COLORIST"],
    city: "SD",
    availability: "NOW",
    rate: "$60/hr",
    works: [{ title: "Short film grade", url: "#", aspect: "16:9" }],
    source: "self",
    consentState: "confirmed",
    consent: {
      appearOnWall: {
        granted: true,
        at: "2026-08-01",
        statement: "my work, roles, city, and availability may appear on the wall.",
      },
      showToEmployer: {
        granted: true,
        at: "2026-08-01",
        statement: "hmnty may show my name, prompts, and rate to an employer while building a shortlist.",
      },
      mayIntroduce: {
        granted: false,
        at: "2026-08-01",
        statement: "not yet, ask me before handing an employer my contact.",
      },
    },
    attestation: {
      ownWork: true,
      roleOnProject: "graded the short",
      at: "2026-08-01",
    },
    curatorVerification: null,
    contact: "placeholder-colorist@example.com",
    prompts: [
      {
        prompt: "the shot you are proudest of",
        answer: "a night interior where the practicals were the only light and it still held skin tone.",
      },
      {
        prompt: "how you like to work",
        answer: "quiet room, one pass with the director, then alone.",
      },
    ],
    placeholder: true,
  },
  {
    id: "c03",
    name: "Placeholder: UGC",
    roles: ["UGC"],
    city: "SD",
    availability: "NOW",
    rate: "$300/spot",
    works: [{ title: "Brand spot, vertical", url: "#", aspect: "9:16" }],
    placeholder: true,
  },
  {
    id: "c04",
    name: "Placeholder: 1st AC",
    roles: ["1ST AC"],
    city: "SD",
    availability: "AUG",
    works: [{ title: "Handheld doc reel", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c05",
    name: "Placeholder: Editor",
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
    name: "Placeholder: Sound",
    roles: ["SOUND"],
    city: "SD",
    availability: "SEP",
    works: [{ title: "Location mix, interview", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    // Placeholder with an example confirmed consent + full attestation and a
    // curator verification, so the detail panel's authenticity facts render.
    id: "c07",
    name: "Placeholder: DP",
    roles: ["DP"],
    city: "SD",
    availability: "NOW",
    rate: "$700/day",
    works: [{ title: "Spec commercial", url: "#", aspect: "16:9" }],
    source: "referral",
    consentState: "confirmed",
    consent: {
      appearOnWall: {
        granted: true,
        at: "2026-08-01",
        statement: "my work, roles, city, and availability may appear on the wall.",
      },
      showToEmployer: {
        granted: true,
        at: "2026-08-01",
        statement: "hmnty may show my name, prompts, and rate to an employer while building a shortlist.",
      },
      mayIntroduce: {
        granted: true,
        at: "2026-08-01",
        statement: "hmnty may hand an employer my contact for a specific brief.",
      },
    },
    attestation: {
      ownWork: true,
      roleOnProject: "shot and operated",
      sourceLink: "https://example.com/spec-commercial-credits",
      at: "2026-08-01",
    },
    curatorVerification: {
      verifiedBy: "placeholder curator",
      decision: "confirmed",
      note: "watched the reel, read the credits, stand behind it.",
      at: "2026-08-01",
    },
    contact: "placeholder-dp@example.com",
    prompts: [
      {
        prompt: "the shot you are proudest of",
        answer: "a one-take dolly-in through a doorway on a spec spot, no marks, all feel.",
      },
    ],
    placeholder: true,
  },
  {
    id: "c08",
    name: "Placeholder: Short form",
    roles: ["UGC", "EDITOR"],
    city: "SD",
    availability: "NOW",
    works: [{ title: "Series intro, vertical", url: "#", aspect: "9:16" }],
    placeholder: true,
  },
  {
    id: "c09",
    name: "Placeholder: Motion",
    roles: ["MOTION"],
    city: "SD",
    availability: "AUG",
    rate: "$55/hr",
    works: [{ title: "Title sequence", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c10",
    name: "Placeholder: Gaffer / DP",
    roles: ["GAFFER", "DP"],
    city: "SD",
    availability: "NOW",
    works: [{ title: "Interview setup", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
  {
    id: "c11",
    name: "Placeholder: UGC",
    roles: ["UGC"],
    city: "SD",
    availability: "NOW",
    works: [{ title: "Product, handheld", url: "#", aspect: "9:16" }],
    placeholder: true,
  },
  {
    id: "c12",
    name: "Placeholder: Editor",
    roles: ["EDITOR", "MOTION"],
    city: "SD",
    availability: "AUG",
    works: [{ title: "Sizzle cut", url: "#", aspect: "16:9" }],
    placeholder: true,
  },
];

/**
 * A wall-safe view of a creative. Only the fields the wall and the detail
 * panel actually render — the tiers that are allowed to reach a browser.
 *
 * Tier C (contact, the consent record, curator verification, the AI flag) is
 * deliberately absent from this type, so it is a compile error to leak it to a
 * client component. name / rate / prompts / attestation are tier B: they reach
 * the browser but the wall renders none of them until a click.
 */
export type WallCreative = {
  id: string;
  /** Tier B is present only when showToEmployer has been granted. */
  name?: string;
  roles: string[];
  city: string;
  availability: string;
  rate?: string;
  credit?: string;
  works: Work[];
  prompts?: PromptAnswer[];
  attestation?: Attestation;
  /** A display capability, not the underlying private consent record. */
  canRequestIntroduction: boolean;
};

/** Does this record clear the consent gate for wall display? Fails closed:
 *  a record missing consentState or appearOnWall does NOT pass. */
export function mayAppearOnWall(c: Creative): boolean {
  return c.consentState === "confirmed" && c.consent?.appearOnWall.granted === true;
}

/**
 * Project the talent list down to what the browser is allowed to see.
 *
 * The consent gate runs here, on the server, so a record that has not consented
 * never enters the client payload at all — not just hidden from view, absent
 * from the wire. Tier-C fields (contact, consent internals, curator notes, the
 * AI flag) are dropped for every record. This is the real privacy boundary; the
 * Wall component's own filter is defence in depth on top of it.
 */
export function wallView(talent: Creative[]): WallCreative[] {
  return talent.filter(mayAppearOnWall).map((c) => {
    const mayRevealIdentity = c.consent?.showToEmployer.granted === true;

    return {
      id: c.id,
      roles: c.roles,
      city: c.city,
      availability: c.availability,
      works: c.works,
      name: mayRevealIdentity ? c.name : undefined,
      rate: mayRevealIdentity ? c.rate : undefined,
      credit: mayRevealIdentity ? c.credit : undefined,
      prompts: mayRevealIdentity ? c.prompts?.slice(0, 3) : undefined,
      attestation:
        mayRevealIdentity && c.attestation
          ? {
              ownWork: c.attestation.ownWork,
              roleOnProject: c.attestation.roleOnProject,
              sourceLink: c.attestation.sourceLink,
              at: c.attestation.at,
            }
          : undefined,
      canRequestIntroduction:
        mayRevealIdentity && c.consent?.mayIntroduce.granted === true,
    };
  });
}
