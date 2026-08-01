import { TALENT, mayAppearOnWall } from "@/data/talent";
import { BRIEFS } from "@/data/briefs";
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
 * runs on a curator who knows the URL. This is acceptable only because the
 * curator surface reveals a creative's contact solely after an accepted
 * introduction, and everything here is placeholder seed data. Before this
 * carries real contacts in production it needs real access control. Do not link
 * it from the public site.
 *
 * The consent gate runs here, on the server: only creatives who cleared the
 * same confirmed + appearOnWall gate the wall uses are projected into the
 * curator view. The curatorView projection deliberately carries the
 * mayIntroduce grant and the contact — the curator is the one accountable human
 * allowed to read them — so this must stay a server component and never widen.
 */
export default function CuratorPage() {
  const creatives = TALENT.filter(mayAppearOnWall).map(curatorView);

  return (
    <CuratorConsole
      briefs={BRIEFS}
      creatives={creatives}
      seedShortlists={SHORTLISTS}
    />
  );
}
