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
import { CampaignCategory } from "@/data/campaigns";

const CATS: { name: CampaignCategory; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { name: "Education", icon: GraduationCap, color: "from-blue-500 to-blue-700" },
  { name: "Healthcare", icon: Stethoscope, color: "from-rose-500 to-rose-700" },
  { name: "Community", icon: Users, color: "from-primary to-brand-emerald-dark" },
  { name: "Emergency", icon: Siren, color: "from-destructive to-red-800" },
  { name: "Startup", icon: Rocket, color: "from-purple-500 to-purple-800" },
  { name: "Agriculture", icon: Wheat, color: "from-amber-500 to-amber-700" },
  { name: "Environment", icon: Leaf, color: "from-emerald-500 to-emerald-700" },
  { name: "Technology", icon: Cpu, color: "from-cyan-500 to-cyan-800" },
  { name: "Sports", icon: Trophy, color: "from-orange-500 to-orange-700" },
  { name: "Arts", icon: Palette, color: "from-pink-500 to-pink-700" },
  { name: "Charity", icon: HandHeart, color: "from-accent to-brand-saffron-deep" },
  { name: "Religious", icon: Moon, color: "from-indigo-500 to-indigo-800" },
];

export default function CategoryStrip() {
  return (
    <section className="py-16 border-y border-border bg-secondary/30">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="chip mb-2">Categories</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Browse by what matters to you</h2>
          </div>
          <Link to="/categories" className="text-sm font-medium text-primary hover:underline hidden md:block">
            All categories →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {CATS.map((c) => (
            <Link
              key={c.name}
              to={`/browse?category=${c.name}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-card transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-transform`}
              >
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-center leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
