import { Link } from "react-router-dom";
import { Facebook, Twitter, Mail, MapPin, Phone, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";

const cols = [
  {
    title: "Platform",
    links: [
      { label: "Browse Campaigns", to: "/browse" },
      { label: "Start a Campaign", to: "/start-campaign" },
      { label: "Categories", to: "/categories" },
      { label: "AI Studio", to: "/ai" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About OrigoAid", to: "/about" },
      { label: "Trust & Safety", to: "/about#trust" },
      { label: "Partnerships", to: "/about#partners" },
      { label: "Press", to: "/about#press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Payment Methods", to: "/payments" },
      { label: "Contact Us", to: "/contact" },
      { label: "Report a Campaign", to: "/report" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-background to-secondary/40 mt-10">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 max-w-xs leading-relaxed">
              OrigoAid is a non-profit crowdfunding platform connecting Bangladeshi
              causes with supporters in Bangladesh and worldwide.
            </p>

            <div className="flex gap-2 mt-5">
              {[Facebook, Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-card border border-border grid place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Banani, Dhaka 1213, Bangladesh
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> +880 1700 000 000
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> hello@origoaid.bd
              </div>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} OrigoAid Bangladesh. Building a funding bridge.</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span>Trusted by</span>
              {["bKash", "Nagad", "Upay", "Rocket", "Dutch-Bangla", "City Bank"].map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-full bg-card border border-border font-mono text-[10px] uppercase tracking-wider"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
