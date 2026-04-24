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

interface StoreState {
  // auth
  user: User | null;
  isAuthed: boolean;
  // data
  campaigns: Campaign[];
  donations: Donation[];
  bookmarks: string[];
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
  setTheme: (t: "light" | "dark") => void;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthed: false,
      campaigns: campaignsData,
      donations: [],
      bookmarks: [],
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
        set({
          donations: [full, ...get().donations],
          campaigns: get().campaigns.map((c) =>
            c.id === d.campaignId
              ? {
                  ...c,
                  raised: c.raised + d.amount,
                  backers: (c.backers || 0) + 1,
                }
              : c
          ),
        });
        return full;
      },

      toggleBookmark: (campaignId) => {
        const b = get().bookmarks;
        set({
          bookmarks: b.includes(campaignId) ? b.filter((x) => x !== campaignId) : [...b, campaignId],
        });
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
