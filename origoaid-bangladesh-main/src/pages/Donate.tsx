import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, Heart, Share2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PaymentMethods, { METHODS } from "@/components/payments/PaymentMethods";
import MobileWalletForm from "@/components/payments/MobileWalletForm";
import CardForm from "@/components/payments/CardForm";
import BankForm from "@/components/payments/BankForm";
import { useStore } from "@/lib/store";
import { formatBDT, percent } from "@/lib/format";
import { Donation } from "@/data/campaigns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PRESETS = [500, 1000, 2500, 5000, 10000, 25000];

export default function Donate() {
  const { id } = useParams();
  const nav = useNavigate();
  const { campaigns, user, addDonation } = useStore();
  const campaign = campaigns.find((c) => c.id === id);

  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Donation["method"]>("bkash");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [donorName, setDonorName] = useState(user?.name || "");
  const [donorEmail, setDonorEmail] = useState(user?.email || "");
  const [paymentReady, setPaymentReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<Donation | null>(null);

  const effectiveAmount = Number(custom) > 0 ? Number(custom) : amount;
  const fee = useMemo(() => Math.round(effectiveAmount * feeRate(method) * 100) / 100, [effectiveAmount, method]);
  const total = effectiveAmount + fee;

  const canSubmit =
    effectiveAmount >= 50 && paymentReady && donorName && donorEmail;

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20 text-center container">
          <h1 className="font-display text-4xl font-bold mb-2">Campaign not found</h1>
          <Button asChild>
            <Link to="/browse">Browse campaigns</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const methodDef = METHODS.find((m) => m.id === method)!;

  const submit = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1600));
    const d = addDonation({
      campaignId: campaign.id,
      donorName: anonymous ? "Anonymous" : donorName,
      amount: effectiveAmount,
      method,
      message: message.trim() || undefined,
      anonymous,
    });
    setDone(d);
    setProcessing(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container max-w-xl">
            <div className="card-elevated p-10 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Thank you, {done.donorName}!</h1>
              <p className="text-muted-foreground mb-6">
                Your donation of <span className="font-bold text-primary">{formatBDT(done.amount)}</span> to{" "}
                <span className="font-semibold text-foreground">{campaign.title}</span> was successful.
              </p>
              <div className="rounded-xl bg-secondary/50 p-4 text-left text-sm space-y-1 mb-6">
                <Row label="Transaction ID" value={done.id.toUpperCase().slice(0, 12)} mono />
                <Row label="Method" value={methodDef.name} />
                <Row label="Amount" value={formatBDT(done.amount)} />
                <Row label="Gateway fee" value={formatBDT(fee)} />
                <Row label="Date" value={new Date(done.createdAt).toLocaleString()} />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={() => nav(`/campaign/${campaign.id}`)} className="rounded-full">
                  Back to campaign
                </Button>
                <Button variant="outline" onClick={() => nav("/dashboard#donations")} className="rounded-full">
                  <Heart className="w-4 h-4 mr-1.5" /> My donations
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/campaign/${campaign.id}`);
                    toast.success("Campaign link copied");
                  }}
                >
                  <Share2 className="w-4 h-4 mr-1.5" /> Share campaign
                </Button>
              </div>
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
        <div className="container max-w-6xl">
          <button onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to campaign
          </button>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-6">
              <header>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Support this campaign</h1>
                <p className="text-muted-foreground">
                  Your contribution goes directly to <span className="font-semibold text-foreground">{campaign.title}</span>.
                </p>
              </header>

              <section className="card-elevated p-6">
                <h2 className="font-display text-xl font-bold mb-4">1. Choose an amount</h2>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setAmount(p);
                        setCustom("");
                      }}
                      className={cn(
                        "rounded-xl border-2 py-3 px-2 text-center transition-all",
                        amount === p && !custom
                          ? "border-primary bg-primary/5 font-bold"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="font-display text-lg font-bold">{formatBDT(p, { short: true })}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Or enter a custom amount</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-primary">৳</span>
                    <Input
                      inputMode="numeric"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
                      placeholder="Any amount, min ৳50"
                      className="pl-8 h-12 text-lg font-mono"
                    />
                  </div>
                </div>
              </section>

              <section className="card-elevated p-6">
                <h2 className="font-display text-xl font-bold mb-4">2. Payment method</h2>
                <PaymentMethods value={method} onChange={(m) => { setMethod(m); setPaymentReady(false); }} />
                <div className="mt-5">
                  {method === "bkash" && (
                    <MobileWalletForm provider="bKash" providerColor="from-[#E2136E] to-[#b50e5a]" onReady={setPaymentReady as any} />
                  )}
                  {method === "nagad" && (
                    <MobileWalletForm provider="Nagad" providerColor="from-[#ec1c24] to-[#a80007]" onReady={setPaymentReady as any} />
                  )}
                  {method === "upay" && (
                    <MobileWalletForm provider="Upay" providerColor="from-[#00a651] to-[#006a33]" onReady={setPaymentReady as any} />
                  )}
                  {method === "rocket" && (
                    <MobileWalletForm provider="Rocket" providerColor="from-[#8a32a4] to-[#531e63]" onReady={setPaymentReady as any} />
                  )}
                  {method === "card" && <CardForm onReady={setPaymentReady as any} />}
                  {method === "bank" && <BankForm onReady={setPaymentReady as any} />}
                  {method === "international" && <BankForm international onReady={setPaymentReady as any} />}
                </div>
              </section>

              <section className="card-elevated p-6">
                <h2 className="font-display text-xl font-bold mb-4">3. Your details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">Full name</Label>
                    <Input
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="As you want it shown publicly"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Email (for receipt)</Label>
                    <Input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-xs mb-1.5 block">Message for the organizer (optional)</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your reason, or leave a word of encouragement."
                    rows={3}
                    maxLength={250}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Checkbox id="anon" checked={anonymous} onCheckedChange={(v) => setAnonymous(!!v)} />
                  <label htmlFor="anon" className="text-sm cursor-pointer">
                    Donate anonymously (your name won't appear publicly)
                  </label>
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit space-y-4">
              <div className="card-elevated p-5">
                <div className="flex gap-3 mb-4">
                  <img src={campaign.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Supporting</div>
                    <div className="font-bold text-sm leading-tight line-clamp-2">{campaign.title}</div>
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-2">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${percent(campaign.raised, campaign.goal)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatBDT(campaign.raised, { short: true })} raised</span>
                  <span>of {formatBDT(campaign.goal, { short: true })}</span>
                </div>
              </div>

              <div className="card-elevated p-5 space-y-2">
                <h3 className="font-display font-bold mb-2">Summary</h3>
                <Row label="Donation" value={effectiveAmount ? formatBDT(effectiveAmount) : "—"} />
                <Row label={`Gateway fee (${(feeRate(method) * 100).toFixed(1)}%)`} value={formatBDT(fee)} />
                <div className="pt-2 border-t border-border flex justify-between text-base">
                  <span className="font-bold">You pay</span>
                  <span className="font-display font-bold text-primary text-xl">{formatBDT(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Reaches campaign</span>
                  <span className="font-mono">{formatBDT(effectiveAmount)}</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border">
                  OrigoAid takes <span className="font-bold text-primary">0%</span> platform fees. Only payment gateways charge.
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={!canSubmit || processing}
                size="lg"
                className="w-full rounded-full h-12 bg-gradient-to-r from-primary to-brand-emerald-dark btn-primary-glow text-base font-bold"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" /> Donate {effectiveAmount ? formatBDT(effectiveAmount, { short: true }) : ""}
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground px-4">
                Secured by 256-bit TLS encryption. You'll receive a receipt at {donorEmail || "your email"}.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function feeRate(m: Donation["method"]) {
  switch (m) {
    case "bkash":
    case "nagad":
    case "upay":
    case "rocket":
      return 0.0185;
    case "card":
      return 0.029;
    case "bank":
      return 0.005;
    case "international":
      return 0.035;
    default:
      return 0.02;
  }
}

