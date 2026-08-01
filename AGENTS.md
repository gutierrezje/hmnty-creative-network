# HMNTY Creative Network Agent Guide

These instructions apply to every human and AI contributor in this repository.

## Start here

Before changing anything:

1. Read `README.md` for the destination and pilot boundary.
2. Read `CONTEXT.md` for the project's canonical language.
3. Open the GitHub issue labelled `wayfinder:map` for the current decision frontier.
4. Claim the relevant open, unblocked issue by assigning it before starting work.

Do not invent a new product direction in a code change. If a decision is unresolved, work the corresponding Wayfinder ticket with the humans who own the decision.

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

Keep authentication, direct messaging, payments, hosted video, national expansion, and autonomous AI matching out of scope unless the Wayfinder destination is explicitly redrawn.

## Repository workflow

- Never push directly to `main`.
- Create a short type-prefixed branch: `feature/`, `bugfix/`, `docs/`, `test/`, `chore/`, or `refactor/`.
- Keep one active owner per task and file area. Coordinate before editing a file another teammate owns.
- Make the smallest coherent change that advances a claimed issue.
- Open a pull request using the repository template.
- Require a passing `build` check and one non-author approval.
- Only the repository owner, `@gutierrezje`, merges pull requests.
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
- Prefer static or operationally simple solutions while proving the pilot.
- Do not add a database, authentication provider, state-management library, or design system without a decision ticket explaining why the pilot now needs it.
- Keep AI backstage and human approval explicit in both interface copy and behavior.
- Treat the Wall as a discovery surface supporting the full employer-brief-to-introduction loop, not as the whole product.

## Verification and handoff

Before requesting review:

1. Run `pnpm build`.
2. Exercise the changed user path locally.
3. Review the diff for unrelated generated changes.
4. In the pull request, state what changed, why it exists, how it was verified, and what remains out of scope.

When handing work to another contributor, include the issue name, files touched, verification performed, evidence or screenshots produced, and any unresolved risk.
