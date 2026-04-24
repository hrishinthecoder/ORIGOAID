import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Campaign, campaignsData, Donation, ProfileType } from "@/data/campaigns";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileType: ProfileType;
  avatar?: string;
  bio?: string;
  location?: string;
  verified?: boolean;
  createdAt: string;
}

// ── Social ───────────────────────────────────────────────────────────────
export interface Follower {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  at: string;
}

// ── Activity log ─────────────────────────────────────────────────────────
export type Activity =
  | { id: string; at: string; type: "donate";     campaignId: string; campaignTitle: string; amount: number }
  | { id: string; at: string; type: "bookmark"   | "unbookmark"; campaignId: string; campaignTitle: string }
  | { id: string; at: string; type: "follow"     | "unfollow"; organizerSlug: string; organizerName: string }
  | { id: string; at: string; type: "message";   organizerSlug: string; organizerName: string; preview: string };

interface StoreState {
  // auth
  user: User | null;
  isAuthed: boolean;
  // data
  campaigns: Campaign[];
  donations: Donation[];
  bookmarks: string[];
  // social
  following: string[];                       // organizer slugs
  followers: Follower[];                     // who follows the current user
  messages: Record<string, Message[]>;       // organizerSlug → thread
  lastReadAt: Record<string, string>;        // organizerSlug → ISO timestamp last viewed
  activity: Activity[];                      // most recent first (capped at 50)
  // theme
  theme: "light" | "dark";

  // actions
  signIn: (input: { email: string; password: string }) => Promise<User>;
  signUp: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    profileType: ProfileType;
  }) => Promise<User>;
  signOut: () => void;

  createCampaign: (c: Omit<Campaign, "raised" | "backers" | "status" | "createdAt">) => Campaign;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;

  addDonation: (d: Omit<Donation, "id" | "createdAt">) => Donation;

  toggleBookmark: (campaignId: string) => void;

  toggleFollow: (organizerSlug: string, organizerName: string) => boolean;
  sendMessage: (organizerSlug: string, organizerName: string, text: string) => void;
  markThreadRead: (organizerSlug: string) => void;

  setTheme: (t: "light" | "dark") => void;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Helper: prepend to activity log, cap at 50
const pushActivity = (list: Activity[], a: Activity): Activity[] =>
  [a, ...list].slice(0, 50);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthed: false,
      campaigns: campaignsData,
      donations: [],
      bookmarks: [],
      following: [],
      followers: [],
      messages: {},
      lastReadAt: {},
      activity: [],
      theme: "dark",

      signIn: async ({ email }) => {
        await new Promise((r) => setTimeout(r, 600));
        const user: User = {
          id: uid(),
          name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (s) => s.toUpperCase()),
          email,
          profileType: "Individual",
          createdAt: new Date().toISOString(),
          verified: true,
        };
        set({ user, isAuthed: true });
        return user;
      },

      signUp: async ({ name, email, phone, profileType }) => {
        await new Promise((r) => setTimeout(r, 700));
        const user: User = {
          id: uid(),
          name,
          email,
          phone,
          profileType,
          createdAt: new Date().toISOString(),
          verified: false,
        };
        set({ user, isAuthed: true });
        return user;
      },

      signOut: () => set({ user: null, isAuthed: false }),

      createCampaign: (c) => {
        const full: Campaign = {
          ...c,
          raised: 0,
          backers: 0,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        set({ campaigns: [full, ...get().campaigns] });
        return full;
      },

      updateCampaign: (id, patch) => {
        set({
          campaigns: get().campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        });
      },

      addDonation: (d) => {
        const full: Donation = {
          ...d,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        const campaign = get().campaigns.find((c) => c.id === d.campaignId);
        set((state) => ({
          donations: [full, ...state.donations],
          campaigns: state.campaigns.map((c) =>
            c.id === d.campaignId
              ? { ...c, raised: c.raised + d.amount, backers: (c.backers || 0) + 1 }
              : c
          ),
          activity: pushActivity(state.activity, {
            id: uid(),
            at: full.createdAt,
            type: "donate",
            campaignId: d.campaignId,
            campaignTitle: campaign?.title || "a campaign",
            amount: d.amount,
          }),
        }));
        return full;
      },

      toggleBookmark: (campaignId) => {
        const state = get();
        const has = state.bookmarks.includes(campaignId);
        const campaign = state.campaigns.find((c) => c.id === campaignId);
        set({
          bookmarks: has
            ? state.bookmarks.filter((x) => x !== campaignId)
            : [...state.bookmarks, campaignId],
          activity: pushActivity(state.activity, {
            id: uid(),
            at: new Date().toISOString(),
            type: has ? "unbookmark" : "bookmark",
            campaignId,
            campaignTitle: campaign?.title || "a campaign",
          }),
        });
      },

      toggleFollow: (organizerSlug, organizerName) => {
        const state = get();
        const has = state.following.includes(organizerSlug);
        set({
          following: has
            ? state.following.filter((s) => s !== organizerSlug)
            : [...state.following, organizerSlug],
          activity: pushActivity(state.activity, {
            id: uid(),
            at: new Date().toISOString(),
            type: has ? "unfollow" : "follow",
            organizerSlug,
            organizerName,
          }),
        });
        return !has;
      },

      sendMessage: (organizerSlug, organizerName, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const now = new Date().toISOString();
        const msg: Message = { id: uid(), from: "me", text: trimmed, at: now };
        set((state) => ({
          messages: {
            ...state.messages,
            [organizerSlug]: [...(state.messages[organizerSlug] || []), msg],
          },
          // A message *I* sent means I've seen the thread up to "now".
          lastReadAt: { ...state.lastReadAt, [organizerSlug]: now },
          activity: pushActivity(state.activity, {
            id: uid(),
            at: now,
            type: "message",
            organizerSlug,
            organizerName,
            preview: trimmed.slice(0, 80),
          }),
        }));
        // Simulated auto-reply so the thread feels alive in demo
        setTimeout(() => {
          const reply: Message = {
            id: uid(),
            from: "them",
            text: `Thanks for reaching out! The ${organizerName} team will get back to you shortly.`,
            at: new Date().toISOString(),
          };
          set((state) => ({
            messages: {
              ...state.messages,
              [organizerSlug]: [...(state.messages[organizerSlug] || []), reply],
            },
          }));
        }, 1400);
      },

      markThreadRead: (organizerSlug) => {
        set((state) => ({
          lastReadAt: {
            ...state.lastReadAt,
            [organizerSlug]: new Date().toISOString(),
          },
        }));
      },

      setTheme: (t) => {
        set({ theme: t });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", t === "dark");
        }
      },
    }),
    {
      name: "origoaid-store-v2",
      partialize: (s) => ({
        user: s.user,
        isAuthed: s.isAuthed,
        campaigns: s.campaigns,
        donations: s.donations,
        bookmarks: s.bookmarks,
        following: s.following,
        followers: s.followers,
        messages: s.messages,
        lastReadAt: s.lastReadAt,
        activity: s.activity,
        theme: s.theme,
      }),
    }
  )
);

// initialize theme on load
if (typeof window !== "undefined") {
  const applyTheme = () => {
    const t = useStore.getState().theme;
    document.documentElement.classList.toggle("dark", t === "dark");
  };
  applyTheme();
  useStore.subscribe(applyTheme);
}
