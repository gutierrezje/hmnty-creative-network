#!/usr/bin/env bash
#
# Enforces the mechanically checkable rules in DESIGN.md.
#
# A prose style guide gets ignored on hour thirty of a hackathon; a red X does
# not. This only catches the patterns that happen to be greppable — the
# closed-vocabulary rule in DESIGN.md is still the real constraint.

set -uo pipefail

TARGETS="app data"
status=0

check() {
  local label="$1" pattern="$2" reason="$3"
  local hits
  hits=$(grep -rEn --include='*.tsx' --include='*.ts' --include='*.css' "$pattern" $TARGETS || true)
  if [ -n "$hits" ]; then
    echo "✗ $label"
    echo "  $reason"
    echo "$hits" | sed 's/^/    /'
    echo
    status=1
  fi
}

check "rounded corners" \
  'rounded-(sm|md|lg|xl|2xl|3xl|full)|border-radius: *[1-9]' \
  "DESIGN.md § Shapes — everything is a 0px rectangle. A film frame is hard-edged."

check "shadows" \
  'shadow-(sm|md|lg|xl|2xl)|box-shadow: *[^n]' \
  "DESIGN.md § Elevation & Depth — hierarchy comes from type scale and hairline rules."

check "gradients" \
  'bg-gradient|linear-gradient|radial-gradient|\b(from|via|to)-\[?#' \
  "DESIGN.md § Colors — the work is the only colour. (The seeded placeholder frames in data/ are the one exception and live in TS, not classnames.)"

check "accent colours" \
  '\b(indigo|violet|purple|fuchsia|sky|teal)-[0-9]{2,3}\b' \
  "DESIGN.md § Colors — black, white, and grey. There is no accent colour."

check "motion beyond opacity" \
  'animate-|transition-transform|hover:scale|translate-y-|@keyframes' \
  "DESIGN.md § Motion — opacity and cross-fade only. Video is the only thing that moves."

check "icon libraries" \
  'from "(lucide-react|react-icons|@heroicons)' \
  "DESIGN.md § Iconography — labels are words. No icon set is installed."

if [ "$status" -eq 0 ]; then
  echo "✓ DESIGN.md checks passed"
fi

exit "$status"
