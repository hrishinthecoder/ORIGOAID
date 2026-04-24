import { useState } from "react";
import {
  Flag,
  AlertTriangle,
  Shield,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup, RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "sonner";

const REASONS = [
  { id: "fraud",       label: "Suspected fraud or scam",             desc: "The campaign appears fake, impersonates someone, or is collecting funds deceptively" },
  { id: "misuse",      label: "Funds being misused",                 desc: "Evidence that money is not going to the stated cause" },
  { id: "ineligible",  label: "Ineligible purpose",                  desc: "Illegal activities, hate speech, or violations of our terms" },
  { id: "impersonate", label: "Impersonating a person or org",       desc: "Uses someone else's identity or brand without permission" },
  { id: "duplicate",   label: "Duplicate of another campaign",       desc: "The same cause is already running elsewhere" },
  { id: "other",       label: "Something else",                       desc: "Any other concern not listed above" },
];

export default function ReportCampaign() {
  const [campaignUrl, setCampaignUrl] = useState("");
  const [reason, setReason]           = useState("fraud");
  const [urgency, setUrgency]         = useState("normal");
  const [details, setDetails]         = useState("");
  const [anonymous, setAnonymous]     = useState("yes");
  const [email, setEmail]             = useState("");
  const [sending, setSending]         = useState(false);

  const submit = async () => {
    if (!details.trim()) {
      toast.error("Please describe what's wrong so we can investigate.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    toast.success(
      urgency === "high"
        ? "Report submitted. Our trust team is reviewing this immediately."
        : "Report submitted. Thanks for keeping OrigoAid safe.",
    );
    setCampaignUrl(""); setDetails(""); setReason("fraud"); setUrgency("normal");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive mb-4">
              <Flag className="w-7 h-7" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Report a Campaign</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Help us keep OrigoAid safe. All reports are reviewed by our trust team.
            </p>
          </header>

          <section className="card-elevated p-5 bg-gradient-to-br from-destructive/5 to-transparent mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-sm mb-1">When should I report?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Only report if a campaign looks fraudulent, violates our <a href="/about" className="text-primary hover:underline">guidelines</a>,
                  or misuses donated funds. Reports are confidential — the organizer won't know who filed them.
                </p>
              </div>
            </div>
          </section>

          <section className="card-elevated p-6 md:p-8 space-y-6">
            <div>
              <Label className="text-xs mb-1.5 block">Campaign URL or title</Label>
              <Input
                value={campaignUrl}
                onChange={(e) => setCampaignUrl(e.target.value)}
                placeholder="https://origoaid.bd/campaign/… or campaign name"
                className="h-11"
              />
            </div>

            <div>
              <Label className="text-xs mb-3 block">What's the issue?</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r.id}
                    htmlFor={r.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-secondary/40 transition-colors"
                  >
                    <RadioGroupItem id={r.id} value={r.id} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-xs mb-1.5 block">Details</Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what you've seen. Include dates, screenshots, or links if you can."
                rows={5}
                maxLength={1500}
              />
              <div className="text-[11px] text-muted-foreground text-right mt-1">
                {details.length} / 1500
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1.5 block">Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal — investigate in the next 48 hours</SelectItem>
                  <SelectItem value="high">High — ongoing harm or donor safety issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs mb-1.5 block">Submit as anonymous?</Label>
              <RadioGroup value={anonymous} onValueChange={setAnonymous} className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="yes" id="anon-yes" />
                  <span className="text-sm">Yes — keep me anonymous</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="no" id="anon-no" />
                  <span className="text-sm">No — contact me for follow-up</span>
                </label>
              </RadioGroup>
            </div>

            {anonymous === "no" && (
              <div>
                <Label className="text-xs mb-1.5 block">Your email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="h-11"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" /> Encrypted · Only the trust team sees reports
              </div>
              <Button
                onClick={submit}
                disabled={sending}
                className="rounded-full bg-gradient-to-r from-destructive to-destructive/80"
              >
                {sending ? "Submitting…" : (<><Shield className="w-4 h-4 mr-1.5" /> Submit report</>)}
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
