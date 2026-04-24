import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CampaignCard from "./CampaignCard";
import { useStore } from "@/lib/store";

export default function FeaturedCampaigns() {
  const campaigns = useStore((s) => s.campaigns);
  const featured = campaigns.filter((c) => c.featured).slice(0, 6);
  const list = featured.length ? featured : campaigns.slice(0, 6);

  return (
    <section id="campaigns" className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <span className="chip mb-3">Featured</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 text-balance">
              Real stories. Real impact.
            </h2>
            <p className="text-muted-foreground text-lg">
              Hand-picked campaigns from across Bangladesh — all verified by our trust team.
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full group self-start md:self-auto">
            <Link to="/browse">
              View all campaigns
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <CampaignCard key={c.id} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
