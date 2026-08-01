"use client";

import { useMemo, useState } from "react";
import type { Creative } from "@/data/talent";
import { ROLES } from "@/data/talent";
import RequestIntro from "./RequestIntro";

/**
 * Stand-in for a reel still — a skeleton, not decoration.
 *
 * Greyscale and flat by DESIGN.md § Colors: the work is the only colour on the
 * page, so a placeholder must not invent one. Lightness varies deterministically
 * per creative so the wall reads as composed rather than as one grey slab.
 */
function frameStyle(id: string) {
  const seed = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const lightness = 12 + (seed % 5) * 6;
  return { backgroundColor: `hsl(0 0% ${lightness}%)` };
}

function Frame({ creative }: { creative: Creative }) {
  const work = creative.works[0];
  const ratio = work.aspect === "9:16" ? "9 / 16" : "16 / 9";

  return (
    <div
      className="relative w-full overflow-hidden bg-ink"
      style={{ aspectRatio: ratio, ...(work.poster ? {} : frameStyle(creative.id)) }}
    >
      {work.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={work.poster}
          alt={work.title}
          className="h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}

export default function Wall({ talent }: { talent: Creative[] }) {
  const [role, setRole] = useState<string | null>(null);
  const [availableNow, setAvailableNow] = useState(false);
  const [open, setOpen] = useState<Creative | null>(null);

  const shown = useMemo(
    () =>
      talent.filter(
        (c) =>
          (!role || c.roles.includes(role)) &&
          (!availableNow || c.availability === "NOW"),
      ),
    [talent, role, availableNow],
  );

  return (
    <>
      {/* Discovery is chips, not a search box. With a wall this size a query
          returns an empty state most of the time; a chip never does. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-rule px-6 py-4 sm:px-10">
        <button
          onClick={() => setRole(null)}
          className={`meta border px-3 py-1.5 transition-colors ${
            role === null
              ? "border-ink bg-ink text-paper"
              : "border-rule text-ash hover:border-ink hover:text-ink"
          }`}
        >
          All
        </button>
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRole(role === r ? null : r)}
            className={`meta border px-3 py-1.5 transition-colors ${
              role === r
                ? "border-ink bg-ink text-paper"
                : "border-rule text-ash hover:border-ink hover:text-ink"
            }`}
          >
            {r}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-rule" aria-hidden />
        <button
          onClick={() => setAvailableNow((v) => !v)}
          className={`meta border px-3 py-1.5 transition-colors ${
            availableNow
              ? "border-ink bg-ink text-paper"
              : "border-rule text-ash hover:border-ink hover:text-ink"
          }`}
        >
          Available now
        </button>
        <span className="meta ml-auto text-ash">
          {shown.length} {shown.length === 1 ? "creative" : "creatives"}
        </span>
      </div>

      {/* CSS columns give a true masonry mix of 16:9 and 9:16 without a layout
          library. The mixed aspect ratios are the identity: film work and
          short-form work sit on the same wall. */}
      <div className="columns-1 gap-4 px-6 py-8 sm:columns-2 sm:px-10 lg:columns-3 xl:columns-4">
        {shown.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpen(c)}
            className="group mb-4 block w-full break-inside-avoid text-left"
          >
            <div className="overflow-hidden transition-opacity group-hover:opacity-90">
              <Frame creative={c} />
            </div>
            {/* No name. No school. Role, city, availability — that is all you
                get until you have reacted to the work. */}
            <div className="meta mt-2 flex items-baseline justify-between text-ash">
              <span className="text-ink">{c.roles.join(" · ")}</span>
              <span>
                {c.city} · {c.availability}
              </span>
            </div>
          </button>
        ))}
      </div>

      {open ? (
        <RequestIntro creative={open} onClose={() => setOpen(null)} />
      ) : null}
    </>
  );
}
