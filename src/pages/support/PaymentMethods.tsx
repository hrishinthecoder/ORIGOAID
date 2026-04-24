import { Link } from "react-router-dom";
import {
  Wallet,
  Smartphone,
  CreditCard,
  Building2,
  Globe,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const METHODS = [
  {
    icon: Smartphone,
    name: "bKash",
    category: "Mobile Wallet",
    fee: "1.85% gateway fee",
    clearing: "Instant",
    note: "Bangladesh's most-used mobile wallet. 30 Lakh+ agent points.",
    color: "from-pink-500/10 to-pink-500/5",
  },
  {
    icon: Smartphone,
    name: "Nagad",
    category: "Mobile Wallet",
    fee: "1.50% gateway fee",
    clearing: "Instant",
    note: "Govt-backed mobile financial service with wide rural reach.",
    color: "from-orange-500/10 to-orange-500/5",
  },
  {
    icon: Smartphone,
    name: "Rocket",
    category: "Mobile Wallet",
    fee: "1.80% gateway fee",
    clearing: "Instant",
    note: "Dutch-Bangla Bank's mobile banking service.",
    color: "from-violet-500/10 to-violet-500/5",
  },
  {
    icon: Smartphone,
    name: "Upay",
    category: "Mobile Wallet",
    fee: "1.75% gateway fee",
    clearing: "Instant",
    note: "UCB's mobile wallet — popular with younger donors.",
    color: "from-cyan-500/10 to-cyan-500/5",
  },
  {
    icon: CreditCard,
    name: "Credit / Debit Card",
    category: "Card",
    fee: "2.75% + BDT 5",
    clearing: "Instant",
    note: "Visa, Mastercard, American Express. BDT & USD both supported.",
    color: "from-blue-500/10 to-blue-500/5",
  },
  {
    icon: Building2,
    name: "Bank Transfer (EFT/RTGS)",
    category: "Bank",
    fee: "Flat BDT 15",
    clearing: "1 business day",
    note: "Best for large donations over BDT 50,000. All major BD banks supported.",
    color: "from-green-500/10 to-green-500/5",
  },
  {
    icon: Globe,
    name: "International Card",
    category: "Overseas",
    fee: "3.40% + USD 0.30",
    clearing: "Instant",
    note: "For donors outside Bangladesh — settled in BDT at the mid-market rate.",
    color: "from-amber-500/10 to-amber-500/5",
  },
];

export default function PaymentMethods() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <Wallet className="w-7 h-7" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Payment Methods</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              OrigoAid takes <strong className="text-primary">0% platform fees</strong>.
              Only your chosen gateway's fee applies — always shown before you confirm.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {METHODS.map((m) => (
              <div
                key={m.name}
                className={`card-elevated p-5 bg-gradient-to-br ${m.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-background grid place-items-center shrink-0 shadow-sm">
                    <m.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold">{m.name}</h3>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                        {m.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">{m.note}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" /> {m.clearing}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3" /> {m.fee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="card-elevated p-6 bg-gradient-to-br from-primary/5 to-accent/5 mb-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold mb-1">Your donation is safe</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All transactions are encrypted end-to-end. We never see or store your card details —
                  they're tokenised by our PCI-DSS-compliant payment partners. Refunds for fraudulent
                  campaigns are processed automatically within 5 business days.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark text-primary-foreground px-6 h-11 font-semibold shadow-lg"
            >
              Start donating →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
