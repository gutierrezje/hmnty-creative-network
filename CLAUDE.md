# Claude Code Guidance

@AGENTS.md
@CONTEXT.md
@DESIGN.md

Follow `AGENTS.md` as the repository's complete operating policy. The rules below clarify how Claude sessions should collaborate during the pilot.

## Before working

- Read the Wayfinder map and the full body of the claimed decision ticket.
- Assign the ticket before doing work. An assigned ticket is claimed; do not duplicate it.
- Confirm the branch is not `main` before editing.
- State the smallest plan and expected files before making a non-trivial change.
- Inspect existing work before generating replacements.

If there is no claimed issue, help the user select an open, unblocked Wayfinder ticket. Do not fill idle time with speculative redesigns or extra features.

## While working

- Keep one Claude session responsible for each file area.
- Treat confirmed product decisions as constraints, not prompts for fresh ideation.
- Ask a human when a choice changes eligibility, curation, consent, introduction policy, success criteria, or the destination.
- Prefer work that produces a real employer brief, a consenting talent profile, an approved shortlist, an accepted introduction, or verifiable learning.
- Do not silently replace placeholder talent with invented or scraped identities.
- Do not contact external people or publish participant information without explicit user authorization.

## Before handoff

- Run `pnpm build` and manually exercise the changed path.
- Review the full diff and remove unrelated generated changes.
- Open a pull request; never push directly to `main`.
- Report the issue name, files changed, behavior changed, verification, evidence produced, and intentionally excluded work.
- Leave merging to `@gutierrezje` after a passing build. Peer review is optional and must not block progress.
