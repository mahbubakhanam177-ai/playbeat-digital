"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  ShoppingBag,
  Tag,
  Coins,
  Heart,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useStore, type AppNotification } from "@/lib/store";
import { cn } from "@/lib/utils";

const TYPE_META: Record<
  AppNotification["type"],
  { icon: React.ElementType; color: string; bg: string; ring: string }
> = {
  order: { icon: ShoppingBag, color: "text-azure", bg: "bg-azure/15", ring: "ring-azure/25" },
  deal: { icon: Tag, color: "text-gold", bg: "bg-gold/15", ring: "ring-gold/25" },
  points: { icon: Coins, color: "text-gold", bg: "bg-gold/15", ring: "ring-gold/25" },
  wishlist: { icon: Heart, color: "text-rose-400", bg: "bg-rose-500/15", ring: "ring-rose-500/25" },
  system: { icon: Info, color: "text-sky-300", bg: "bg-sky-400/15", ring: "ring-sky-400/25" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsDropdown() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    openCart,
    openRewards,
  } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Auto-mark all as read 1.5s after the dropdown opens (lets the user see
  // the unread state briefly before it clears).
  const autoReadTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      autoReadTimer.current = setTimeout(() => {
        markAllNotificationsRead();
      }, 1500);
    } else if (autoReadTimer.current) {
      clearTimeout(autoReadTimer.current);
      autoReadTimer.current = null;
    }
  };
  React.useEffect(() => () => {
    if (autoReadTimer.current) clearTimeout(autoReadTimer.current);
  }, []);

  const handleNotifClick = (n: AppNotification) => {
    markNotificationRead(n.id);
    if (n.type === "order") openCart();
    if (n.type === "points") openRewards();
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications, ${unreadCount} unread`}
          className="relative flex size-10 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-[18px] text-white shadow-[0_0_0_2px_#070707]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 size-2 animate-ping rounded-full bg-danger/60" aria-hidden />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 border-white/[0.08] bg-popover/95 p-0 text-white backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-gold" />
            <span className="text-sm font-bold text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-danger/15 px-1.5 py-0.5 text-[10px] font-bold text-danger">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-gold"
            >
              <CheckCheck className="size-3" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-white/[0.03] ring-1 ring-white/[0.06]">
              <Bell className="size-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {notifications.slice(0, 12).map((n) => {
                const meta = TYPE_META[n.type];
                const Icon = meta.icon;
                return (
                  <motion.button
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => handleNotifClick(n)}
                    className={cn(
                      "group relative flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition-colors hover:bg-white/[0.03]",
                      !n.read && "bg-gold/[0.03]"
                    )}
                  >
                    {/* unread dot */}
                    {!n.read && (
                      <span className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold" />
                    )}
                    {/* icon */}
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl ring-1", meta.bg, meta.ring)}>
                      {n.emoji ? (
                        <span className="text-base">{n.emoji}</span>
                      ) : (
                        <Icon className={cn("size-4", meta.color)} />
                      )}
                    </span>
                    {/* content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-white">
                          {n.title}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {timeAgo(n.ts)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={clearNotifications}
                className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-danger"
              >
                <Trash2 className="size-3" /> Clear all
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById("featured")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-[10px] font-medium text-gold transition-colors hover:underline"
              >
                Browse deals →
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
