import { useMemo, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Share2,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Flag,
  Calendar,
  TrendingUp,
  Flame,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignCard from "@/components/CampaignCard";
import { useStore } from "@/lib/store";
import { formatBDT, percent, timeAgo } from "@/lib/format";
import { slugifyOrganizer } from "@/lib/organizers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


export default function CampaignDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const {
    campaigns,
    donations,
    bookmarks,
    following,
    toggleBookmark,
    toggleFollow,
    isAuthed,
  } = useStore();

  const campaign = campaigns.find((c) => c.id === id);
  const campaignDonations = donations.filter((d) => d.campaignId === id);
  const related = useMemo(
    () => campaigns.filter((c) => c.id !== id && c.category === campaign?.category).slice(0, 3),
    [campaigns, id, campaign]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl font-bold mb-2">Campaign not found</h1>
            <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or was removed.</p>
            <Button asChild>
              <Link to="/browse">Browse campaigns</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const p = percent(campaign.raised, campaign.goal);
  const saved = bookmarks.includes(campaign.id);
  const urgent = campaign.daysLeft <= 7;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: campaign.title,
          text: campaign.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // cancelled
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container">
          <div className="text-sm mb-4 flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/browse" className="hover:text-primary">Browse</Link>
            <span>/</span>
            <span className="truncate max-w-[200px]">{campaign.title}</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <article>
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[16/9] bg-muted">
                <img 
                  src={campaign.image.startsWith('http') ? campaign.image : `${import.meta.env.BASE_URL}${campaign.image}`} 
                  alt={campaign.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=1200&h=800&fit=crop";
                  }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="chip bg-white/90 text-black dark:bg-black/70 dark:text-white backdrop-blur-md border-none">{campaign.category}</span>
                  {urgent && (
                    <span className="chip bg-destructive text-white border-destructive">
                      <Flame className="w-3 h-3" /> Urgent · {campaign.daysLeft}d left
                    </span>
                  )}
                </div>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4 text-balance">
                {campaign.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6">
                {campaign.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {campaign.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {campaign.backers || 0} backers
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {campaign.daysLeft} days left
                </span>
                {campaign.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Started {timeAgo(campaign.createdAt)}
                  </span>
                )}
              </div>

              {(() => {
                const orgSlug = campaign.organizer
                  ? slugifyOrganizer(campaign.organizer)
                  : "";
                const isFollowing = orgSlug ? following.includes(orgSlug) : false;
                const handleFollow = () => {
                  if (!isAuthed) {
                    toast.error("Please sign in to follow organizers");
                    return;
                  }
                  if (!campaign.organizer || !orgSlug) return;
                  const now = toggleFollow(orgSlug, campaign.organizer);
                  toast.success(
                    now ? `Following ${campaign.organizer}` : `Unfollowed ${campaign.organizer}`,
                  );
                };
                return (
                  <div className="card-elevated p-5 mb-6 flex items-center gap-4">
                    <Link
                      to={orgSlug ? `/organizer/${orgSlug}` : "#"}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white font-bold hover:scale-105 transition-transform"
                    >
                      {(campaign.organizer || "O").charAt(0)}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {orgSlug ? (
                          <Link
                            to={`/organizer/${orgSlug}`}
                            className="font-semibold truncate hover:text-primary transition-colors"
                          >
                            {campaign.organizer}
                          </Link>
                        ) : (
                          <span className="font-semibold truncate">{campaign.organizer}</span>
                        )}
                        {campaign.organizerVerified && (
                          <span className="text-primary" title="Verified organizer">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.organizerType} · organizing this campaign
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => nav(`/organizer/${orgSlug}#messages`)}
                        disabled={!orgSlug}
                      >
                        <MessageCircle className="w-4 h-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">Message</span>
                      </Button>
                      <Button
                        variant={isFollowing ? "secondary" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={handleFollow}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>
                );
              })()}

              <Tabs defaultValue="story" className="mb-8">
                <TabsList className="grid grid-cols-4 w-full rounded-full h-11 p-1">
                  <TabsTrigger value="story" className="rounded-full">Story</TabsTrigger>
                  <TabsTrigger value="updates" className="rounded-full">
                    Updates {campaign.updates?.length ? `(${campaign.updates.length})` : ""}
                  </TabsTrigger>
                  <TabsTrigger value="donations" className="rounded-full">Donors</TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-full">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="story" className="pt-6">
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <p className="text-lg leading-relaxed">{campaign.description}</p>
                    {campaign.longDescription && (
                      <div className="mt-4 text-foreground/85 whitespace-pre-line leading-relaxed">
                        {campaign.longDescription}
                      </div>
                    )}
                  </div>

                  {campaign.tags && campaign.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                      {campaign.tags.map((t) => (
                        <span key={t} className="chip">#{t}</span>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="updates" className="pt-6">
                  {campaign.updates && campaign.updates.length > 0 ? (
                    <div className="space-y-4">
                      {campaign.updates.map((u) => (
                        <div key={u.id} className="card-elevated p-5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-display font-bold">{u.title}</h4>
                            <time className="text-xs text-muted-foreground">{u.date}</time>
                          </div>
                          <p className="text-sm text-muted-foreground">{u.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No updates yet. Follow this campaign to get notified.</p>
                  )}
                </TabsContent>
                <TabsContent value="donations" className="pt-6">
                  {campaignDonations.length > 0 ? (
                    <ul className="divide-y divide-border card-elevated overflow-hidden">
                      {campaignDonations.map((d) => (
                        <li key={d.id} className="flex items-center gap-3 p-4">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-sm">
                            {(d.anonymous ? "?" : d.donorName[0] || "?").toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {d.anonymous ? "Anonymous" : d.donorName}
                            </div>
                            {d.message && <div className="text-xs text-muted-foreground truncate">{d.message}</div>}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{formatBDT(d.amount)}</div>
                            <div className="text-[10px] uppercase text-muted-foreground">{d.method}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Be the first to support this campaign.</p>
                  )}
                </TabsContent>
                <TabsContent value="comments" className="pt-6">
                  <p className="text-muted-foreground">Comments require sign-in. Be respectful and specific.</p>
                </TabsContent>
              </Tabs>
            </article>

            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="card-elevated p-6 space-y-5">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display text-3xl font-bold text-primary">
                      {formatBDT(campaign.raised)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    raised of <span className="font-semibold text-foreground">{formatBDT(campaign.goal)}</span>
                  </div>
                </div>

                <div>
                  <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full",
                        p >= 100 ? "bg-primary" : "bg-gradient-to-r from-primary to-accent"
                      )}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{p}% funded</span>
                    <span>{campaign.backers || 0} backers</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-2">
                  <Stat icon={TrendingUp} label="Funded" value={`${p}%`} />
                  <Stat icon={Users} label="Backers" value={`${campaign.backers || 0}`} />
                  <Stat icon={Clock} label="Days left" value={`${campaign.daysLeft}`} />
                </div>

                <Button
                  size="lg"
                  onClick={() => nav(`/donate/${campaign.id}`)}
                  className="w-full rounded-full h-12 bg-gradient-to-r from-primary to-brand-emerald-dark btn-primary-glow text-base font-bold"
                >
                  Donate Now
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="rounded-full" onClick={() => toggleBookmark(campaign.id)}>
                    <Heart className={cn("w-4 h-4 mr-2", saved && "fill-destructive text-destructive")} />
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={share}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>

                <div className="pt-4 border-t border-border space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Donations are protected by OrigoAid's trust guarantee.</span>
                  </div>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Flag className="w-4 h-4" /> Report this campaign
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Related campaigns</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <CampaignCard key={r.id} {...r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="text-center rounded-xl bg-secondary/50 py-3 px-2">
      <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
      <div className="font-bold text-sm">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

