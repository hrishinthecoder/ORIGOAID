import { useState } from "react";
import { Sparkles, Wand2, Tags, Loader2, Copy, Check, Brain, Zap, ShieldCheck, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateCampaignDescription, suggestCampaignTags } from "@/lib/ai";
import { CampaignCategory } from "@/data/campaigns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: CampaignCategory[] = [
  "Education", "Healthcare", "Community", "Emergency", "Startup", 
  "Agriculture", "Environment", "Technology", "Sports", "Arts", "Charity", "Religious"
];

export default function AIStudio() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-emerald/30">
      <Navbar />
      <main className="pt-24 md:pt-32 pb-20">
        <section className="relative px-4">
          {/* Theme-Adaptive Animated Gradients */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 right-[10%] w-[40%] h-[40%] bg-brand-emerald/10 blur-[150px] rounded-full" 
            />
            <motion.div 
              animate={{ x: [0, -50, 0], y: [0, -30, 0], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute bottom-0 left-[10%] w-[40%] h-[40%] bg-brand-red/5 blur-[150px] rounded-full" 
            />
          </div>

          <div className="container max-w-7xl relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border mb-6 backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-emerald animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Autonomous Creative Engine</span>
              </motion.div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tighter leading-tight md:leading-[0.85]">
                Write. <span className="text-brand-emerald italic">Tag</span>. Launch.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Transform your mission into a high-impact campaign with our specialized neural models.
              </p>
            </div>

            <div className="grid lg:grid-cols-[1fr,320px] gap-8 items-stretch">
              {/* Main Interaction Hub */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/50 backdrop-blur-3xl border border-border rounded-[32px] md:rounded-[48px] p-1 shadow-xl overflow-hidden"
              >
                <Tabs defaultValue="desc" className="h-full flex flex-col">
                  <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
                    <TabsList className="bg-muted rounded-2xl h-12 md:h-14 p-1.5 gap-1.5 border border-border w-full md:w-fit">
                      <TabsTrigger value="desc" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 h-full data-[state=active]:bg-brand-emerald data-[state=active]:text-white transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        Builder
                      </TabsTrigger>
                      <TabsTrigger value="tags" className="flex-1 md:flex-none rounded-xl px-4 md:px-8 h-full data-[state=active]:bg-brand-emerald data-[state=active]:text-white transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        Tags
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1">
                    <TabsContent value="desc" className="p-6 md:p-8 mt-0 focus-visible:outline-none">
                      <DescriptionTool />
                    </TabsContent>
                    <TabsContent value="tags" className="p-6 md:p-8 mt-0 focus-visible:outline-none">
                      <TagTool />
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>

              {/* Sidebar: Integrated and Responsive */}
              <div className="flex flex-col gap-6 md:gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-8 rounded-[32px] md:rounded-[40px] bg-card/50 border border-border backdrop-blur-3xl flex-1 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald shadow-sm">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural Feed</div>
                        <div className="text-xs font-bold text-brand-emerald">Live Processing</div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <StatRow label="Inference" value="1.2s" icon={Zap} color="text-yellow-500" />
                      <StatRow label="Accuracy" value="99.8%" icon={ShieldCheck} color="text-brand-emerald" />
                      <StatRow label="Capacity" value="128k" icon={Activity} color="text-blue-500" />
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-border">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                      Efficiency
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "94%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-brand-emerald"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 rounded-[32px] md:rounded-[40px] bg-brand-emerald/[0.03] border border-brand-emerald/10 relative overflow-hidden group shadow-sm"
                >
                   <h4 className="text-[10px] font-black mb-3 text-brand-emerald uppercase tracking-[0.2em]">Optimization</h4>
                   <p className="text-xs leading-relaxed text-muted-foreground font-medium italic">
                     "Adding district names like 'Sylhet' or 'Dhaka' increases localized trust by 40%."
                   </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StatRow({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center transition-colors group-hover:bg-muted/80">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-xs text-muted-foreground font-medium tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-mono font-bold text-foreground/80">{value}</span>
    </div>
  );
}

function DescriptionTool() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CampaignCategory | "">("");
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!title || !category) {
      toast.error("Add a title and category to get started.");
      return;
    }
    setLoading(true);
    try {
      const text = await generateCampaignDescription({ title, category, location, goal: Number(goal) || undefined, notes });
      setOutput(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr,1.2fr] gap-10 md:gap-12">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2.5">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Clean water for Sylhet" className="h-12 md:h-14 bg-muted border-border rounded-2xl focus:border-brand-emerald/30 transition-all text-sm px-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as CampaignCategory)}>
                <SelectTrigger className="h-12 md:h-14 bg-muted border-border rounded-2xl text-sm px-6">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border text-foreground rounded-2xl">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-xl focus:bg-brand-emerald focus:text-white py-3">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="District..." className="h-12 md:h-14 bg-muted border-border rounded-2xl text-sm px-6" />
            </div>
          </div>
          <div className="space-y-2.5">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Context</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the urgency and beneficiaries..."
              rows={5}
              className="bg-muted border-border rounded-2xl resize-none text-sm p-6 focus:border-brand-emerald/30 transition-all leading-relaxed"
            />
          </div>
        </div>
        <Button onClick={generate} disabled={loading} className="w-full h-14 md:h-16 rounded-2xl bg-brand-emerald hover:bg-brand-emerald-dark shadow-xl shadow-brand-emerald/10 transition-all font-bold text-sm tracking-widest uppercase">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span className="ml-3">Run Engine</span>
        </Button>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-3 ml-1 lg:absolute lg:-top-10 lg:left-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping" />
          <Label className="text-[10px] uppercase tracking-[0.2em] text-brand-emerald font-black">AI Output</Label>
        </div>
        <div className="relative h-full min-h-[400px] md:min-h-[480px] rounded-[32px] bg-background border border-border p-6 md:p-8 overflow-y-auto custom-scrollbar shadow-inner">
          <AnimatePresence mode="wait">
            {output ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-[13px] text-foreground/80 leading-[1.8] whitespace-pre-line font-medium">
                {output}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-20">
                <Wand2 className="w-12 h-12 mb-6" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black">Awaiting Processing...</p>
              </div>
            )}
          </AnimatePresence>

          {output && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="absolute top-6 right-6 p-2.5 rounded-xl bg-muted border border-border hover:bg-brand-emerald hover:text-white transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TagTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const go = async () => {
    if (!title || !desc) {
      toast.error("Add a title and description first.");
      return;
    }
    setLoading(true);
    try {
      const t = await suggestCampaignTags(title, desc);
      setTags(t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign title..." className="h-12 md:h-14 bg-muted border-border rounded-2xl px-6 text-sm" />
        </div>
        <div className="space-y-2.5">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Description</Label>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Paste description here..." rows={8} className="bg-muted border-border rounded-2xl p-6 text-sm leading-relaxed resize-none" />
        </div>
      </div>
      <Button onClick={go} disabled={loading} className="px-10 h-14 md:h-16 rounded-2xl bg-brand-emerald hover:bg-brand-emerald-dark transition-all text-sm font-bold tracking-widest uppercase shadow-lg">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tags className="w-5 h-5" />}
        <span className="ml-3">Extract Tags</span>
      </Button>
      {tags.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3 pt-6">
          {tags.map((t) => (
            <span key={t} className="px-5 py-2.5 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-[11px] font-black uppercase tracking-wider">
              #{t}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
