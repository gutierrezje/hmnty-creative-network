import { NextResponse } from "next/server";
import { ROLES } from "@/data/talent";

/**
 * The intake endpoint. Deliberately not a database.
 *
 * It carries three payload kinds, all handled the same way: cap and validate
 * the fields, then email the HMNTY inbox. Participant details never go to
 * runtime logs; if email is unavailable, the endpoint fails visibly.
 *
 * - "intro" — an employer requests a warm introduction to a creative.
 * - "self-intake" — a creative adds their own work (/join), with self-consent.
 * - "referral" — someone vouches for a creative (/refer). A referral is a
 *   sourcing signal, never a gate. Nothing about the referred person is
 *   published until they confirm and consent themselves — a curator decides
 *   the appropriate follow-up and promotes them only after that round-trip.
 *
 * In every case a named HMNTY curator, not this endpoint, decides who reaches
 * the wall. AI may normalize the fields; it admits no one.
 */

type Kind = "intro" | "self-intake" | "referral";

const RELATIONSHIPS = ["peer", "partner-org-sdsu", "curator", "employer"] as const;
type Relationship = (typeof RELATIONSHIPS)[number];

const MAX_BODY_BYTES = 64_000;
const MAX_FIELD_LENGTH = 2_000;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "body too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "body too large" }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // Default to "intro" so the existing employer path keeps working unchanged.
  const kind = (str(body.kind) || "intro") as Kind;

  let subject: string;
  let summary: string;

  if (kind === "intro") {
    const creativeId = str(body.creativeId);
    const creativeName = str(body.creativeName);
    const from = str(body.from);
    const org = str(body.org);
    const project = str(body.project);

    if (!creativeId || !isEmail(from) || !org || !project) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    subject = `Intro request — ${creativeName}`;
    summary = [
      `Kind: intro`,
      `Creative: ${creativeName} (${creativeId})`,
      `From: ${from}`,
      `Org: ${org}`,
      ``,
      project,
    ].join("\n");
  } else if (kind === "self-intake") {
    // A creative adding their own work. Roles come from the existing ROLES
    // set (validated client-side by the chip control). Self-intake is
    // self-consent: the person entered their own work in the same form.
    const name = str(body.name);
    const roles = Array.isArray(body.roles)
      ? (body.roles as unknown[]).map(str).filter(Boolean).slice(0, ROLES.length)
      : [];
    const city = str(body.city);
    const availability = str(body.availability);
    const works = Array.isArray(body.works)
      ? (body.works as unknown[]).map(str).filter(Boolean).slice(0, 3)
      : [];
    const roleOnProject = str(body.roleOnProject);
    const ownWork = body.ownWork === true;
    const consentToShow = body.consentToShow === true;
    const contactEmail = str(body.contactEmail);

    // Required: identity, at least one role, city, availability, at least one
    // viewable work, a stated role on the project, the own-work attestation,
    // and self-consent to appear. The work-first product has no meaning
    // without viewable work and the attestation is not optional.
    if (
      !name ||
      roles.length === 0 ||
      roles.some((role) => !ROLES.includes(role as (typeof ROLES)[number])) ||
      !city ||
      !availability ||
      works.length === 0 ||
      works.some((work) => !isHttpUrl(work)) ||
      !roleOnProject ||
      !ownWork ||
      !consentToShow ||
      !isEmail(contactEmail)
    ) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const rate = str(body.rate);
    const credit = str(body.credit);
    const sourceLink = str(body.sourceLink);
    if (sourceLink && !isHttpUrl(sourceLink)) {
      return NextResponse.json({ error: "invalid source link" }, { status: 400 });
    }
    const prompts = Array.isArray(body.prompts)
      ? (body.prompts as unknown[])
          .map((p) => {
            const o = (p ?? {}) as Record<string, unknown>;
            return { prompt: str(o.prompt), answer: str(o.answer) };
          })
          .filter((p) => p.prompt && p.answer)
          .slice(0, 3)
      : [];

    subject = `Self-intake — ${name}`;
    summary = [
      `Kind: self-intake`,
      `Name: ${name}`,
      `Roles: ${roles.join(", ")}`,
      `City: ${city}`,
      `Availability: ${availability}`,
      `Contact: ${contactEmail}`,
      rate ? `Rate: ${rate}` : `Rate: (not given)`,
      credit ? `Credit: ${credit}` : `Credit: (not given)`,
      ``,
      `Work:`,
      ...works.map((w) => `  - ${w}`),
      ``,
      `Attestation: own work, made by me — ${ownWork ? "affirmed" : "NOT affirmed"}`,
      `Role on the project: ${roleOnProject}`,
      sourceLink ? `Source: ${sourceLink}` : `Source: (not given)`,
      `Consent to appear on the wall: ${consentToShow ? "granted" : "NOT granted"}`,
      ``,
      prompts.length ? `Prompts:` : `Prompts: (none)`,
      ...prompts.map((p) => `  ${p.prompt}\n    ${p.answer}`),
    ].join("\n");
  } else if (kind === "referral") {
    // Someone vouching for a creative not yet on the wall. This does NOT
    // create a card. It is a lead for the curator, who invites the referred
    // creative to confirm and consent. No referrer verification for the pilot.
    const referrerName = str(body.referrerName);
    const referrerEmail = str(body.referrerEmail);
    const relationship = str(body.relationship) as Relationship;
    const referredName = str(body.referredName);
    const referredContact = str(body.referredContact);
    const workLink = str(body.workLink);
    const note = str(body.note);

    if (
      !referrerName ||
      !isEmail(referrerEmail) ||
      !RELATIONSHIPS.includes(relationship) ||
      !referredName ||
      !isEmail(referredContact) ||
      !isHttpUrl(workLink)
    ) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    subject = `Referral — ${referredName}`;
    summary = [
      `Kind: referral`,
      `Referrer: ${referrerName} <${referrerEmail}>`,
      `Relationship: ${relationship}`,
      ``,
      `Referred creative: ${referredName}`,
      `Referred contact: ${referredContact}`,
      `Work: ${workLink}`,
      ``,
      note ? `Note: ${note}` : `Note: (none)`,
      ``,
      `A referral is a sourcing signal, not a gate. This person does not appear`,
      `anywhere until they confirm and consent themselves.`,
    ].join("\n");
  } else {
    return NextResponse.json({ error: "unknown kind" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.INTRO_INBOX;

  if (!key || !to) {
    console.error(`[intake:${kind}] delivery unavailable`);
    return NextResponse.json({ error: "delivery unavailable" }, { status: 503 });
  }

  // For intro and self-intake the sender's own email is a sensible reply-to;
  // a referral replies to the referrer, not the referred person.
  const replyTo =
    kind === "intro"
      ? str(body.from)
      : kind === "referral"
        ? str(body.referrerEmail)
        : str(body.contactEmail);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HMNTY Wall <onboarding@resend.dev>",
        to: [to],
        reply_to: replyTo,
        subject,
        text: summary,
      }),
    });
    if (!res.ok) {
      console.error(`[intake:${kind}] delivery failed with ${res.status}`);
      return NextResponse.json({ error: "delivery failed" }, { status: 502 });
    }
  } catch {
    console.error(`[intake:${kind}] delivery failed`);
    return NextResponse.json({ error: "delivery failed" }, { status: 502 });
  }

  console.log(`[intake:${kind}] delivered`);
  return NextResponse.json({ ok: true });
}
