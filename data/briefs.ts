/**
 * A brief — a real employer's description of paid creative work, with enough
 * context for a curator to identify relevant creatives. Not a "job posting,"
 * not a "prompt": the employer names real paid work and HMNTY reduces the
 * search to a human-reviewed shortlist.
 *
 * Briefs are never persisted to a database. The /brief form posts to the same
 * intake endpoint as everything else (validate, always log, email if
 * configured), and a curator carries the brief into a shortlist by hand. The
 * seed below is the one record the curator surface reads in the demo so it has
 * something to shortlist against before a real employer submits one.
 */
export type Brief = {
  id: string;
  /** The employer — an organization bringing credible paid creative work. */
  org: string;
  /** A representative HMNTY can reach. Private; never published to the wall. */
  contact: string;
  /** Role(s) the work needs, from the same ROLES set the wall filters on. The
   *  overlap between these and a creative's roles is the transparent signal the
   *  advisory suggested order is built on. */
  roles: string[];
  /** San Diego area. */
  city: string;
  /** Rate or budget context the employer can share. Private evidence. */
  budget?: string;
  /** Timeline or shoot dates. */
  timeline?: string;
  /** Enough plain-English context for a curator to identify relevant creatives. */
  description: string;
  /** When it came in. */
  at: string;
  /**
   * Seed data written before a real employer submitted a brief. This must be
   * replaced by a real San Diego organization's real paid work — a made-up
   * brief proves nothing. Explicitly a placeholder so it is never mistaken for
   * a real commitment.
   */
  placeholder?: boolean;
};

export const BRIEFS: Brief[] = [
  {
    // Placeholder — not a real employer or a real commitment. It exists only so
    // the curator surface has a brief to assemble a shortlist against in the
    // demo. Replace with a real San Diego brief before the showcase.
    id: "b01",
    org: "Placeholder: San Diego nonprofit",
    contact: "placeholder-employer@example.com",
    roles: ["DP", "EDITOR", "COLORIST"],
    city: "San Diego",
    budget: "$4,000 total, flexible",
    timeline: "two shoot days late August, cut by mid-September",
    description:
      "a two-minute fundraising film for a local youth arts program. one interview day, one b-roll day around the studio, then an edit and a grade. we want someone local who can shoot handheld and cut their own footage, or a small crew who works together.",
    at: "2026-08-01",
    placeholder: true,
  },
];

/**
 * The advisory ordering signal, described once so the intent is legible: the
 * only AI-shaped assistance on the shortlist is a plain, visible heuristic —
 * the number of roles a creative shares with the brief, most overlap first. It
 * is not a model call, and the curator surface renders it as "suggested — the
 * curator decides." It NEVER selects, rejects, hides, or reorders anything on
 * its own; the human owns every pick. The one-line computation lives inline in
 * the curator console where the sort happens.
 */
export function roleOverlap(brief: Brief, roles: string[]): number {
  const need = new Set(brief.roles);
  return roles.filter((r) => need.has(r)).length;
}
