import { Link } from "react-router-dom";
import {
  LifeBuoy,
  Heart,
  Shield,
  Wallet,
  User,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TOPICS = [
  { icon: Heart,  title: "Donating",   desc: "Payment methods, refunds, and receipts",      to: "/payments" },
  { icon: User,   title: "My account", desc: "Profile, verification, followers, privacy",    to: "/profile" },
  { icon: Shield, title: "Trust & safety", desc: "How we verify campaigns and protect you",  to: "/about" },
  { icon: MessageCircle, title: "Contact support", desc: "Talk to a human from the OrigoAid team", to: "/contact" },
  { icon: AlertTriangle, title: "Report a campaign", desc: "Flag content that violates our rules", to: "/report" },
  { icon: Wallet, title: "For organizers", desc: "Launch, fundraise, disburse funds",       to: "/start-campaign" },
];

const FAQS = [
  {
    q: "How do I know a campaign is legitimate?",
    a: "Every campaign with a green Verified badge has been reviewed by our trust team and the organizer has completed KYC (NID, passport, or organization registration). You can also browse the organizer's full history on their profile.",
  },
  {
    q: "What percentage of my donation reaches the campaign?",
    a: "100%. OrigoAid charges 0% platform fees. Only payment-gateway fees (bKash/Nagad/card) apply, and those are fully displayed before you confirm.",
  },
  {
    q: "How do refunds work?",
    a: "If a campaign is found to be fraudulent before its deadline, 100% of your donation is refunded automatically within 5 business days. After funds are disbursed to the organizer, refunds depend on the organizer's policy.",
  },
  {
    q: "Can I donate anonymously?",
    a: "Yes — toggle 'Donate anonymously' on the payment screen. Your name will not appear on the donor list or be shared with the organizer.",
  },
  {
    q: "How do I get verified as an organizer?",
    a: "Go to your Profile → Get verified, then upload your NID, passport, or organization registration. Most applications are reviewed within 48 hours.",
  },
  {
    q: "What happens if a campaign doesn't reach its goal?",
    a: "Campaigns on OrigoAid are keep-what-you-raise by default. The organizer receives whatever was raised, minus gateway fees, on the deadline.",
  },
  {
    q: "Are donations tax-deductible?",
    a: "For eligible registered charities in Bangladesh, donations are tax-deductible under section 44(2) of the ITO. You'll receive a tax-compliant receipt by email within 24 hours of donating.",
  },
  {
    q: "How do I follow an organizer?",
    a: "On any campaign page, click the organizer's name to visit their profile, then tap Follow. Their new campaigns and updates will appear in your Activity feed.",
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Help Center</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Answers to the most common questions — and a direct line to our team if you need more.
            </p>
          </header>

          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {TOPICS.map((t) => (
              <Link
                key={t.title}
                to={t.to}
                className="card-elevated p-5 hover-lift block"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3">
                  <t.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold mb-1">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </Link>
            ))}
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-5">Frequently asked</h2>
            <Accordion type="single" collapsible className="card-elevated px-4">
              {FAQS.map((f, i) => (
                <AccordionItem value={`q${i}`} key={i} className="border-border">
                  <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="text-center mt-12 card-elevated p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="font-display text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team responds within one business day.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark text-primary-foreground px-6 h-11 font-semibold shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> Contact support
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
