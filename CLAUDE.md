# Claude Code Guidance

@AGENTS.md
@CONTEXT.md
@DESIGN.md

Follow `AGENTS.md` as the repository's complete operating policy. The rules below clarify how Claude sessions should collaborate during the pilot.

## Before working

- Read `VISION.md`, `DESIGN.md`, and the relevant issue or product context.
- Check concurrent work before editing shared areas.
- Confirm the branch is not `main` before editing.
- Inspect existing work before generating replacements.

## While working

- Avoid uncoordinated overlapping edits. Branches and worktrees are available when parallel work touches nearby areas.
- Treat the documented product direction as the shared starting point, not immutable truth. Surface evidence and reasoning when changing it, then keep the shared documents current.
- Make changes to eligibility, curation, consent, introduction policy, success criteria, or the destination visible to the team.
- Prefer work that produces a real employer brief, a consenting talent profile, an approved shortlist, an accepted introduction, or verifiable learning.
- Do not silently replace placeholder talent with invented or scraped identities.
- Do not contact external people or publish participant information without explicit user authorization.

## Before handoff

- Run `pnpm build` and manually exercise the changed path.
- Review the full diff and remove unrelated generated changes.
- Open a pull request; never push directly to `main`.
- Report the issue name, files changed, behavior changed, verification, evidence produced, and intentionally excluded work.
