export const formatBDT = (n: number, opts: { short?: boolean; symbol?: boolean } = {}) => {
  const symbol = opts.symbol === false ? "" : "৳";
  if (opts.short) {
    if (n >= 1_00_00_000) return `${symbol}${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `${symbol}${(n / 1_00_000).toFixed(2)} L`;
    if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(1)}K`;
  }
  return `${symbol}${n.toLocaleString("en-IN")}`;
};

export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7);

export const percent = (raised: number, goal: number) =>
  Math.min(100, Math.round((raised / Math.max(1, goal)) * 100));
