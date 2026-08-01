import type { Creative } from "@/data/talent";

/**
 * A shortlist — a small, HMNTY-approved set of creatives relevant to one real
 * brief. Not an "AI ranking," not "search results," not "matches": a named
 * curator selects each creative and records one line of why they belong, so the
 * curator can explain every pick. Accountability is the point.
 *
 * Shortlists are never persisted to a database. The seed below gives the
 * curator surface a starting example in the demo; new picks live in ephemeral
 * client state and, when a curator makes an introduction, post to the same
 * intake endpoint as everything else.
 */

/** One creative on a shortlist, with the curator's one-line rationale. */
export type ShortlistPick = {
  creativeId: string;
  /** The curator's own words: why this creative belongs on this shortlist. A
   *  shortlist without a reason per pick is a ranking, not a curator's call. */
  rationale: string;
};

/** The introduction handoff. Recorded when a curator hands one creative to the
 *  employer for a brief, and again when the employer accepts — employer
 *  acceptance is the pilot-success event. */
export type Introduction = {
  briefId: string;
  creativeId: string;
  /** The named curator who made the call. A role label ("hmnty curator") in the
   *  pilot, never a fabricated real person. */
  madeBy: string;
  at: string;
  /** The loop's completion. The employer explicitly asked to meet this
   *  creative; this is the weekend validation threshold. */
  accepted: boolean;
  acceptedAt?: string;
};

export type Shortlist = {
  id: string;
  briefId: string;
  /** The named curator accountable for this shortlist. */
  curator: string;
  picks: ShortlistPick[];
  /**
   * Seed data. Replace with a real curator's real shortlist for a real brief
   * before the showcase — an example shortlist proves the surface works, not
   * that the loop happened.
   */
  placeholder?: boolean;
};

export const SHORTLISTS: Shortlist[] = [
  {
    // Placeholder — an example shortlist for the placeholder brief, so the
    // curator surface opens with something to look at. The curator can clear it
    // and build their own for a real brief.
    id: "s01",
    briefId: "b01",
    curator: "hmnty curator",
    picks: [
      {
        creativeId: "c07",
        rationale:
          "shoots and operates, has a spec spot on the wall, and said yes to being introduced. closest to what the brief asks for.",
      },
      {
        creativeId: "c02",
        rationale:
          "can grade the finished film. would round out a small crew for the edit-and-grade half of the brief.",
      },
    ],
    placeholder: true,
  },
];

/**
 * What the curator surface is allowed to see about a creative — deliberately
 * more than the wall's WallCreative, because the curator is the one accountable
 * human who reads the private consent record to decide whether an introduction
 * may fire. This is NOT a wall-safe projection: it carries the mayIntroduce
 * grant and the contact so the console can gate the introduction action and,
 * only after an accepted introduction, reveal the contact.
 *
 * The /curator route is unlisted and unsecured for the pilot (see the route
 * comment). This view is only ever built on the server for that surface.
 */
export type CuratorCreative = {
  id: string;
  name: string;
  roles: string[];
  city: string;
  availability: string;
  rate?: string;
  credit?: string;
  /** The gate on the introduction action. True only when the creative granted
   *  mayIntroduce. When false, the console disables "make introduction" and
   *  says why in plain language. */
  mayIntroduce: boolean;
  /** The exact consent line, so the curator reads the creative's own words for
   *  why an introduction can or cannot fire. */
  mayIntroduceStatement?: string;
  /** Private. Revealed by the console only after an accepted introduction, so a
   *  demo can show the loop completing without leaking contacts before consent
   *  and acceptance both hold. */
  contact?: string;
  placeholder?: boolean;
};

/** Does this creative permit an introduction? Fails closed: a record with no
 *  consent record, or an ungranted mayIntroduce, is not introducible. */
export function mayIntroduce(c: Creative): boolean {
  return c.consent?.mayIntroduce.granted === true;
}

/**
 * Project a confirmed creative down to the curator's view. Only the creatives a
 * curator may work with reach this surface: the same confirmed + appearOnWall
 * gate the wall uses, so the curator never shortlists someone who has not
 * consented to appear at all.
 */
export function curatorView(c: Creative): CuratorCreative {
  return {
    id: c.id,
    name: c.name,
    roles: c.roles,
    city: c.city,
    availability: c.availability,
    rate: c.rate,
    credit: c.credit,
    mayIntroduce: mayIntroduce(c),
    mayIntroduceStatement: c.consent?.mayIntroduce.statement,
    contact: c.contact,
    placeholder: c.placeholder,
  };
}
