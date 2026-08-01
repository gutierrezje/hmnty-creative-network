import { TALENT, mayAppearOnWall } from "@/data/talent";
import { BRIEFS, curatorBriefView } from "@/data/briefs";
import { SHORTLISTS, curatorView } from "@/data/shortlists";
import CuratorConsole from "./CuratorConsole";

/**
 * The curator surface. Where a named HMNTY curator reads the briefs, assembles
 * a shortlist for one of them, and — when a creative has consented — makes an
 * introduction.
 *
 * PILOT SECURITY NOTE: this route is intentionally UNLISTED (it is not linked
 * from the public nav) and UNSECURED. There is no auth provider and none is
 * added — AGENTS.md forbids adding one without a decision ticket, and the pilot
 * runs on a curator who knows the URL. The client projection is therefore
 * public-safe: private contacts, budgets, identity, rates, and consent text stay
 * out of the browser. A future private operational surface needs real access
 * control. Do not link this demo from the public site.
 *
 * The consent gate runs here, on the server: only creatives who cleared the
 * same confirmed + appearOnWall gate the wall uses are projected into the
 * curator view. Both projections omit private contact, budget, identity, rate,
 * and consent text before the client boundary.
 */
export default function CuratorPage() {
  const briefs = BRIEFS.map(curatorBriefView);
  const creatives = TALENT.filter(mayAppearOnWall).map(curatorView);

  return (
    <CuratorConsole
      briefs={briefs}
      creatives={creatives}
      seedShortlists={SHORTLISTS}
    />
  );
}
