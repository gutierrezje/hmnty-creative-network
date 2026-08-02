# HMNTY Creative Network Agent Guide

These instructions apply to every human and AI contributor in this repository.

## Start here

Before changing anything:

1. Read `VISION.md` for the weekend outcome.
2. Read `DESIGN.md` for the visual and interaction standard.
3. Read `README.md` and `CONTEXT.md` for the product boundary and canonical language.
4. Work from a relevant open issue when one exists. Assign it or leave a short note so parallel agents do not duplicate the work.

Agents may make reversible implementation decisions without waiting for permission. Escalate decisions that materially change the product direction, consent model, participant privacy, or weekend destination.

## Destination

Prove one complete loop: a real San Diego employer submits a paid-work brief, HMNTY approves a shortlist, and the employer accepts a warm introduction to at least one real local creative.

Optimize for evidence that this loop creates value. Do not optimize for feature count.

## Product boundaries

Preserve these confirmed decisions:

- The initial demand side may be any San Diego organization with credible paid creative work in below-the-line production, media, or short-form content.
- The initial talent pool is San Diego–area creatives with real, viewable work and current availability. SDSU is a sourcing channel, not a gate.
- Work appears before identity, school, seniority, or network credentials.
- Intake is open. Curation happens in shortlists and editorial amplification, not admission.
- AI may normalize information and suggest rankings. It may not reject talent, contact a participant, or make an introduction without approval from a named HMNTY curator.
- A completed hire is valuable but not required to prove the weekend pilot.

Authentication, persistence, messaging, payments, and other infrastructure are not forbidden. Before adding them, push back on the idea: identify the user path they unlock now, compare the simplest credible alternative, and account for setup and operational risk. Add them only when they materially improve the usable weekend product or protect real participant data. Keep national expansion and autonomous AI decisions outside the weekend destination.

## Repository workflow

- Never push directly to `main`.
- Create a short type-prefixed branch: `feature/`, `bugfix/`, `docs/`, `test/`, `chore/`, or `refactor/`.
- Keep one active owner per task and file area. Coordinate before editing a file another teammate owns.
- Make the smallest coherent change that advances a claimed issue.
- Open a pull request using the repository template.
- Require a passing `build` check. Reviews are encouraged when useful, but they are optional and never a merge gate.
- Contributors and their agents may merge their own pull requests once required checks pass, the branch is current, and all actionable review threads are addressed or explicitly dispositioned.
- Use squash merge so `main` remains legible during the event.

Repository access does not imply permission to edit every area concurrently. If work overlaps, sequence it or split it along clean file boundaries.

## Evidence and data integrity

- Never present invented people, projects, quotes, metrics, or commitments as real.
- Keep placeholder records explicitly marked as placeholders.
- Obtain permission before publishing a creative's name, portfolio work, rate, availability, or contact details.
- Do not commit API keys, email credentials, participant contact details, or `.env` files.
- Preserve experiment receipts outside the codebase when they contain personal information; link only appropriately redacted evidence.

## Implementation guidance

- Preserve the existing Next.js, TypeScript, and Tailwind architecture.
- Prefer the simplest reliable implementation that produces a usable end-to-end product. Simplicity is a means, not a reason to leave a core path fake or broken.
- A database, authentication provider, state-management library, or other dependency must earn its complexity. Record the concrete need and why a smaller option is insufficient in the issue or pull request; a separate decision ticket is not required.
- Keep AI backstage and human approval explicit in both interface copy and behavior.
- Treat the Wall as a discovery surface supporting the full employer-brief-to-introduction loop, not as the whole product.

## Quality bar

High throughput is welcome; low-quality generated output is not.

- Follow `DESIGN.md`. Do not introduce generic dashboard styling, extra decoration, inconsistent components, placeholder copy, or competing interaction patterns.
- Match existing architecture, naming, and local conventions. Remove unused abstractions, duplicated logic, speculative flexibility, and generated commentary before merging.
- Keep changes coherent and reviewable even when multiple agents contribute. Do not let agents edit the same files concurrently without explicit coordination.
- Prefer a complete, exercised user path over a larger amount of partially connected code.
- Treat privacy, consent, and server-side authorization decisions as product behavior, not polish.
- If an agent loop is producing churn, repeatedly reopening settled decisions, or growing scope without improving the destination, stop the loop and narrow its task.

## Verification and handoff

Before merging:

1. Run `pnpm build`.
2. Exercise the changed user path locally.
3. Review the diff for unrelated generated changes.
4. In the pull request, state what changed, why it exists, how it was verified, and what remains out of scope.

When handing work to another contributor, include the issue name, files touched, verification performed, evidence or screenshots produced, and any unresolved risk.
