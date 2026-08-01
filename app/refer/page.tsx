"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "sending" | "sent" | "error";

/** The closed relationship set — how the referrer knows the work. */
const RELATIONSHIPS: { value: string; label: string }[] = [
  { value: "peer", label: "PEER" },
  { value: "partner-org-sdsu", label: "PARTNER / SDSU" },
  { value: "curator", label: "CURATOR" },
  { value: "employer", label: "EMPLOYER" },
];

/**
 * Referral intake. Someone vouches for a creative not yet on the wall.
 *
 * A referral is a sourcing signal, never a gate — it tells a curator "look at
 * this person's work." It does not create a card. Nothing about the referred
 * person appears anywhere until they confirm and consent themselves; a curator
 * invites them and promotes them by hand only after that round-trip. A curator
 * may refer, and still goes through the same consent step — it is not a back
 * door. No referrer verification for the pilot.
 */
export default function ReferPage() {
  const [relationship, setRelationship] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "referral",
          referrerName: f.get("referrerName"),
          referrerEmail: f.get("referrerEmail"),
          relationship,
          referredName: f.get("referredName"),
          referredContact: f.get("referredContact"),
          workLink: f.get("workLink"),
          note: f.get("note"),
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="flex-1">
      <header className="border-b border-rule px-6 pt-10 pb-8 sm:px-10">
        <Link href="/" className="meta text-ash hover:text-ink">
          ← Back to the wall
        </Link>
        <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          Vouch for someone.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
          Point HMNTY at a local creative whose work you know. This is an
          invitation to look, not a shortcut in. Nothing about them appears
          until they confirm it and say what may be shown.
        </p>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        {status === "sent" ? (
          <div>
            <p className="text-sm leading-relaxed">
              Referral received. HMNTY reaches out to the person you named and
              asks them to confirm their details and choose what may be shown.
              Nothing appears until they do.
            </p>
            <Link href="/" className="meta mt-6 inline-block text-ash hover:text-ink">
              ← Back to the wall
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-8">
            <div className="space-y-3">
              <p className="meta text-ash">You</p>
              <input
                name="referrerName"
                required
                placeholder="your name"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="referrerEmail"
                type="email"
                required
                placeholder="your email"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3">
              <p className="meta text-ash">How you know the work</p>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIPS.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRelationship(r.value)}
                    className={`meta border px-3 py-1.5 transition-colors ${
                      relationship === r.value
                        ? "border-ink bg-ink text-paper"
                        : "border-rule text-ash hover:border-ink hover:text-ink"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-rule pt-8">
              <p className="meta text-ash">Who you are vouching for</p>
              <input
                name="referredName"
                required
                placeholder="their name"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="referredContact"
                required
                placeholder="a way to reach them — email"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="workLink"
                required
                placeholder="one link to their work — the whole point is the work"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3">
              <p className="meta text-ash">Why they belong — a line or two</p>
              <textarea
                name="note"
                rows={3}
                placeholder="what you have seen them do"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={status === "sending" || !relationship}
                className="meta w-full bg-ink px-4 py-3 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send referral"}
              </button>
              {status === "error" ? (
                <p className="meta text-ash">
                  Something failed. Try again, or email HMNTY directly.
                </p>
              ) : null}
              <p className="text-xs text-ash">
                A referral is a signal, not a gate. The person you named decides
                what HMNTY may show.
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
