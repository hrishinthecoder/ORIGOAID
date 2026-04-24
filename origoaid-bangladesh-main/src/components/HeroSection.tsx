import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, Shield, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT } from "@/lib/format";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { lazy, Suspense } from "react";

const Hero3DScene = lazy(() => import("./three/Hero3DScene"));

export default function HeroSection() {
  const campaigns = useStore((s) => s.campaigns);
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalBackers = campaigns.reduce((sum, c) => sum + (c.backers || 0), 0);

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 aurora-bg" />
      <div className="absolute inset-0 mesh-grid opacity-40" />
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="absolute right-0 top-0 w-full md:w-[55%] h-[520px] md:h-[700px] pointer-events-none md:pointer-events-auto">
        <div className="w-full h-full flex items-center justify-center mt-16 md:mt-24">
          <Suspense fallback={<div className="w-full h-full" />}>
            <Hero3DScene />
          </Suspense>
        </div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <Reveal as="span" className="chip mb-6 inline-flex">
            <Sparkles className="w-3 h-3" />
            Bangladesh's crowdfunding platform
          </Reveal>

          <Reveal delay={1} as="h1" className="font-display text-5xl md:text-7xl font-normal leading-[1.02] text-balance mb-6 mt-4">
            Fund what <br />
            <span className="relative inline-block">
              <span className="shimmer-text italic">matters most</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 Q 75 1 150 5 T 298 3"
                  stroke="hsl(var(--accent))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            in Bangladesh.
          </Reveal>

          <Reveal delay={2} as="p" className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
            From Sylhet's villages to Dhaka's rooftops — raise funds for students bound for international
            competitions, medical emergencies, community projects, and the causes closest to your heart.
          </Reveal>

          <Reveal delay={3} className="flex flex-wrap gap-3 mb-10">
            <Button asChild size="lg" className="rounded-full px-7 h-12 bg-gradient-to-r from-primary to-brand-emerald-dark shadow-xl shadow-primary/30 btn-primary-glow">
              <Link to="/browse">
                Explore Campaigns
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12 border-2">
              <Link to="/start-campaign">
                <Heart className="w-4 h-4 mr-2" />
                Start Fundraising
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={4} className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-bold">Verified</div>
                <div className="text-xs text-muted-foreground">every campaign</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 grid place-items-center">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="font-bold">0% platform fees</div>
                <div className="text-xs text-muted-foreground">100% to campaign</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-ocean/20 grid place-items-center">
                <Heart className="w-4 h-4 text-brand-ocean" />
              </div>
              <div>
                <div className="font-bold">bKash · Nagad</div>
                <div className="text-xs text-muted-foreground">card · bank · intl</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          {[
            { label: "Raised all-time", node: <CountUp to={totalRaised} format={(n) => formatBDT(n, { short: true })} /> },
            { label: "Active campaigns", node: <CountUp to={campaigns.length} /> },
            { label: "Donors reached", node: <CountUp to={totalBackers} format={(n) => `${(n / 1000).toFixed(1)}K+`} /> },
            { label: "Districts covered", node: <CountUp to={64} suffix="" /> },
          ].map((s, i) => (
            <Reveal key={s.label} delay={(i + 1) as 1 | 2 | 3 | 4} className="glass rounded-2xl p-4 border-primary/10 hover-lift">
              <div className="font-display text-3xl md:text-4xl font-normal text-primary">{s.node}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
