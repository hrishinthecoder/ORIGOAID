import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  HandHeart,
  Landmark,
  Sparkles,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ImpactGlobe = lazy(() => import("@/components/three/ImpactGlobe"));

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 aurora-bg opacity-60" />
          <div className="container relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="chip mb-4">About OrigoAid</span>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
                A <span className="gradient-text">funding bridge</span>, built for Bangladesh.
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                OrigoAid is a non-profit crowdfunding platform connecting changemakers in Bangladesh with supporters
                here and abroad. From students chasing international competitions to families facing emergencies —
                we make it possible to raise what matters, from people who care.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark">
                  <Link to="/start-campaign">Start a campaign</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/browse">Browse campaigns</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/30 via-transparent to-transparent blur-3xl" />
              <Suspense fallback={null}>
                <ImpactGlobe />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Values */}
        <section id="trust" className="py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="chip mb-3">What we stand for</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                Trust first. Impact always.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified by design",
                  desc: "Every campaign is reviewed by our Board of Trustees within 24 hours. Verified organizers show a green badge.",
                },
                {
                  icon: HandHeart,
                  title: "0% platform fees",
                  desc: "We take nothing. Only payment gateways charge (~1.5-2%). 100% of your donation reaches the campaign.",
                },
                {
                  icon: Sparkles,
                  title: "AI where it helps",
                  desc: "Claude-powered description writing, tag suggestions, and a 24/7 bot for donors and organizers — never a gimmick.",
                },
              ].map((v) => (
                <div key={v.title} className="card-elevated p-7">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center mb-4">
                    <v.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-20 bg-secondary/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="chip mb-3">Partners</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance mb-3">
                Built with Bangladesh, for Bangladesh.
              </h2>
              <p className="text-muted-foreground">
                We work with payment providers, banks, telecoms, and government partners — none of whom own us.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-elevated p-7">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg font-bold">Transaction partners</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["bKash", "Nagad", "Upay", "Rocket", "Dutch-Bangla Bank", "BRAC Bank", "City Bank", "Prime Bank", "Grameenphone", "Banglalink"].map(
                    (p) => (
                      <span
                        key={p}
                        className="px-3 py-1.5 rounded-full bg-card border border-border font-mono text-xs"
                      >
                        {p}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="card-elevated p-7">
                <div className="flex items-center gap-3 mb-4">
                  <Landmark className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg font-bold">Verifying partners</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Ministry of Education", "Ministry of ICT", "BASIS", "BRAC", "ICDDR,B", "NGO Bureau"].map(
                    (p) => (
                      <span
                        key={p}
                        className="px-3 py-1.5 rounded-full bg-card border border-border font-mono text-xs"
                      >
                        {p}
                      </span>
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  OrigoAid is non-profit and independent. Our partners help with outreach and verification, not funding
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section id="payments" className="py-20">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <span className="chip mb-3">Payment methods</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                Pay your way. Anywhere in the world.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "bKash", sub: "Mobile wallet · ৳0-1 lakh/day", fee: "1.85%" },
                { name: "Nagad", sub: "Mobile wallet · ৳0-1 lakh/day", fee: "1.85%" },
                { name: "Upay", sub: "UCB mobile wallet", fee: "1.85%" },
                { name: "Rocket", sub: "DBBL mobile wallet", fee: "1.85%" },
                { name: "Card", sub: "Visa · Mastercard · Amex", fee: "2.9%" },
                { name: "Bank transfer", sub: "NPSB · BEFTN · 70+ banks", fee: "0.5%" },
                { name: "International", sub: "SWIFT · Wise · Revolut", fee: "3.5%" },
                { name: "QR scan", sub: "Any PayX QR app", fee: "1.85%" },
                { name: "EMI", sub: "3/6/12 months · select banks", fee: "+bank" },
              ].map((m) => (
                <div key={m.name} className="card-elevated p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-display font-bold">{m.name}</div>
                    <span className="text-xs font-mono text-primary">{m.fee}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{m.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">
              OrigoAid takes 0% platform fees. All charges above are gateway fees charged by the provider.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="help" className="py-20 bg-secondary/30">
          <div className="container max-w-3xl">
            <div className="text-center mb-12">
              <span className="chip mb-3">Help center</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Common questions</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="card-elevated px-5 border-0">
                  <AccordionTrigger className="text-left font-display font-bold py-5">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20">
          <div className="container max-w-4xl">
            <div className="card-elevated p-8 md:p-12 bg-gradient-to-br from-primary to-brand-emerald-dark text-primary-foreground">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Get in touch.</h2>
                  <p className="text-white/80 mb-6">
                    Questions, media inquiries, or partnership ideas — we'd love to hear from you.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" /> hello@origoaid.bd
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4" /> +880 1700 000 000
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4" /> Banani, Dhaka 1213, Bangladesh
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6">
                  <h3 className="font-display font-bold mb-3">Team</h3>
                  <div className="space-y-2 text-sm">
                    {["Operations · Dhaka", "Engineering · Remote", "Trust & Safety · Dhaka", "Partnerships · London"].map(
                      (t) => (
                        <div key={t} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> {t}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const FAQ = [
  {
    q: "Is OrigoAid really free?",
    a: "Yes. OrigoAid is a registered non-profit — we take 0% platform fees. Only payment gateways charge their own processing fees (roughly 1.5-3.5% depending on method). 100% of your donation after gateway fees reaches the campaign organizer.",
  },
  {
    q: "How are campaigns verified?",
    a: "Every campaign is reviewed within 24 hours by our Board of Trustees. Organizers submitting NID, organization letters, or institutional IDs get a verified green badge. High-value campaigns also go through a video verification step.",
  },
  {
    q: "Can I donate from outside Bangladesh?",
    a: "Absolutely — international cards, SWIFT, Wise, and Revolut are all supported. Foreign donors can also make recurring monthly donations. All currencies are converted at interbank rates; we cover the SWIFT fee for transfers above ৳5,000.",
  },
  {
    q: "How do organizers receive funds?",
    a: "Funds are disbursed to the organizer's verified bank account or mobile wallet weekly, or on-demand once the campaign closes. A public ledger shows every disbursement and receipts are posted as campaign updates.",
  },
  {
    q: "What happens if a campaign doesn't reach its goal?",
    a: "By default, organizers keep what they raise (flexible funding). Campaigns can opt into all-or-nothing funding, in which case unmet goals trigger automatic full refunds to all donors within 7 business days.",
  },
  {
    q: "Are my donations tax-deductible?",
    a: "Registered non-profit campaigns can issue NBR-compliant receipts that qualify for tax deduction in Bangladesh. International donors should consult their local tax authority — we provide full PDF receipts regardless.",
  },
];

