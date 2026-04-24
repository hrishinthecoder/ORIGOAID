import { Quote, Star } from "lucide-react";

const QUOTES = [
  {
    name: "Nusrat Jahan",
    role: "Donor · London",
    text: "As a Bangladeshi abroad, OrigoAid is the first platform I've truly trusted. I got photo updates from Sylhet within 72 hours of my donation.",
    color: "from-primary/10 to-accent/10",
  },
  {
    name: "Dr. Rafiq Islam",
    role: "Organizer · Kurigram",
    text: "We raised ৳7 lakh for our mobile clinic in 30 days. The AI description assistant helped our small team tell our story in a way that actually converted.",
    color: "from-brand-ocean/10 to-primary/10",
  },
  {
    name: "Anika Rahman",
    role: "Student · BUET",
    text: "My team and I represented Bangladesh at the World Robot Olympiad thanks to OrigoAid. 220+ strangers made our dream a reality.",
    color: "from-accent/10 to-brand-saffron/10",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="chip mb-3">Voices</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 text-balance">
            Trusted by donors and organizers across the globe.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <blockquote
              key={i}
              className={`relative card-elevated p-7 bg-gradient-to-br ${q.color}`}
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/20" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6">"{q.text}"</p>
              <footer className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">
                  {q.name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
