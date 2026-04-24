import { Link } from "react-router-dom";
import { Heart, Clock, MapPin, ShieldCheck, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/data/campaigns";
import { useStore } from "@/lib/store";
import { formatBDT, percent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props extends Partial<Campaign> {
  id: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  daysLeft: number;
  category: string;
  compact?: boolean;
}

export default function CampaignCard(props: Props) {
  const {
    id,
    title,
    description,
    image,
    raised,
    goal,
    daysLeft,
    category,
    location,
    organizerVerified,
    backers,
    compact,
  } = props;
  const { bookmarks, toggleBookmark } = useStore();
  const saved = bookmarks.includes(id);
  const p = percent(raised, goal);
  const urgent = daysLeft <= 7;

  return (
    <Link to={`/campaign/${id}`} className="block group">
      <article className="card-elevated overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              img.onerror = null;
              img.src = "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=800&h=600&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="backdrop-blur-md bg-white/90 dark:bg-black/70 text-xs font-semibold px-3 py-1 rounded-full">
              {category}
            </span>
            {urgent && (
              <span className="backdrop-blur-md bg-destructive/90 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" /> Urgent
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(id);
            }}
            className="absolute top-3 right-3 w-9 h-9 backdrop-blur-md bg-white/90 dark:bg-black/70 rounded-full grid place-items-center transition-transform hover:scale-110"
            aria-label="Save campaign"
          >
            <Heart className={cn("w-4 h-4 transition-colors", saved ? "fill-destructive text-destructive" : "text-foreground")} />
          </button>

          {location && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/95 text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {location}
            </div>
          )}
        </div>

        <div className={cn("flex flex-col gap-3 flex-1", compact ? "p-4" : "p-5")}>
          <h3 className={cn("font-display font-bold leading-tight line-clamp-2", compact ? "text-base" : "text-lg")}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{description}</p>

          <div className="space-y-2">
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${p}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-primary">{formatBDT(raised, { short: true })}</span>
              <span className="text-muted-foreground text-xs">raised of {formatBDT(goal, { short: true })}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {daysLeft}d left
            </span>
            {organizerVerified && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              {backers || 0} backers
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
