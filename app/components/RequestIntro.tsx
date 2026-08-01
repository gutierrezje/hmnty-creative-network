"use client";

import { useEffect, useState } from "react";
import type { WallCreative } from "@/data/talent";

type Status = "idle" | "sending" | "sent" | "error";

function externalHttpUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The reveal and the ask, in one panel.
 *
 * The name appears here and nowhere else — you have already reacted to the
 * work by the time you learn who made it. The only action is a request for a
 * human introduction: no messaging, no applications, no accounts. A person at
 * HMNTY reads the request and makes the intro.
 */
export default function RequestIntro({
  creative,
  onClose,
}: {
  creative: WallCreative;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const sourceLink = externalHttpUrl(creative.attestation?.sourceLink);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creativeId: creative.id,
          creativeName: creative.name,
          from: form.get("from"),
          org: form.get("org"),
          project: form.get("project"),
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-paper/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${creative.name ?? "Creative work"}, details`}
    >
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
        <button onClick={onClose} className="meta text-ash hover:text-ink">
          ← Back to the wall
        </button>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            {creative.works.map((w) => (
              <figure key={w.title}>
                <div
                  className="w-full bg-ink"
                  style={{
                    aspectRatio: w.aspect === "9:16" ? "9 / 16" : "16 / 9",
                    maxHeight: w.aspect === "9:16" ? "70vh" : undefined,
                  }}
                />
                <figcaption className="meta mt-2 text-ash">{w.title}</figcaption>
              </figure>
            ))}
          </div>

          <div className="md:sticky md:top-8 md:self-start">
            <h2 className="text-4xl tracking-tight">
              {creative.name ?? "Identity held by HMNTY"}
            </h2>
            <p className="meta mt-3 text-ash">
              {creative.roles.join(" · ")}
              <br />
              {creative.city} · available {creative.availability}
              {creative.rate ? (
                <>
                  <br />
                  {creative.rate}
                </>
              ) : null}
            </p>
            {creative.credit ? (
              <p className="mt-4 text-sm text-ash">{creative.credit}</p>
            ) : null}

            {/* Authenticity, as call-sheet facts — not a badge, not a checkmark.
                The creative attested this is their own work at intake; a named
                curator confirms it while building a shortlist. */}
            {creative.attestation?.ownWork ? (
              <p className="meta mt-4 text-ash">
                Own work · confirmed {creative.attestation.at}
                <br />
                {creative.attestation.roleOnProject}
                {sourceLink ? (
                  <>
                    <br />
                    <a
                      href={sourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-ink"
                    >
                      source
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}

            {/* Up to three prompts: a mono label, an Inter answer. Prompts live
                only here — never on a card, never filterable. */}
            {creative.prompts?.length ? (
              <dl className="mt-6 space-y-4">
                {creative.prompts.slice(0, 3).map((p) => (
                  <div key={p.prompt}>
                    <dt className="meta text-ash">{p.prompt}</dt>
                    <dd className="mt-1 text-sm leading-relaxed">{p.answer}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <hr className="my-6 border-rule" />

            {!creative.name ? (
              <p className="text-sm leading-relaxed text-ash">
                HMNTY has permission to show this work, but not to reveal this
                creative&apos;s identity. A curator must obtain that permission first.
              </p>
            ) : !creative.canRequestIntroduction ? (
              <p className="text-sm leading-relaxed text-ash">
                This creative has not said yes to an introduction yet. HMNTY
                will ask before offering that action.
              </p>
            ) : status === "sent" ? (
              <div>
                <p className="text-sm">
                  Request received. Someone at HMNTY will make the introduction
                  by email, and you will both be on it.
                </p>
                <button onClick={onClose} className="meta mt-4 text-ash hover:text-ink">
                  ← Back to the wall
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <p className="meta text-ash">Request an introduction</p>
                <input
                  name="from"
                  type="email"
                  required
                  aria-label="Your email"
                  placeholder="your email"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
                <input
                  name="org"
                  required
                  aria-label="Your company or organization"
                  placeholder="your company or organization"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
                <textarea
                  name="project"
                  required
                  aria-label="Project details"
                  rows={3}
                  placeholder="what's the project? dates, budget range, what you need"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="meta w-full bg-ink px-4 py-3 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Request an introduction"}
                </button>
                {status === "error" ? (
                  <p className="meta text-ash">
                    Something failed. Try again, or email HMNTY directly.
                  </p>
                ) : null}
                <p className="text-xs text-ash">
                  A person reads every request. No automated outreach, no
                  messaging inbox.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
