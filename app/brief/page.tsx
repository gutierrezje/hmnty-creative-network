"use client";

import { useState } from "react";
import Link from "next/link";
import { ROLES } from "@/data/talent";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Employer brief intake. A San Diego organization describes real paid creative
 * work with enough context for a curator to identify relevant creatives.
 *
 * One plain ruled form on white, matching /join and /refer: role(s) via the
 * existing chip multi-select, one black button. The brief is not stored — it
 * posts to the same intake endpoint (validate, always log, email if
 * configured), and a curator carries it into a shortlist by hand. This form
 * shortlists no one on its own.
 */
export default function BriefPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  function toggleRole(r: string) {
    setRoles((cur) =>
      cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r],
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "brief",
          org: f.get("org"),
          contactEmail: f.get("contactEmail"),
          roles,
          city: f.get("city"),
          budget: f.get("budget"),
          timeline: f.get("timeline"),
          description: f.get("description"),
          paidWork: f.get("paidWork") === "on",
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
          Bring us a brief.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
          Real paid creative work, described in your own words. A person at HMNTY
          reads it and reduces the search to a small, human-reviewed shortlist.
          No account, no login.
        </p>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        {status === "sent" ? (
          <div>
            <p className="text-sm leading-relaxed">
              Brief received. A curator reads it, reviews relevant work, and
              assembles a shortlist by hand. AI never picks anyone.
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
                name="org"
                required
                aria-label="Your company or organization"
                placeholder="your company or organization"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="contactEmail"
                type="email"
                required
                aria-label="Your email"
                placeholder="your email"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3">
              <p className="meta text-ash">Role(s) the work needs</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => toggleRole(r)}
                    className={`meta border px-3 py-1.5 transition-colors ${
                      roles.includes(r)
                        ? "border-ink bg-ink text-paper"
                        : "border-rule text-ash hover:border-ink hover:text-ink"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="meta text-ash">City</p>
                <input
                  name="city"
                  required
                  aria-label="City"
                  placeholder="san diego area"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </div>
              <div className="space-y-3">
                <p className="meta text-ash">rate or budget (optional)</p>
                <input
                  name="budget"
                  aria-label="Rate or budget"
                  placeholder="total, per day, or a range"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="meta text-ash">timeline or dates (optional)</p>
              <input
                name="timeline"
                aria-label="Timeline or dates"
                placeholder="shoot dates, or when you need it delivered"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3 border-t border-rule pt-8">
              <p className="meta text-ash">The work, enough for a curator to identify relevant creatives</p>
              <textarea
                name="description"
                required
                rows={5}
                aria-label="The work"
                placeholder="what the work is, what you need shot or cut, and anything a local creative should know"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input name="paidWork" type="checkbox" required className="mt-1" />
              <span>I confirm this is paid creative work.</span>
            </label>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={status === "sending" || roles.length === 0}
                className="meta w-full bg-ink px-4 py-3 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send the brief"}
              </button>
              {status === "error" ? (
                <p className="meta text-ash">
                  Something failed. Try again, or email HMNTY directly.
                </p>
              ) : null}
              <p className="text-xs text-ash">
                A curator reads every brief and builds the shortlist. AI may
                suggest an order; it picks no one.
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
