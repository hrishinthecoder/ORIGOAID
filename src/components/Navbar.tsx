import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Sparkles, LogOut, User, LayoutDashboard, Heart, MessageSquare, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/ai", label: "AI Studio", icon: Sparkles },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthed, signOut, messages, lastReadAt } = useStore();
  const nav = useNavigate();
  const loc = useLocation();

  // Unread = threads with an incoming ("them") message posted after lastReadAt
  const conversationCount = useMemo(() => {
    let unread = 0;
    for (const [slug, thread] of Object.entries(messages)) {
      if (thread.length === 0) continue;
      const last = thread[thread.length - 1];
      if (last.from !== "them") continue;
      const seenAt = lastReadAt[slug];
      if (!seenAt || last.at > seenAt) unread++;
    }
    return unread;
  }, [messages, lastReadAt]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-md border-b border-border/50 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted"
                )
              }
            >
              {l.icon && <l.icon className="w-3.5 h-3.5" />}
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => nav("/browse")}
            aria-label="Search"
            className="rounded-full hidden sm:inline-flex"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => nav("/messages")}
            aria-label="Messages"
            className="rounded-full relative hidden sm:inline-flex"
          >
            <MessageCircle className="w-4 h-4" />
            {conversationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-white text-[10px] font-bold grid place-items-center px-1">
                {conversationCount > 9 ? "9+" : conversationCount}
              </span>
            )}
          </Button>

          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            {isAuthed && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full gap-2 pl-1 pr-3">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[90px] truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/dashboard#donations")}>
                    <Heart className="w-4 h-4 mr-2" /> My donations
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => nav("/login")} className="rounded-full">
                Log in
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => nav("/start-campaign")}
              className="rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark shadow-lg shadow-primary/20 btn-primary-glow"
            >
              Start a Campaign
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden container mt-3 pb-4 animate-fade-in">
          <div className="card-elevated p-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/messages" className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Messages
              </span>
              {conversationCount > 0 && (
                <span className="min-w-[20px] h-5 rounded-full bg-destructive text-white text-[10px] font-bold grid place-items-center px-1.5">
                  {conversationCount > 9 ? "9+" : conversationCount}
                </span>
              )}
            </Link>
            <div className="h-px bg-border my-2" />
            {isAuthed && user ? (
              <>
                <Link to="/dashboard" className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted text-destructive"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted">
                Log in
              </Link>
            )}
            <Button
              onClick={() => nav("/start-campaign")}
              className="mt-2 rounded-full bg-gradient-to-r from-primary to-brand-emerald-dark"
            >
              Start a Campaign
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
