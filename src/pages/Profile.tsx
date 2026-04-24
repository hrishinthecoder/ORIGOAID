import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Save, ShieldCheck, Upload, Mail, Phone, MapPin, Globe, FileText,
  TrendingUp, Heart, Users, UserPlus, Activity as ActivityIcon,
  MessageCircle, Bookmark, Settings, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore, type Activity as ActivityEvent } from "@/lib/store";
import { ProfileType } from "@/data/campaigns";
import { formatBDT, timeAgo } from "@/lib/format";
import { findOrganizerBySlug } from "@/lib/organizers";
import { toast } from "sonner";

export default function Profile() {
  const nav = useNavigate();
  const {
    user,
    isAuthed,
    campaigns,
    donations,
    bookmarks,
    following,
    followers,
    activity,
  } = useStore();

  const [name, setName]       = useState(user?.name     || "");
  const [email, setEmail]     = useState(user?.email    || "");
  const [phone, setPhone]     = useState(user?.phone    || "");
  const [bio, setBio]         = useState(user?.bio      || "");
  const [location, setLocation] = useState(user?.location || "");
  const [type, setType]       = useState<ProfileType>(user?.profileType || "Individual");
  const [website, setWebsite] = useState("");

  // Derived stats for the logged-in user
  const stats = useMemo(() => {
    const totalDonated = donations.reduce((s, d) => s + d.amount, 0);
    const uniqueCampaigns = new Set(donations.map((d) => d.campaignId)).size;
    return {
      totalDonated,
      donationCount: donations.length,
      campaignsBacked: uniqueCampaigns,
      bookmarks: bookmarks.length,
      following: following.length,
      followers: followers.length,
      activity: activity.length,
    };
  }, [donations, bookmarks, following, followers, activity]);

  // Enrich followed organizer slugs with summary data
  const followedOrganizers = useMemo(
    () =>
      following
        .map((slug) => findOrganizerBySlug(slug, campaigns))
        .filter(Boolean) as NonNullable<ReturnType<typeof findOrganizerBySlug>>[],
    [following, campaigns],
  );

  if (!isAuthed || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container max-w-md text-center card-elevated p-10">
            <h1 className="font-display text-2xl font-bold mb-2">Sign in required</h1>
            <Button onClick={() => nav("/login")}>Sign in</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const save = () => {
    useStore.setState({
      user: { ...user, name, email, phone, bio, location, profileType: type },
    });
    toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          <header className="mb-8">
            <span className="chip mb-3">Your profile</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Hi, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Your giving history, community, and settings — all in one place.
            </p>
          </header>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="card-elevated p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-display font-bold text-lg">{user.name}</h3>
                <div className="text-xs text-muted-foreground">{user.profileType}</div>
                {user.verified ? (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="mt-3 rounded-full">
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Get verified
                  </Button>
                )}

                {/* Quick numbers */}
                <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 text-center gap-2">
                  <QuickStat label="Following" value={stats.following} />
                  <QuickStat label="Followers" value={stats.followers} />
                  <QuickStat label="Backed"    value={stats.campaignsBacked} />
                </div>
              </div>

              <div className="card-elevated p-5 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="font-display font-bold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> KYC documents
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload NID, passport, or org registration to qualify for the verified badge.
                </p>
                <Button variant="outline" size="sm" className="w-full rounded-full">
                  Upload (demo)
                </Button>
              </div>
            </aside>

            {/* Main tabs */}
            <section className="min-w-0">
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-5 w-full rounded-full h-11 p-1 mb-6">
                  <TabsTrigger value="overview"  className="rounded-full"><Settings className="w-3.5 h-3.5 mr-1.5" />Overview</TabsTrigger>
                  <TabsTrigger value="stats"     className="rounded-full"><TrendingUp className="w-3.5 h-3.5 mr-1.5" />Stats</TabsTrigger>
                  <TabsTrigger value="activity"  className="rounded-full"><ActivityIcon className="w-3.5 h-3.5 mr-1.5" />Activity</TabsTrigger>
                  <TabsTrigger value="following" className="rounded-full"><UserPlus className="w-3.5 h-3.5 mr-1.5" />Following</TabsTrigger>
                  <TabsTrigger value="followers" className="rounded-full"><Users className="w-3.5 h-3.5 mr-1.5" />Followers</TabsTrigger>
                </TabsList>

                {/* Overview: existing settings form */}
                <TabsContent value="overview">
                  <div className="card-elevated p-6 md:p-8 space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs mb-1.5 block">Display name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                      </div>
                      <div>
                        <Label className="text-xs mb-1.5 block">Profile type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as ProfileType)}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Individual">Individual</SelectItem>
                            <SelectItem value="Organization">Organization</SelectItem>
                            <SelectItem value="Group">Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs mb-1.5 block">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-9" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs mb-1.5 block">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                            className="h-11 pl-9 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs mb-1.5 block">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Dhaka, Bangladesh"
                            className="h-11 pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs mb-1.5 block">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://"
                            className="h-11 pl-9"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-1.5 block">Bio</Label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell people who you are and what you care about."
                        rows={5}
                        maxLength={400}
                      />
                      <div className="text-[11px] text-muted-foreground text-right mt-1">
                        {bio.length} / 400
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                      <Button
                        onClick={save}
                        className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark"
                      >
                        <Save className="w-4 h-4 mr-1.5" /> Save changes
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Stats */}
                <TabsContent value="stats">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <BigStat
                      icon={Heart}
                      label="Total donated"
                      value={formatBDT(stats.totalDonated, { short: true })}
                      accent="text-destructive"
                      sub={`${stats.donationCount} donation${stats.donationCount === 1 ? "" : "s"}`}
                    />
                    <BigStat
                      icon={TrendingUp}
                      label="Campaigns backed"
                      value={`${stats.campaignsBacked}`}
                      accent="text-primary"
                      sub="Unique campaigns supported"
                    />
                    <BigStat
                      icon={Bookmark}
                      label="Saved"
                      value={`${stats.bookmarks}`}
                      accent="text-accent-foreground"
                      sub="Bookmarks in your list"
                    />
                    <BigStat
                      icon={UserPlus}
                      label="Following"
                      value={`${stats.following}`}
                      accent="text-primary"
                      sub="Organizers you follow"
                    />
                    <BigStat
                      icon={Users}
                      label="Followers"
                      value={`${stats.followers}`}
                      accent="text-primary"
                      sub="People who follow you"
                    />
                    <BigStat
                      icon={ActivityIcon}
                      label="Activity events"
                      value={`${stats.activity}`}
                      accent="text-primary"
                      sub="Your recent actions"
                    />
                  </div>

                  {/* Recent donations */}
                  {donations.length > 0 && (
                    <div className="mt-6 card-elevated overflow-hidden">
                      <div className="p-5 border-b border-border">
                        <h3 className="font-display font-bold">Recent donations</h3>
                      </div>
                      <ul className="divide-y divide-border">
                        {donations.slice(0, 5).map((d) => {
                          const c = campaigns.find((x) => x.id === d.campaignId);
                          return (
                            <li key={d.id} className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                                <Heart className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {c?.title || "Unknown campaign"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {timeAgo(d.createdAt)} · {d.method.toUpperCase()}
                                </div>
                              </div>
                              <div className="text-sm font-bold text-primary">
                                {formatBDT(d.amount)}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                {/* Activity */}
                <TabsContent value="activity">
                  <ActivityFeed events={activity} />
                </TabsContent>

                {/* Following */}
                <TabsContent value="following">
                  {followedOrganizers.length === 0 ? (
                    <EmptyState
                      icon={UserPlus}
                      title="You're not following anyone yet"
                      body="Follow organizers from any campaign to get their updates here."
                      cta={{ label: "Browse campaigns", to: "/browse" }}
                    />
                  ) : (
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {followedOrganizers.map((o) => (
                        <li key={o.slug} className="card-elevated p-5">
                          <Link to={`/organizer/${o.slug}`} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white font-bold shrink-0">
                              {o.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold truncate group-hover:text-primary transition-colors">
                                  {o.name}
                                </span>
                                {o.verified && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {o.type} · {o.campaigns.length} campaign{o.campaigns.length === 1 ? "" : "s"} · {formatBDT(o.totalRaised, { short: true })} raised
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>

                {/* Followers */}
                <TabsContent value="followers">
                  {followers.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No followers yet"
                      body="Once people follow your profile or campaigns, you'll see them here. Share your profile to grow your community."
                    />
                  ) : (
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {followers.map((f) => (
                        <li key={f.id} className="card-elevated p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary grid place-items-center font-bold">
                            {f.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{f.name}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Small subcomponents ────────────────────────────────────────────────
function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display text-lg font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function BigStat({
  icon: Icon,
  label,
  value,
  sub,
  accent = "text-primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="card-elevated p-5">
      <div className={`flex items-center gap-2 mb-2 ${accent}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={ActivityIcon}
        title="Nothing here yet"
        body="Donations, follows, and messages will appear here so you can look back on your journey."
      />
    );
  }
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li key={e.id} className="card-elevated p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0">
            {iconFor(e)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm">{describe(e)}</div>
            <div className="text-xs text-muted-foreground">{timeAgo(e.at)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function iconFor(e: ActivityEvent) {
  switch (e.type) {
    case "donate":       return <Heart        className="w-4 h-4" />;
    case "bookmark":     return <Bookmark     className="w-4 h-4 fill-current" />;
    case "unbookmark":   return <Bookmark     className="w-4 h-4" />;
    case "follow":       return <UserPlus     className="w-4 h-4" />;
    case "unfollow":     return <Users        className="w-4 h-4" />;
    case "message":      return <MessageCircle className="w-4 h-4" />;
  }
}

function describe(e: ActivityEvent): React.ReactNode {
  switch (e.type) {
    case "donate":
      return (
        <>
          Donated <strong className="text-primary">{formatBDT(e.amount)}</strong> to{" "}
          <Link to={`/campaign/${e.campaignId}`} className="hover:underline">
            {e.campaignTitle}
          </Link>
        </>
      );
    case "bookmark":
      return (
        <>
          Saved{" "}
          <Link to={`/campaign/${e.campaignId}`} className="hover:underline">
            {e.campaignTitle}
          </Link>
        </>
      );
    case "unbookmark":
      return (
        <>
          Unsaved{" "}
          <Link to={`/campaign/${e.campaignId}`} className="hover:underline">
            {e.campaignTitle}
          </Link>
        </>
      );
    case "follow":
      return (
        <>
          Started following{" "}
          <Link to={`/organizer/${e.organizerSlug}`} className="hover:underline">
            {e.organizerName}
          </Link>
        </>
      );
    case "unfollow":
      return (
        <>
          Unfollowed{" "}
          <Link to={`/organizer/${e.organizerSlug}`} className="hover:underline">
            {e.organizerName}
          </Link>
        </>
      );
    case "message":
      return (
        <>
          Messaged{" "}
          <Link to={`/organizer/${e.organizerSlug}`} className="hover:underline">
            {e.organizerName}
          </Link>
          <span className="text-muted-foreground"> — "{e.preview}"</span>
        </>
      );
  }
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="card-elevated p-10 text-center">
      <Icon className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
      <h3 className="font-display text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">{body}</p>
      {cta && (
        <Button asChild className="rounded-full">
          <Link to={cta.to}>{cta.label}</Link>
        </Button>
      )}
    </div>
  );
}
