# HMNTY Creative Network

HMNTY Creative Network is a work-first introduction network for San Diego creatives. It helps an employer bring a real paid-work brief to HMNTY, lets HMNTY curate a credible shortlist, and ends with a warm human introduction.

The current prototype is intentionally narrow. It is being built to prove one complete loop with real people, not to imitate a mature self-serve marketplace.

The team alignment contract for the event is [VISION.md](./VISION.md).

## Pilot destination

Produce an evidence-backed pilot that connects one real San Diego employer project to one real local creative through an HMNTY-curated introduction, while leaving behind a clear product direction the team can continue after the hackathon.

Pilot success means:

1. A real employer submits a brief for paid creative work.
2. HMNTY approves a shortlist of relevant local creatives.
3. The employer accepts an introduction to at least one creative.

A completed hire or payment is a stretch outcome, not a weekend requirement.

## Product principles

- **Work before identity.** Employers react to the work before seeing credentials or networks.
- **Local density before scale.** Start with San Diego–area creative work and warm HMNTY relationships.
- **Open talent intake.** SDSU is an acquisition channel, not an eligibility gate.
- **Human accountability.** AI may organize and recommend; a named HMNTY person approves every shortlist and introduction.
- **Evidence over theater.** Real briefs, consenting creatives, accepted introductions, and documented learning matter more than feature count.

## Current prototype

The app currently includes:

- a portfolio-first talent Wall;
- role and availability filters;
- profile reveal after selecting work;
- a request-for-introduction flow; and
- placeholder talent records awaiting replacement with consenting local creatives.

Authentication, messaging, payments, video hosting, and a production matching system are intentionally out of scope for the pilot.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Vercel for deployment
- Resend-compatible introduction email route
- Embedded external portfolio media

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Validate a change before requesting review:

```bash
pnpm build
```

## Collaboration

Read [AGENTS.md](./AGENTS.md), [CLAUDE.md](./CLAUDE.md), and [CONTEXT.md](./CONTEXT.md) before contributing.

All changes use pull requests. Direct pushes to `main` are not part of the team workflow. The repository owner, `@gutierrezje`, merges after the build passes and at least one teammate approves.

Product decisions are tracked in the repository's [Wayfinder issues](https://github.com/gutierrezje/hmnty-creative-network/issues). Claim an open, unblocked decision ticket before working on it.
