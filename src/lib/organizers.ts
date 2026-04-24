import { Campaign } from "@/data/campaigns";

/** URL-safe slug for an organizer name: "River Health Initiative" → "river-health-initiative". */
export function slugifyOrganizer(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface OrganizerSummary {
  slug: string;
  name: string;
  type: string;
  verified: boolean;
  campaigns: Campaign[];
  totalRaised: number;
  totalGoal: number;
  totalBackers: number;
  completed: number;
  successRate: number;      // % of campaigns that hit their goal
  firstCreatedAt?: string;
}

/** Find all campaigns for a slug and aggregate stats. */
export function findOrganizerBySlug(slug: string, campaigns: Campaign[]): OrganizerSummary | null {
  const list = campaigns.filter(
    (c) => c.organizer && slugifyOrganizer(c.organizer) === slug,
  );
  if (list.length === 0) return null;

  const first = list[0];
  const totalRaised  = list.reduce((s, c) => s + c.raised, 0);
  const totalGoal    = list.reduce((s, c) => s + c.goal, 0);
  const totalBackers = list.reduce((s, c) => s + (c.backers || 0), 0);
  const completed    = list.filter((c) => c.raised >= c.goal).length;
  const dates        = list.map((c) => c.createdAt).filter(Boolean) as string[];
  const firstCreatedAt = dates.length ? dates.sort()[0] : undefined;

  return {
    slug,
    name: first.organizer!,
    type: first.organizerType || "Individual",
    verified: list.some((c) => c.organizerVerified),
    campaigns: list,
    totalRaised,
    totalGoal,
    totalBackers,
    completed,
    successRate: Math.round((completed / list.length) * 100),
    firstCreatedAt,
  };
}

/** List all unique organizers from the campaigns table. */
export function listOrganizers(campaigns: Campaign[]): OrganizerSummary[] {
  const seen = new Set<string>();
  const out: OrganizerSummary[] = [];
  for (const c of campaigns) {
    if (!c.organizer) continue;
    const slug = slugifyOrganizer(c.organizer);
    if (seen.has(slug)) continue;
    seen.add(slug);
    const summary = findOrganizerBySlug(slug, campaigns);
    if (summary) out.push(summary);
  }
  return out;
}
