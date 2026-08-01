import { NextResponse } from "next/server";

/**
 * An introduction request. Deliberately not a database.
 *
 * The whole product promise is that a human at HMNTY makes the introduction,
 * so the only thing this endpoint has to do is reliably get a person's
 * attention. Email does that; a table nobody checks does not.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { creativeId, creativeName, from, org, project } = body ?? {};

  if (!creativeId || !from || !org || !project) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const summary = [
    `Creative: ${creativeName} (${creativeId})`,
    `From: ${from}`,
    `Org: ${org}`,
    ``,
    project,
  ].join("\n");

  // Always logged, so a request is never silently lost even if email is not
  // configured yet — visible in `vercel logs` during the event.
  console.log("[intro-request]\n" + summary);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.INTRO_INBOX;

  if (key && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HMNTY Wall <onboarding@resend.dev>",
        to: [to],
        reply_to: from,
        subject: `Intro request — ${creativeName}`,
        text: summary,
      }),
    });
    if (!res.ok) {
      console.error("[intro-request] email failed", await res.text());
      // The request is already logged, so still report success to the sender
      // rather than asking them to retype a brief.
    }
  }

  return NextResponse.json({ ok: true });
}
