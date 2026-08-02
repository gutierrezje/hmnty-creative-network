# Claude Code Guidance

@AGENTS.md
@CONTEXT.md
@DESIGN.md

Follow `AGENTS.md` as the repository's complete operating policy. The rules below clarify how Claude sessions should collaborate during the pilot.

## Before working

- Read `VISION.md`, `DESIGN.md`, and the relevant issue or product context.
- Assign or note the issue when one exists so parallel sessions do not duplicate it.
- Confirm the branch is not `main` before editing.
- State the smallest plan and expected files before making a non-trivial change.
- Inspect existing work before generating replacements.

If there is no issue, proceed with a clearly scoped request and record follow-up work rather than expanding it speculatively.

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
- Merge after required checks pass, the branch is current, and actionable review threads are addressed or explicitly dispositioned. Peer review is optional and must not block progress.
