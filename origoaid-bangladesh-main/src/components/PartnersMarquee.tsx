const PARTNERS = [
  "bKash",
  "Nagad",
  "Upay",
  "Rocket",
  "Grameenphone",
  "Banglalink",
  "Dutch-Bangla Bank",
  "BRAC Bank",
  "City Bank",
  "Prime Bank",
  "Ministry of Education",
  "Ministry of ICT",
  "BASIS",
  "BRAC",
  "ICDDR,B",
];

export default function PartnersMarquee() {
  const row = [...PARTNERS, ...PARTNERS];
  return (
    <section className="py-10 border-y border-border bg-background overflow-hidden">
      <div className="container mb-6 flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          Trusted by partners across Bangladesh
        </p>
      </div>
      <div className="relative">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          {row.map((p, i) => (
            <span
              key={i}
              className="flex-shrink-0 font-display text-xl md:text-2xl font-bold text-muted-foreground/60 hover:text-primary transition-colors"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
