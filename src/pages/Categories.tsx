import { Link } from "react-router-dom";
import {
  GraduationCap,
  Stethoscope,
  Users,
  Siren,
  Rocket,
  Wheat,
  Leaf,
  Cpu,
  Trophy,
  Palette,
  HandHeart,
  Moon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { CampaignCategory } from "@/data/campaigns";
import { useStore } from "@/lib/store";
import { formatBDT } from "@/lib/format";

const CATS: {
  name: CampaignCategory;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  blurb: string;
}[] = [
  { name: "Education", icon: GraduationCap, color: "from-blue-500 to-blue-700", blurb: "Scholarships, books, schools, tutoring" },
  { name: "Healthcare", icon: Stethoscope, color: "from-rose-500 to-rose-700", blurb: "Treatment, clinics, vaccines, maternal care" },
  { name: "Community", icon: Users, color: "from-primary to-brand-emerald-dark", blurb: "Water, sanitation, infrastructure, roads" },
  { name: "Emergency", icon: Siren, color: "from-destructive to-red-800", blurb: "Flood, cyclone, fire — immediate relief" },
  { name: "Startup", icon: Rocket, color: "from-purple-500 to-purple-800", blurb: "Social ventures, founder funding" },
  { name: "Agriculture", icon: Wheat, color: "from-amber-500 to-amber-700", blurb: "Farming, cooperatives, climate-smart tools" },
  { name: "Environment", icon: Leaf, color: "from-emerald-500 to-emerald-700", blurb: "Trees, rivers, wildlife, climate" },
  { name: "Technology", icon: Cpu, color: "from-cyan-500 to-cyan-800", blurb: "Bootcamps, robotics, olympiads, devices" },
  { name: "Sports", icon: Trophy, color: "from-orange-500 to-orange-700", blurb: "Youth academies, equipment, teams abroad" },
  { name: "Arts", icon: Palette, color: "from-pink-500 to-pink-700", blurb: "Music, film, theatre, literature, heritage" },
  { name: "Charity", icon: HandHeart, color: "from-accent to-brand-saffron-deep", blurb: "EID, Puja, winter, food, clothing drives" },
  { name: "Religious", icon: Moon, color: "from-indigo-500 to-indigo-800", blurb: "Mosques, temples, churches, pilgrimage" },
];

export default function Categories() {
  const campaigns = useStore((s) => s.campaigns);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mb-10">
              <span className="chip mb-3">Categories</span>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-3 whitespace-nowrap">
                Every cause <span className="gradient-text">has a home</span>.
              </h1>
              <p className="text-lg text-muted-foreground">
                From winter drives in Dinajpur to robotics teams headed to Paris — here's how OrigoAid organizes
                what matters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATS.map((c) => {
                const items = campaigns.filter((x) => x.category === c.name);
                const raised = items.reduce((s, x) => s + x.raised, 0);
                return (
                  <Link
                    key={c.name}
                    to={`/browse?category=${c.name}`}
                    className="group card-elevated p-6 relative overflow-hidden"
                  >
                    <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <c.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1">{c.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{c.blurb}</p>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                      <span className="font-mono">
                        <span className="font-bold text-foreground">{items.length}</span> campaigns
                      </span>
                      <span className="font-mono text-primary font-semibold">
                        {formatBDT(raised, { short: true })} raised
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
    </div>
  );
}

