// OrigoAid AI helper. Uses Anthropic's Messages API when VITE_ANTHROPIC_API_KEY is
// set, otherwise falls back to a deterministic local generator so the demo still
// works. In production, proxy this through your own server so the API key never
// ships to the browser.

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

export const hasAIKey = () => Boolean(API_KEY);

async function callClaude(system: string, user: string, maxTokens = 800): Promise<string> {
  if (!API_KEY) throw new Error("no-key");
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API: ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text?.trim() || "";
}

export interface GenerateCampaignInput {
  title: string;
  category: string;
  location?: string;
  goal?: number;
  notes?: string;
}

const localCampaignTemplates = (input: GenerateCampaignInput) => {
  const { title, category, location, goal, notes } = input;
  const loc = location ? ` in ${location}` : "";
  const goalStr = goal ? ` with a goal of ৳${goal.toLocaleString("en-IN")}` : "";
  return `${title}${loc} is a ${category.toLowerCase()} initiative${goalStr} that directly addresses a pressing community need. Every contribution — no matter how small — becomes part of a larger story of impact.

**Why this matters**
${notes || "Families in this community face daily challenges that patient, focused effort can solve. Your support moves the needle from hardship to hope."}

**How your donation is used**
- 70% goes directly to program costs (materials, equipment, training)
- 20% funds local coordinators who make sure work happens on the ground
- 10% covers transparent reporting and verification so you see every taka at work

**The people behind this**
We are a community-rooted team with deep local knowledge. Our track record is public, our updates are frequent, and our commitment is long-term.

Join us. A stronger Bangladesh is built one campaign at a time.`;
};

export async function generateCampaignDescription(input: GenerateCampaignInput): Promise<string> {
  if (!hasAIKey()) return localCampaignTemplates(input);
  try {
    const system =
      "You are a warm, persuasive crowdfunding copywriter for OrigoAid, a Bangladesh-focused platform. Write in clear, hopeful English with Bangladeshi cultural context. Use the BDT symbol ৳. Keep 200-350 words. Use markdown with 2-3 short sections and light bold for emphasis.";
    const user = `Write a compelling campaign description.
Title: ${input.title}
Category: ${input.category}
${input.location ? `Location: ${input.location}` : ""}
${input.goal ? `Goal: ৳${input.goal.toLocaleString("en-IN")}` : ""}
${input.notes ? `Additional context: ${input.notes}` : ""}

Return only the description body — no headline, no preamble.`;
    const out = await callClaude(system, user, 900);
    return out || localCampaignTemplates(input);
  } catch {
    return localCampaignTemplates(input);
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const localChatReply = (messages: ChatMessage[]): string => {
  const last = messages[messages.length - 1]?.content.toLowerCase() || "";
  if (last.includes("bkash") || last.includes("nagad") || last.includes("payment")) {
    return "You can donate via bKash, Nagad, Upay, Rocket, any Bangladeshi bank card, or international Visa/Mastercard. Foreign donors can also use SWIFT bank transfer. All transactions are encrypted end-to-end.";
  }
  if (last.includes("start") || last.includes("create") || last.includes("campaign")) {
    return "To start a campaign: click 'Start a Campaign' in the nav, choose your profile type (Individual, Organization, or Group), fill in title/category/goal, and submit. Our review team approves within 24 hours. You can use our AI assistant to help write a great description.";
  }
  if (last.includes("fee") || last.includes("cost") || last.includes("charge")) {
    return "OrigoAid is a non-profit — we don't take any platform fees. Only standard payment gateway charges apply (≈1.5-2% depending on method). 100% of your donation after gateway fees reaches the campaign.";
  }
  if (last.includes("verify") || last.includes("trust") || last.includes("scam")) {
    return "Every campaign is reviewed by our Board of Trustees. Verified organizers display a green badge. Partnerships with the Ministry of Education and Ministry of ICT help us validate identities. Read-only disbursement updates are public on each campaign.";
  }
  if (last.includes("tax") || last.includes("receipt")) {
    return "After every donation, you receive an email receipt. Registered non-profit campaigns can issue 80G-equivalent tax-deductible receipts recognized by NBR Bangladesh.";
  }
  return "I can help you find campaigns, understand donation methods (bKash / Nagad / cards / banks), start your own campaign, or explain how verification works. What would you like to know?";
};

export async function chatReply(messages: ChatMessage[]): Promise<string> {
  if (!hasAIKey()) return localChatReply(messages);
  try {
    const system = `You are OrigoBot, the helpful assistant for OrigoAid — a Bangladesh-focused crowdfunding platform like GoFundMe. You answer in 2-4 sentences, friendly and direct. Supported payment methods: bKash, Nagad, Upay, Rocket, local bank cards, international Visa/Mastercard, SWIFT bank transfer. OrigoAid is non-profit, takes 0% platform fees, only gateway charges (~1.5-2%) apply. Campaigns are reviewed by a Board of Trustees within 24 hours. Verified organizers show a green badge. Donations receive email receipts; registered non-profits can issue NBR-compliant tax-deductible receipts.`;
    const history = messages
      .slice(-6)
      .map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`)
      .join("\n\n");
    const out = await callClaude(system, history, 400);
    return out || localChatReply(messages);
  } catch {
    return localChatReply(messages);
  }
}

export async function suggestCampaignTags(title: string, description: string): Promise<string[]> {
  if (!hasAIKey()) {
    const words = (title + " " + description).toLowerCase().match(/[a-z]{4,}/g) || [];
    const stopwords = new Set(["this", "that", "with", "will", "have", "been", "from", "they", "their", "your", "which", "people", "community", "support"]);
    return Array.from(new Set(words.filter((w) => !stopwords.has(w)))).slice(0, 5);
  }
  try {
    const out = await callClaude(
      "You output only a JSON array of 4-6 short lowercase tags (1-2 words each). No prose.",
      `Title: ${title}\nDescription: ${description}\n\nReturn a JSON array.`,
      200
    );
    const match = out.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return [];
  } catch {
    return [];
  }
}
