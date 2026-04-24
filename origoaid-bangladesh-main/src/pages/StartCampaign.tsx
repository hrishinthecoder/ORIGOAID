import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, ArrowRight, CheckCircle2, Sparkles, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DescriptionGenerator from "@/components/ai/DescriptionGenerator";
import { useStore } from "@/lib/store";
import { Campaign, CampaignCategory, ProfileType } from "@/data/campaigns";
import { slugify, formatBDT } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


const CATEGORIES: CampaignCategory[] = [
  "Education",
  "Healthcare",
  "Community",
  "Emergency",
  "Startup",
  "Agriculture",
  "Environment",
  "Technology",
  "Sports",
  "Arts",
  "Charity",
  "Religious",
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=800&fit=crop",
];

export default function StartCampaign() {
  const nav = useNavigate();
  const { isAuthed, user, createCampaign } = useStore();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CampaignCategory | "">("");
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [organizer, setOrganizer] = useState(user?.name || "");
  const [organizerType, setOrganizerType] = useState<ProfileType>(user?.profileType || "Individual");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [image, setImage] = useState(FALLBACK_IMAGES[0]);
  const [submitting, setSubmitting] = useState(false);

  const steps = ["Basics", "Story", "Media & Review"];

  const canNext = useMemo(() => {
    if (step === 1) return title.length >= 5 && category && location && Number(goal) > 0;
    if (step === 2) return description.length >= 20 && longDescription.length >= 50;
    return true;
  }, [step, title, category, location, goal, description, longDescription]);

  const submit = async () => {
    if (!isAuthed) {
      toast.info("Please sign in to launch a campaign.");
      nav("/login");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const id = slugify(title);
    const payload = {
      id,
      title,
      description,
      longDescription,
      image,
      goal: Number(goal),
      daysLeft: Number(duration),
      category: category as CampaignCategory,
      organizer,
      organizerType,
      organizerVerified: false,
      location,
      featured: false,
    } satisfies Omit<Campaign, "raised" | "backers" | "status" | "createdAt">;
    createCampaign(payload);
    setSubmitting(false);
    toast.success("Campaign submitted! Under review — approved within 24h.");
    nav(`/campaign/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container max-w-5xl">
          <header className="mb-8">
            <span className="chip mb-3">Launch</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Start your campaign</h1>
            <p className="text-muted-foreground">Tell your story. We'll help the right people find it.</p>
          </header>

          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full grid place-items-center text-sm font-bold shrink-0 border-2 transition-all",
                      done
                        ? "bg-primary text-primary-foreground border-primary"
                        : active
                        ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/30"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : n}
                  </div>
                  <div className={cn("text-sm font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
                    {s}
                  </div>
                  {i < steps.length - 1 && <div className={cn("flex-1 h-0.5", done ? "bg-primary" : "bg-border")} />}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card-elevated p-6 md:p-8 space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <Label className="text-sm mb-2 block font-semibold">Campaign title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Help Barisal students compete at WRO Finals"
                      className="h-12"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-semibold">Category</Label>
                      <Select value={category} onValueChange={(v) => setCategory(v as CampaignCategory)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Pick one" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-semibold">Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Dhaka, Sylhet, Kurigram…"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-semibold">Fundraising goal (BDT)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-primary">৳</span>
                        <Input
                          value={goal}
                          onChange={(e) => setGoal(e.target.value.replace(/\D/g, ""))}
                          placeholder="500000"
                          className="h-12 pl-8 font-mono"
                        />
                      </div>
                      {goal && (
                        <div className="text-xs text-muted-foreground mt-1">{formatBDT(Number(goal))}</div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-semibold">Duration (days)</Label>
                      <Input
                        value={duration}
                        onChange={(e) => setDuration(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="30"
                        className="h-12 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-semibold">Organizer name</Label>
                      <Input
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        placeholder="Your name or organization"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-semibold">Profile type</Label>
                      <Select value={organizerType} onValueChange={(v) => setOrganizerType(v as ProfileType)}>
                        <SelectTrigger className="h-12">
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
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label className="text-sm mb-2 block font-semibold">Short description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="One compelling sentence shown on campaign cards."
                      rows={2}
                      maxLength={200}
                    />
                    <div className="text-[11px] text-muted-foreground text-right mt-1">
                      {description.length} / 200
                    </div>
                  </div>

                  <DescriptionGenerator
                    input={{
                      title,
                      category: category || "General",
                      location,
                      goal: Number(goal) || undefined,
                      notes: description,
                    }}
                    onUse={(t) => setLongDescription(t)}
                  />

                  <div>
                    <Label className="text-sm mb-2 block font-semibold">Full story</Label>
                    <Textarea
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      placeholder="Tell donors why this matters. What's the problem, your plan, the people involved, and how funds will be used."
                      rows={12}
                      className="font-sans"
                    />
                    <div className="text-[11px] text-muted-foreground text-right mt-1">
                      {longDescription.length} characters
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <Label className="text-sm mb-2 block font-semibold">Cover image</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {FALLBACK_IMAGES.map((src) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setImage(src)}
                          className={cn(
                            "rounded-xl overflow-hidden border-2 aspect-video transition-all",
                            image === src ? "border-primary shadow-lg" : "border-border opacity-70 hover:opacity-100"
                          )}
                        >
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <div className="rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors p-6 text-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-sm font-medium">Upload a custom cover</div>
                      <div className="text-xs text-muted-foreground">
                        (Demo: pick from presets above — file upload requires storage backend)
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4 bg-secondary/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="font-display font-bold">Preview</h3>
                    </div>
                    <div className="card-elevated overflow-hidden">
                      <div className="relative aspect-[16/9]">
                        <img src={image} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 text-foreground px-3 py-1 rounded-full">
                          {category || "Category"}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-display text-xl font-bold">{title || "Campaign title"}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{description || "Your short description appears here."}</p>
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                          <span className="font-bold text-primary">{formatBDT(0, { short: true })} raised</span>
                          <span className="text-xs text-muted-foreground">
                            of {goal ? formatBDT(Number(goal), { short: true }) : "৳0"} · {duration}d left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                >
                  Back
                </Button>
                {step < 3 ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit for review"}
                  </Button>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="card-elevated p-5">
                <h3 className="font-display font-bold mb-3">Before you launch</h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    "Write a compelling, specific title",
                    "Include real photos when you can",
                    "Break down how funds will be used",
                    "Link social proof (news, videos, letters)",
                    "Reply to comments within 24h",
                  ].map((t) => (
                    <li key={t} className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-elevated p-5 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="font-display font-bold mb-2">Verification boosts trust</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload NID, organization docs, or institution letter to get a verified badge.
                </p>
                <Button variant="outline" size="sm" className="rounded-full w-full">
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Add documents later
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      
    </div>
  );
}

