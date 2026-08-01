"use client";

import { useState } from "react";
import Link from "next/link";
import { ROLES } from "@/data/talent";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Open self-intake. A creative adds their own work.
 *
 * One plain ruled form on white: viewable work, roles from the existing set,
 * city, availability, optional rate and credit, the own-work attestation, up
 * to three prompt answers, and self-consent to appear. No wizard, no progress
 * bar, no illustration. One page, one black button.
 *
 * A named curator reviews the submission and adds it to the wall by hand. This
 * form admits no one on its own.
 */
export default function JoinPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  function toggleRole(r: string) {
    setRoles((cur) =>
      cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r],
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const works = [f.get("work1"), f.get("work2"), f.get("work3")]
      .map((w) => (typeof w === "string" ? w.trim() : ""))
      .filter(Boolean);
    const prompts = [
      { prompt: "the shot you are proudest of", answer: f.get("prompt1") },
      { prompt: "how you like to work", answer: f.get("prompt2") },
      { prompt: "one thing your reel does not show", answer: f.get("prompt3") },
    ]
      .map((p) => ({
        prompt: p.prompt,
        answer: typeof p.answer === "string" ? p.answer.trim() : "",
      }))
      .filter((p) => p.answer);

    setStatus("sending");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "self-intake",
          name: f.get("name"),
          roles,
          city: f.get("city"),
          availability: f.get("availability"),
          rate: f.get("rate"),
          credit: f.get("credit"),
          works,
          roleOnProject: f.get("roleOnProject"),
          sourceLink: f.get("sourceLink"),
          ownWork: f.get("ownWork") === "on",
          consentToShow: f.get("consentToShow") === "on",
          contactEmail: f.get("contactEmail"),
          prompts,
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
          Add your work.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
          The reel is the résumé. Send your work, not your CV. A person at HMNTY
          reads every submission and decides what goes on the wall. No account,
          no login.
        </p>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        {status === "sent" ? (
          <div>
            <p className="text-sm leading-relaxed">
              Submission received. A person at HMNTY reads it and decides what
              goes on the wall — nothing appears automatically.
            </p>
            <Link href="/" className="meta mt-6 inline-block text-ash hover:text-ink">
              ← Back to the wall
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-8">
            <div className="space-y-3">
              <p className="meta text-ash">Your work — one to three links</p>
              <input
                name="work1"
                type="url"
                required
                aria-label="Primary work link"
                placeholder="vimeo / youtube / instagram / tiktok link"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="work2"
                type="url"
                aria-label="Second work link"
                placeholder="another link (optional)"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="work3"
                type="url"
                aria-label="Third work link"
                placeholder="another link (optional)"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3">
              <p className="meta text-ash">Your role(s)</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Your roles">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    aria-pressed={roles.includes(r)}
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
                <p className="meta text-ash">Availability</p>
                <input
                  name="availability"
                  required
                  aria-label="Availability"
                  placeholder="now, or a month — aug"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="meta text-ash">Rate — optional, reveal-only</p>
                <input
                  name="rate"
                  aria-label="Rate"
                  placeholder="$/day, $/hr, or per spot"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </div>
              <div className="space-y-3">
                <p className="meta text-ash">Credit — optional, one line</p>
                <input
                  name="credit"
                  aria-label="Credit"
                  placeholder="one credit line"
                  className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="meta text-ash">Contact — private, for the introduction only</p>
              <input
                name="contactEmail"
                type="email"
                required
                aria-label="Contact email"
                placeholder="email — published to no one"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3 border-t border-rule pt-8">
              <p className="meta text-ash">Prompts — optional, up to three</p>
              <textarea
                name="prompt1"
                rows={2}
                aria-label="The shot you are proudest of"
                placeholder="the shot you are proudest of"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <textarea
                name="prompt2"
                rows={2}
                aria-label="How you like to work"
                placeholder="how you like to work"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <textarea
                name="prompt3"
                rows={2}
                aria-label="One thing your reel does not show"
                placeholder="one thing your reel does not show"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-3 border-t border-rule pt-8">
              <p className="meta text-ash">Attestation</p>
              <input
                name="roleOnProject"
                required
                aria-label="Your role on the submitted work"
                placeholder="what you did on the work — shot it, cut it, graded it"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <input
                name="sourceLink"
                type="url"
                aria-label="Credits or source link"
                placeholder="where it ran, or the credits — optional"
                className="w-full border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <label className="flex items-start gap-3 text-sm leading-relaxed">
                <input name="ownWork" type="checkbox" required className="mt-1" />
                <span>this is my own work, made by me.</span>
              </label>
            </div>

            <div className="space-y-3 border-t border-rule pt-8">
              <p className="meta text-ash">Consent</p>
              <label className="flex items-start gap-3 text-sm leading-relaxed">
                <input
                  name="consentToShow"
                  type="checkbox"
                  required
                  className="mt-1"
                />
                <span>
                  hmnty may show my work, roles, city, and availability on the
                  wall. being on the wall is not agreeing to be introduced —
                  hmnty asks again before handing an employer my contact.
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={status === "sending" || roles.length === 0}
                className="meta w-full bg-ink px-4 py-3 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Add your work"}
              </button>
              {status === "error" ? (
                <p className="meta text-ash" role="alert">
                  Something failed. Try again, or email HMNTY directly.
                </p>
              ) : null}
              <p className="text-xs text-ash">
                A person reads every submission. AI never admits anyone.
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
