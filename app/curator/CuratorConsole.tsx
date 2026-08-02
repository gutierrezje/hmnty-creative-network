"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CuratorBrief } from "@/data/briefs";
import { roleOverlap } from "@/data/briefs";
import type { CuratorCreative, Shortlist } from "@/data/shortlists";

/**
 * The curator's console. Three moves, in order:
 *
 * 1. read the briefs and choose one to work.
 * 2. assemble a shortlist for it — select a few creatives and write one line
 *    per pick saying why they belong. The rationale is required: a shortlist
 *    without a reason per pick is a ranking, not a curator's call.
 * 3. make an introduction for a shortlisted creative — only when that creative
 *    granted mayIntroduce — and record the employer accepting, which completes
 *    the loop.
 *
 * AI stays backstage. A suggested order (plain role-overlap with the brief) is
 * shown next to the creatives, clearly labelled and advisory. It never selects,
 * rejects, hides, or reorders anything — the curator decides. State is
 * ephemeral for the demo; nothing is persisted.
 */

type IntroState = "none" | "made" | "accepted";
type Sending = "idle" | "sending" | "error";

export default function CuratorConsole({
  briefs,
  creatives,
  seedShortlists,
}: {
  briefs: CuratorBrief[];
  creatives: CuratorCreative[];
  seedShortlists: Shortlist[];
}) {
  const [briefId, setBriefId] = useState<string>(briefs[0]?.id ?? "");
  const brief = briefs.find((b) => b.id === briefId) ?? null;

  // The shortlist for the selected brief, ephemeral. Seeded from the placeholder
  // shortlist so the surface opens with an example the curator can edit.
  const seededPicks = useMemo(() => {
    const seed = seedShortlists.find((s) => s.briefId === briefId);
    const map: Record<string, string> = {};
    seed?.picks.forEach((p) => (map[p.creativeId] = p.rationale));
    return map;
  }, [seedShortlists, briefId]);

  // creativeId -> rationale. Presence of a key means "on the shortlist".
  const [picks, setPicks] = useState<Record<string, string>>(seededPicks);
  // Introduction state per creative, and the employer org captured once.
  const [intro, setIntro] = useState<Record<string, IntroState>>({});
  const [sending, setSending] = useState<Record<string, Sending>>({});
  const [employerOrg, setEmployerOrg] = useState<string>(brief?.org ?? "");
  const [curatorName, setCuratorName] = useState("");

  useEffect(() => {
    setPicks(seededPicks);
    setEmployerOrg(brief?.org ?? "");
    setIntro({});
    setSending({});
  }, [brief?.org, seededPicks]);

  // The advisory suggested order: role-overlap with the brief, most first. A
  // transparent heuristic, not a model call, and it changes nothing on its own.
  const suggested = useMemo(() => {
    if (!brief) return creatives;
    return [...creatives].sort(
      (a, b) => roleOverlap(brief, b.roles) - roleOverlap(brief, a.roles),
    );
  }, [brief, creatives]);

  function togglePick(id: string) {
    setPicks((cur) => {
      const next = { ...cur };
      if (id in next) delete next[id];
      else next[id] = "";
      return next;
    });
  }

  function setRationale(id: string, value: string) {
    setPicks((cur) => ({ ...cur, [id]: value }));
  }

  async function makeIntroduction(c: CuratorCreative) {
    if (
      !brief ||
      !c.mayIntroduce ||
      !curatorName.trim() ||
      sending[c.id] === "sending"
    )
      return;
    setSending((s) => ({ ...s, [c.id]: "sending" }));
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "introduction",
          briefId: brief.id,
          creativeId: c.id,
          employerOrg: employerOrg || brief.org,
          curator: curatorName.trim(),
          rationale: picks[c.id] ?? "",
        }),
      });
      if (res.ok) {
        setIntro((i) => ({ ...i, [c.id]: "made" }));
        setSending((s) => ({ ...s, [c.id]: "idle" }));
      } else {
        setSending((s) => ({ ...s, [c.id]: "error" }));
      }
    } catch {
      setSending((s) => ({ ...s, [c.id]: "error" }));
    }
  }

  function acceptIntroduction(id: string) {
    // The employer accepts — the pilot-success event. Recorded client-side for
    // the demo; a real acceptance is an email reply a curator logs by hand.
    setIntro((i) => ({ ...i, [id]: "accepted" }));
  }

  return (
    <main className="flex-1">
      <header className="border-b border-rule px-6 pt-10 pb-8 sm:px-10">
        <Link href="/" className="meta text-ash hover:text-ink">
          ← Back to the wall
        </Link>
        <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          Curator.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ash">
          Read the brief, assemble a shortlist you can explain, and make an
          introduction when a creative has consented. A person owns every pick
          and every send. AI may suggest an order; it decides nothing.
        </p>
        <p className="meta mt-4 text-ash">Unlisted pilot surface · hmnty curator</p>
      </header>

      {/* Choose a brief. */}
      <section className="border-b border-rule px-6 py-6 sm:px-10">
        <p className="meta text-ash">The brief</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {briefs.map((b) => (
            <button
              key={b.id}
              onClick={() => setBriefId(b.id)}
              className={`meta border px-3 py-1.5 transition-colors ${
                b.id === briefId
                  ? "border-ink bg-ink text-paper"
                  : "border-rule text-ash hover:border-ink hover:text-ink"
              }`}
            >
              {b.org}
              {b.placeholder ? " · placeholder" : ""}
            </button>
          ))}
        </div>

        {brief ? (
          <div className="mt-6 max-w-2xl">
            <p className="meta text-ash">
              {brief.roles.join(" · ")} · {brief.city}
              {brief.timeline ? ` · ${brief.timeline}` : ""}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{brief.description}</p>
            {brief.placeholder ? (
              <p className="meta mt-3 text-ash">
                Placeholder brief. Replace with a real San Diego brief before
                the showcase.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 text-sm text-ash">No brief to work yet.</p>
        )}
      </section>

      {/* Assemble the shortlist. */}
      <section className="border-b border-rule px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="meta text-ash">The confirmed creatives</p>
          <p className="meta text-ash">
            suggested order. the curator decides
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ash">
          Ordered by how many of the brief&apos;s roles each creative shares, a
          plain, visible signal, not a verdict. Selecting a creative adds them to
          the shortlist; write one line saying why they belong.
        </p>

        <ul className="mt-6 space-y-4">
          {suggested.map((c) => {
            const overlap = brief ? roleOverlap(brief, c.roles) : 0;
            const onList = c.id in picks;
            return (
              <li key={c.id} className="border-t border-rule pt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <span className="meta text-ink">{c.roles.join(" · ")}</span>
                    <span className="meta ml-3 text-ash">
                      {c.city} · {c.availability}
                    </span>
                    {c.placeholder ? (
                      <span className="meta ml-3 text-ash">placeholder</span>
                    ) : null}
                  </div>
                  <span className="meta text-ash">
                    {overlap} of {brief?.roles.length ?? 0} roles
                  </span>
                </div>

                {/* Public-safe reference; identity stays out of this demo. */}
                <p className="mt-1 text-sm">Creative {c.id}</p>

                <button
                  onClick={() => togglePick(c.id)}
                  className={`meta mt-3 border px-3 py-1.5 transition-colors ${
                    onList
                      ? "border-ink bg-ink text-paper"
                      : "border-rule text-ash hover:border-ink hover:text-ink"
                  }`}
                >
                  {onList ? "On the shortlist" : "Add to shortlist"}
                </button>

                {onList ? (
                  <div className="mt-3 space-y-2">
                    <label className="meta block text-ash">
                      why this creative belongs, one line
                    </label>
                    <textarea
                      rows={2}
                      value={picks[c.id]}
                      onChange={(e) => setRationale(c.id, e.target.value)}
                      placeholder="what the work shows, and why it fits this brief"
                      className="w-full max-w-2xl border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                    />

                    {/* The introduction handoff — #5. Consent-gated. */}
                    <IntroductionRow
                      creative={c}
                      state={intro[c.id] ?? "none"}
                      sending={sending[c.id] ?? "idle"}
                      hasRationale={Boolean((picks[c.id] ?? "").trim())}
                      hasCurator={Boolean(curatorName.trim())}
                      onMake={() => makeIntroduction(c)}
                      onAccept={() => acceptIntroduction(c.id)}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Employer org for the introduction record. */}
      <section className="px-6 py-8 sm:px-10">
        <p className="meta text-ash">Named HMNTY curator</p>
        <input
          value={curatorName}
          onChange={(e) => setCuratorName(e.target.value)}
          aria-label="Named HMNTY curator"
          placeholder="your name"
          className="mt-3 w-full max-w-md border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <p className="meta mt-6 text-ash">Employer for the introduction</p>
        <input
          value={employerOrg}
          onChange={(e) => setEmployerOrg(e.target.value)}
          aria-label="Employer for the introduction"
          placeholder="the employer accepting the introduction"
          className="mt-3 w-full max-w-md border border-rule bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-ash">
          An introduction only sends for a creative who said yes to it, separate
          from the employer accepting. When both hold, the loop is complete. That
          is the one thing this weekend exists to prove.
        </p>
      </section>

      <footer className="border-t border-rule px-6 py-10 sm:px-10">
        <p className="meta text-ash">
          Unlisted curator surface · placeholder data · no introduction sends
          until the creative says yes
        </p>
      </footer>
    </main>
  );
}

/**
 * One creative's introduction handoff. The action is only available when the
 * creative granted mayIntroduce; otherwise it is disabled and says plainly why.
 * After it fires, the employer can accept — and an accepted introduction is
 * rendered clearly as the loop completing.
 */
function IntroductionRow({
  creative,
  state,
  sending,
  hasRationale,
  hasCurator,
  onMake,
  onAccept,
}: {
  creative: CuratorCreative;
  state: IntroState;
  sending: Sending;
  hasRationale: boolean;
  hasCurator: boolean;
  onMake: () => void;
  onAccept: () => void;
}) {
  if (state === "accepted") {
    return (
      <div className="mt-4 border border-ink px-4 py-3">
        <p className="meta text-ink">Introduction accepted</p>
        <p className="mt-2 text-sm leading-relaxed">
          Creative {creative.id} and the employer are connected for this brief. The
          loop is complete.
        </p>
        <p className="meta mt-2 text-ash">
          HMNTY handles the contact exchange privately.
        </p>
      </div>
    );
  }

  if (state === "made") {
    return (
      <div className="mt-4 border border-rule px-4 py-3">
        <p className="meta text-ash">Introduction made, awaiting employer</p>
        <p className="mt-2 text-sm leading-relaxed">
          HMNTY offered creative {creative.id} to the employer. When the employer accepts,
          the loop is complete.
        </p>
        <button
          onClick={onAccept}
          className="meta mt-3 text-secondary transition-opacity hover:opacity-70"
        >
          Employer accepted the introduction
        </button>
      </div>
    );
  }

  // state === "none"
  if (!creative.mayIntroduce) {
    return (
      <div className="mt-4 border border-rule px-4 py-3">
        <p className="meta text-ash">Introduction not available</p>
        <p className="mt-2 text-sm leading-relaxed">
          This creative has not said yes to being introduced. HMNTY asks them
          again before handing an employer their contact.
        </p>
        <button
          disabled
          className="meta mt-3 border border-rule px-3 py-1.5 text-ash opacity-50"
        >
          Make introduction (needs their yes)
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={onMake}
        disabled={sending === "sending" || !hasRationale || !hasCurator}
        className="meta text-secondary transition-opacity hover:opacity-70 disabled:opacity-50"
      >
        {sending === "sending" ? "Sending…" : "Make introduction"}
      </button>
      {!hasRationale ? (
        <p className="meta mt-2 text-ash">
          write why this creative belongs first
        </p>
      ) : null}
      {!hasCurator ? (
        <p className="meta mt-2 text-ash">add the curator's name first</p>
      ) : null}
      {sending === "error" ? (
        <p className="meta mt-2 text-ash">
          something failed. try again, or email HMNTY directly.
        </p>
      ) : null}
    </div>
  );
}
