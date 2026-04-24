import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  TrendingUp,
  Users,
  Wallet,
  Plus,
  ArrowUpRight,
  Bookmark,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CampaignCard from "@/components/CampaignCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { formatBDT, percent, timeAgo } from "@/lib/format";


export default function Dashboard() {
  const nav = useNavigate();
  const { user, isAuthed, campaigns, donations, bookmarks } = useStore();

  const myDonations = useMemo(
    () => donations.filter((d) => !user || true),
    [donations, user]
  );
  const myCampaigns = useMemo(
    () => campaigns.filter((c) => c.organizer === user?.name),
    [campaigns, user]
  );
  const savedCampaigns = campaigns.filter((c) => bookmarks.includes(c.id));

  const totalDonated = myDonations.reduce((s, d) => s + d.amount, 0);
  const totalRaised = myCampaigns.reduce((s, c) => s + c.raised, 0);
  const totalBackers = myCampaigns.reduce((s, c) => s + (c.backers || 0), 0);

  if (!isAuthed || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container max-w-md text-center card-elevated p-10">
            <h1 className="font-display text-2xl font-bold mb-2">Sign in required</h1>
            <p className="text-muted-foreground mb-4">Your dashboard is where your impact lives.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => nav("/login")}>Sign in</Button>
              <Button variant="outline" onClick={() => nav("/signup")}>
                Create account
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="text-sm text-muted-foreground font-mono">Welcome back</div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">{user.name}</h1>
              <div className="text-sm text-muted-foreground mt-1">
                {user.profileType} · joined {timeAgo(user.createdAt)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => nav("/profile")} className="rounded-full">
                Edit profile
              </Button>
              <Button onClick={() => nav("/start-campaign")} className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark">
                <Plus className="w-4 h-4 mr-1.5" /> New campaign
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatTile icon={Heart} label="You donated" value={formatBDT(totalDonated, { short: true })} sub={`${myDonations.length} donations`} />
            <StatTile icon={Wallet} label="Raised by you" value={formatBDT(totalRaised, { short: true })} sub={`${myCampaigns.length} campaigns`} />
            <StatTile icon={Users} label="Backers" value={`${totalBackers}`} sub="across your campaigns" />
            <StatTile icon={Bookmark} label="Saved" value={`${savedCampaigns.length}`} sub="campaigns bookmarked" />
          </div>

          <Tabs defaultValue="campaigns">
            <TabsList className="rounded-full h-11 p-1 mb-6">
              <TabsTrigger value="campaigns" className="rounded-full">My campaigns</TabsTrigger>
              <TabsTrigger value="donations" className="rounded-full" id="donations">Donations</TabsTrigger>
              <TabsTrigger value="saved" className="rounded-full">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns">
              {myCampaigns.length === 0 ? (
                <EmptyState
                  title="You haven't launched a campaign yet"
                  sub="Starting one takes ~5 minutes. Our AI helps you write it."
                  cta="Start a campaign"
                  onClick={() => nav("/start-campaign")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCampaigns.map((c) => (
                    <CampaignCard key={c.id} {...c} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="donations">
              {myDonations.length === 0 ? (
                <EmptyState
                  title="No donations yet"
                  sub="Start making impact — every amount helps."
                  cta="Browse campaigns"
                  onClick={() => nav("/browse")}
                />
              ) : (
                <div className="card-elevated overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50">
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3">Campaign</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3 hidden md:table-cell">Method</th>
                        <th className="px-4 py-3 hidden md:table-cell">Date</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {myDonations.map((d) => {
                        const c = campaigns.find((c) => c.id === d.campaignId);
                        return (
                          <tr key={d.id}>
                            <td className="px-4 py-3">
                              <div className="font-medium line-clamp-1">{c?.title || "Campaign"}</div>
                              <div className="text-xs text-muted-foreground">{c?.category}</div>
                            </td>
                            <td className="px-4 py-3 font-bold text-primary">{formatBDT(d.amount)}</td>
                            <td className="px-4 py-3 hidden md:table-cell uppercase text-xs">{d.method}</td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                              {timeAgo(d.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              {c && (
                                <Link
                                  to={`/campaign/${c.id}`}
                                  className="text-primary text-xs font-medium inline-flex items-center gap-1 hover:underline"
                                >
                                  View <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              {savedCampaigns.length === 0 ? (
                <EmptyState
                  title="Nothing saved yet"
                  sub="Tap the heart on any campaign to save it here."
                  cta="Browse campaigns"
                  onClick={() => nav("/browse")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedCampaigns.map((c) => (
                    <CampaignCard key={c.id} {...c} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub: string }) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs font-semibold mt-1">{label}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function EmptyState({ title, sub, cta, onClick }: { title: string; sub: string; cta: string; onClick: () => void }) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
      <div className="text-3xl mb-2">✨</div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{sub}</p>
      <Button onClick={onClick} className="rounded-full">
        {cta}
      </Button>
    </div>
  );
}

