import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageThread from "@/components/MessageThread";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { findOrganizerBySlug } from "@/lib/organizers";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const nav = useNavigate();
  const { messages, campaigns } = useStore();

  // Build the conversation summary list (sorted by most recent activity)
  const conversations = useMemo(() => {
    return Object.entries(messages)
      .filter(([, thread]) => thread.length > 0)
      .map(([slug, thread]) => {
        const org = findOrganizerBySlug(slug, campaigns);
        const last = thread[thread.length - 1];
        return {
          slug,
          name: org?.name ?? slug,
          verified: !!org?.verified,
          type: org?.type,
          lastMessage: last,
          count: thread.length,
        };
      })
      .sort((a, b) => (a.lastMessage.at < b.lastMessage.at ? 1 : -1));
  }, [messages, campaigns]);

  // The active thread: either from URL slug or the first conversation
  const [selected, setSelected] = useState<string | null>(
    routeSlug ?? conversations[0]?.slug ?? null,
  );

  useEffect(() => {
    if (routeSlug) setSelected(routeSlug);
    else if (!selected && conversations.length > 0)
      setSelected(conversations[0].slug);
  }, [routeSlug, conversations, selected]);

  const activeOrganizer = selected
    ? findOrganizerBySlug(selected, campaigns)
    : null;
  const activeConv = conversations.find((c) => c.slug === selected);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          <header className="mb-6">
            <span className="chip mb-3">Inbox</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Messages
            </h1>
            <p className="text-muted-foreground mt-1">
              Your conversations with campaign organizers.
            </p>
          </header>

          {conversations.length === 0 ? (
            <EmptyInbox />
          ) : (
            <div className="card-elevated overflow-hidden grid md:grid-cols-[320px_1fr] min-h-[620px]">
              {/* Conversation list — hidden on mobile when one is selected */}
              <aside
                className={cn(
                  "border-r border-border overflow-y-auto max-h-[620px]",
                  selected && "hidden md:block",
                )}
              >
                <ul>
                  {conversations.map((c) => (
                    <li key={c.slug}>
                      <button
                        onClick={() => {
                          setSelected(c.slug);
                          nav(`/messages/${c.slug}`, { replace: true });
                        }}
                        className={cn(
                          "w-full text-left p-4 flex gap-3 items-start border-b border-border transition-colors",
                          selected === c.slug
                            ? "bg-secondary"
                            : "hover:bg-secondary/40",
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white font-bold shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm truncate">
                              {c.name}
                            </span>
                            {c.verified && (
                              <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {c.lastMessage.from === "me" && (
                              <span className="font-medium">You: </span>
                            )}
                            {c.lastMessage.text}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {timeAgo(c.lastMessage.at)} · {c.count}{" "}
                            message{c.count === 1 ? "" : "s"}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Active thread */}
              <section
                className={cn(
                  "flex flex-col",
                  !selected && "hidden md:flex",
                )}
              >
                {selected && activeConv ? (
                  <>
                    {/* Header */}
                    <div className="px-4 md:px-5 py-3 border-b border-border flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelected(null);
                          nav("/messages", { replace: true });
                        }}
                        className="md:hidden p-1 -ml-1 rounded-full hover:bg-secondary"
                        aria-label="Back to inbox"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/organizer/${selected}`}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-brand-emerald-dark grid place-items-center text-white font-bold shrink-0 hover:scale-105 transition-transform"
                      >
                        {activeConv.name.charAt(0)}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/organizer/${selected}`}
                            className="font-semibold truncate hover:text-primary transition-colors"
                          >
                            {activeConv.name}
                          </Link>
                          {activeConv.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        {activeOrganizer && (
                          <div className="text-xs text-muted-foreground truncate">
                            {activeOrganizer.type} ·{" "}
                            {activeOrganizer.campaigns.length} campaign
                            {activeOrganizer.campaigns.length === 1 ? "" : "s"}
                          </div>
                        )}
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        <Link to={`/organizer/${selected}`}>View profile</Link>
                      </Button>
                    </div>

                    <div className="flex-1 p-3">
                      <MessageThread
                        slug={selected}
                        organizerName={activeConv.name}
                        heightClass="h-[540px]"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 grid place-items-center p-10 text-center">
                    <div>
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Select a conversation to start chatting.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="card-elevated p-12 text-center">
      <MessageCircle className="w-14 h-14 mx-auto mb-4 text-muted-foreground opacity-40" />
      <h2 className="font-display text-xl font-bold mb-2">
        Your inbox is empty
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Message organizers to ask about impact, updates, or how to get
        involved. Conversations will appear here.
      </p>
      <Button
        asChild
        className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark"
      >
        <Link to="/browse">
          <Compass className="w-4 h-4 mr-2" /> Browse campaigns
        </Link>
      </Button>
    </div>
  );
}
