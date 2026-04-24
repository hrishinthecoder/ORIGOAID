import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ShieldCheck,
  UserPlus,
  UserMinus,
  MessageCircle,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import MessageThread from "@/components/MessageThread";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { findOrganizerBySlug } from "@/lib/organizers";
import { formatBDT, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const hashToTab = (hash: string): "campaigns" | "activity" | "messages" => {
  if (hash === "#messages") return "messages";
  if (hash === "#activity") return "activity";
  return "campaigns";
};

export default function OrganizerProfile() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const {
    campaigns,
    isAuthed,
    following,
    messages,
    toggleFollow,
  } = useStore();

  // Controlled tab value — syncs with URL hash so #messages routes us straight in
  const [tabValue, setTabValue] = useState<"campaigns" | "activity" | "messages">(
    () => hashToTab(location.hash),
  );

  useEffect(() => {
    setTabValue(hashToTab(location.hash));
  }, [location.hash]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const organizer = useMemo(
    () => findOrganizerBySlug(slug, campaigns),
    [slug, campaigns],
  );

  if (!organizer) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl font-bold mb-2">Organizer not found</h1>
            <p className="text-muted-foreground mb-6">
              This organizer either doesn't exist or has no public campaigns.
            </p>
            <Button asChild>
              <Link to="/browse">Browse campaigns</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFollowing = following.includes(slug);
  const thread = messages[slug] || [];

  const handleFollow = () => {
    if (!isAuthed) {
      toast.error("Please sign in to follow organizers");
      return;
    }
    const nowFollowing = toggleFollow(slug, organizer.name);
    toast.success(
      nowFollowing
        ? `You're now following ${organizer.name}`
        : `Unfollowed ${organizer.name}`,
    );
  };

  const joined = organizer.firstCreatedAt
    ? new Date(organizer.firstCreatedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <div className="text-sm mb-4 flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/browse" className="hover:text-primary">Browse</Link>
            <span>/</span>
            <span className="truncate max-w-[200px]">{organizer.name}</span>
          </div>

          {/* Header */}
          <section className="card-elevated p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white text-4xl font-bold shrink-0">
                {organizer.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl md:text-3xl font-bold truncate">
                    {organizer.name}
                  </h1>
                  {organizer.verified && (
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                      <ShieldCheck className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>{organizer.type}</span>
                  <span className="opacity-50">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Joined {joined}
                  </span>
                  <span className="opacity-50">·</span>
                  <span>{organizer.campaigns.length} campaign{organizer.campaigns.length === 1 ? "" : "s"}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={handleFollow}
                  className={cn(
                    "rounded-full gap-2",
                    isFollowing
                      ? "bg-secondary text-foreground hover:bg-secondary/80"
                      : "bg-gradient-to-r from-primary to-brand-emerald-dark",
                  )}
                >
                  {isFollowing ? (
                    <><UserMinus className="w-4 h-4" /> Following</>
                  ) : (
                    <><UserPlus  className="w-4 h-4" /> Follow</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  onClick={() => setTabValue("messages")}
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </Button>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
              <StatCell icon={TrendingUp} label="Total raised"   value={formatBDT(organizer.totalRaised, { short: true })} />
              <StatCell icon={Users}      label="Backers reached" value={`${organizer.totalBackers.toLocaleString()}`} />
              <StatCell icon={Target}     label="Campaigns"       value={`${organizer.campaigns.length}`} />
              <StatCell icon={CheckCircle2} label="Success rate"  value={`${organizer.successRate}%`} />
            </div>
          </section>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onValueChange={(v) => setTabValue(v as typeof tabValue)}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 w-full rounded-full h-11 p-1">
              <TabsTrigger value="campaigns" className="rounded-full">
                Campaigns ({organizer.campaigns.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-full">
                Activity
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-full">
                Messages {thread.length ? `(${thread.length})` : ""}
              </TabsTrigger>
            </TabsList>

            {/* Campaigns */}
            <TabsContent value="campaigns" className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizer.campaigns.map((c) => (
                  <CampaignCard key={c.id} {...c} />
                ))}
              </div>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity" className="pt-6">
              <OrganizerActivity organizer={organizer} />
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages" className="pt-6">
              <MessageThread slug={slug} organizerName={organizer.name} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Small subcomponents ────────────────────────────────────────────────
function StatCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center rounded-xl bg-secondary/50 py-3 px-2">
      <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
      <div className="font-bold text-base">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function OrganizerActivity({
  organizer,
}: {
  organizer: ReturnType<typeof findOrganizerBySlug> & {};
}) {
  // Aggregate all campaign updates + creation events, sorted newest first
  const events = useMemo(() => {
    const out: Array<{ key: string; date: string; title: string; body: string; campaignId: string; campaignTitle: string }> = [];
    for (const c of organizer.campaigns) {
      if (c.createdAt) {
        out.push({
          key: `c-${c.id}`,
          date: c.createdAt,
          title: `Launched "${c.title}"`,
          body: c.description,
          campaignId: c.id,
          campaignTitle: c.title,
        });
      }
      for (const u of c.updates || []) {
        out.push({
          key: `u-${u.id}`,
          date: u.date,
          title: u.title,
          body: u.body,
          campaignId: c.id,
          campaignTitle: c.title,
        });
      }
    }
    return out.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [organizer]);

  if (events.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <p className="text-muted-foreground">No activity yet from this organizer.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((e) => (
        <li key={e.key} className="card-elevated p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display font-bold">{e.title}</h4>
            <time className="text-xs text-muted-foreground shrink-0 ml-3">
              {timeAgo(e.date)}
            </time>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{e.body}</p>
          <Link
            to={`/campaign/${e.campaignId}`}
            className="text-xs text-primary font-medium hover:underline"
          >
            View campaign →
          </Link>
        </li>
      ))}
    </ul>
  );
}

