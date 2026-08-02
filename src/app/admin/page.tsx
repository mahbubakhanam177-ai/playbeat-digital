"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, FolderTree, Users, ShoppingCart, Tag, Star,
  FileText, Image as ImageIcon, Search, BarChart3, Settings as SettingsIcon,
  Mail, Bell, LogOut, Menu, X, ChevronRight, TrendingUp, DollarSign,
  Eye, Download, Activity, Zap, Globe, Shield, Code, Palette,
  ArrowUpRight, ArrowDownRight, Plus, Edit, Trash2,
  Loader2, Filter, CreditCard, FileCode, Layers,
  AlertCircle, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  getDashboardStats, fetchProducts, deleteProduct, createProduct,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

/* ============================== Admin Login ============================== */
function AdminLogin({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (!onLogin(password)) setError("Incorrect password. Try again.");
      setLoading(false);
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] p-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-strong relative w-full max-w-sm overflow-hidden rounded-2xl border-white/[0.08] p-8 shadow-premium"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/25">
            <Shield className="size-7" />
          </div>
          <h1 className="text-xl font-bold text-white">Playbeat Admin</h1>
          <p className="mt-1 text-xs text-muted-foreground">Enterprise Control Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" autoFocus className="border-white/[0.08] bg-white/[0.03]" />
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              <AlertCircle className="size-3.5" /> {error}
            </div>
          )}
          <Button type="submit" disabled={loading || !password} className="w-full bg-gold py-2.5 text-black hover:bg-gold/90">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Access Dashboard"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

/* ============================== Sidebar Data ============================== */
interface NavItem { label: string; icon: React.ElementType; section: string; }
const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
    { label: "Analytics", icon: BarChart3, section: "analytics" },
    { label: "Activity Logs", icon: Activity, section: "activity" },
  ]},
  { title: "Catalog", items: [
    { label: "Products", icon: Package, section: "products" },
    { label: "Categories", icon: FolderTree, section: "categories" },
    { label: "Collections", icon: Layers, section: "collections" },
    { label: "Brands", icon: Tag, section: "brands" },
    { label: "Media Library", icon: ImageIcon, section: "media" },
  ]},
  { title: "Sales", items: [
    { label: "Orders", icon: ShoppingCart, section: "orders" },
    { label: "Customers", icon: Users, section: "customers" },
    { label: "Subscriptions", icon: CreditCard, section: "subscriptions" },
    { label: "Coupons", icon: Tag, section: "coupons" },
    { label: "Reviews", icon: Star, section: "reviews" },
  ]},
  { title: "Content", items: [
    { label: "Blog", icon: FileText, section: "blog" },
    { label: "Pages", icon: FileCode, section: "pages" },
    { label: "Navigation", icon: Menu, section: "navigation" },
    { label: "Forms", icon: FileCode, section: "forms" },
    { label: "Messages", icon: Mail, section: "messages" },
    { label: "Newsletter", icon: Mail, section: "newsletter" },
  ]},
  { title: "Growth", items: [
    { label: "Marketing", icon: TrendingUp, section: "marketing" },
    { label: "SEO", icon: Search, section: "seo" },
    { label: "Automation", icon: Zap, section: "automation" },
    { label: "Integrations", icon: Globe, section: "integrations" },
    { label: "Emails", icon: Mail, section: "emails" },
  ]},
  { title: "System", items: [
    { label: "Users & Roles", icon: Users, section: "users" },
    { label: "Appearance", icon: Palette, section: "appearance" },
    { label: "Settings", icon: SettingsIcon, section: "settings" },
    { label: "Developer", icon: Code, section: "developer" },
  ]},
];

/* ============================== Sidebar ============================== */
function AdminSidebar({ active, onSelect, onLogout, mobileOpen, setMobileOpen }: {
  active: string; onSelect: (s: string) => void; onLogout: () => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />}
      </AnimatePresence>
      <aside className={cn("fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-[#0a0a0a] transition-transform duration-300 lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-5">
          <span className="grid size-9 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/25"><Shield className="size-5" /></span>
          <div><span className="block text-sm font-bold text-white">Playbeat Admin</span><span className="text-[10px] text-muted-foreground">Enterprise CMS</span></div>
          <button onClick={() => setMobileOpen(false)} className="ml-auto grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 lg:hidden"><X className="size-4" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{group.title}</p>
              {group.items.map((item) => {
                const isActive = active === item.section;
                return (
                  <button key={item.section} onClick={() => { onSelect(item.section); setMobileOpen(false); }}
                    className={cn("group mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all", isActive ? "bg-gold/10 text-gold ring-1 ring-gold/20" : "text-muted-foreground hover:bg-white/[0.04] hover:text-white")}>
                    <item.icon className={cn("size-4 shrink-0", isActive && "text-gold")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="size-3.5 text-gold" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/[0.06] p-3">
          <a href="/" target="_blank" className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-white/[0.04] hover:text-white"><ExternalLink className="size-3.5" /> View Storefront</a>
          <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-danger hover:bg-danger/10"><LogOut className="size-3.5" /> Sign Out</button>
        </div>
      </aside>
    </>
  );
}

/* ============================== Top Bar ============================== */
function TopBar({ onMenuClick, onCommand }: { onMenuClick: () => void; onCommand: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-[#0a0a0a]/80 px-4 backdrop-blur-xl lg:px-6">
      <button onClick={onMenuClick} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 lg:hidden"><Menu className="size-5" /></button>
      <button onClick={onCommand} className="flex flex-1 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-muted-foreground hover:border-white/[0.12] lg:max-w-md">
        <Search className="size-4" /><span>Search or jump to...</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] sm:flex">⌘K</kbd>
      </button>
      <div className="flex items-center gap-1.5">
        <button className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white"><Bell className="size-4" /></button>
        <div className="ml-1 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5">
          <span className="grid size-7 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold">A</span>
          <span className="hidden text-xs font-medium text-white sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}

/* ============================== Dashboard ============================== */
function DashboardView() {
  const [stats, setStats] = React.useState({ products: 0, orders: 0, testimonials: 0, blogPosts: 0 });
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { getDashboardStats().then(setStats).catch(() => {}).finally(() => setLoading(false)); }, []);

  const statCards = [
    { label: "Today's Revenue", value: "$1,248", change: "+12.5%", up: true, icon: DollarSign, color: "text-success" },
    { label: "Monthly Revenue", value: "$34,892", change: "+8.2%", up: true, icon: TrendingUp, color: "text-success" },
    { label: "Visitors Today", value: "8,420", change: "+24%", up: true, icon: Eye, color: "text-gold" },
    { label: "Conversion Rate", value: "3.8%", change: "-0.4%", up: false, icon: Zap, color: "text-danger" },
    { label: "Orders", value: String(stats.orders), change: "+5", up: true, icon: ShoppingCart, color: "text-azure" },
    { label: "Products", value: String(stats.products), change: "+2", up: true, icon: Package, color: "text-gold" },
    { label: "Downloads", value: "1,204", change: "+18%", up: true, icon: Download, color: "text-success" },
    { label: "Subscribers", value: "12,480", change: "+320", up: true, icon: Mail, color: "text-azure" },
  ];
  const salesData = [42, 58, 35, 72, 48, 85, 63, 91, 55, 78, 62, 88];
  const maxSale = Math.max(...salesData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Dashboard</h1><p className="text-sm text-muted-foreground">Welcome back — here's what's happening today.</p></div>
        <Button className="bg-gold text-black hover:bg-gold/90"><Plus className="size-4" /> Quick Action</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-4 hover:border-white/[0.12]">
            <div className="mb-2 flex items-center justify-between">
              <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04]"><s.icon className={cn("size-4", s.color)} /></span>
              <span className={cn("flex items-center gap-0.5 text-xs font-semibold", s.up ? "text-success" : "text-danger")}>{s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{loading ? "—" : s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-white">Sales Overview</h3><p className="text-xs text-muted-foreground">Last 12 months</p></div><Badge className="bg-success/15 text-success">+18.2% YoY</Badge></div>
          <div className="flex h-48 items-end gap-2">
            {salesData.map((val, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
                <div className="relative w-full"><div className="w-full rounded-t bg-gradient-to-t from-gold/40 to-gold transition-all duration-500 hover:from-gold/60 hover:to-gold" style={{ height: `${(val / maxSale) * 180}px` }} /></div>
                <span className="text-[9px] text-muted-foreground">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">Traffic Sources</h3>
          <div className="space-y-3">
            {[["Organic Search",42,"bg-gold"],["Direct",28,"bg-azure"],["Social",18,"bg-success"],["Referral",12,"bg-purple-500"]].map(([src,pct,color]) => (
              <div key={src as string}><div className="mb-1 flex items-center justify-between text-xs"><span className="text-muted-foreground">{src}</span><span className="font-semibold text-white">{pct}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full",color as string)} style={{ width: `${pct}%` }} /></div></div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-white">Recent Orders</h3><button className="text-xs text-gold hover:underline">View all</button></div>
          <div className="space-y-2">
            {[["#PB-8K2F","Adeel Khan","ChatGPT Plus","$14.99","completed"],["#PB-7H9X","Sarah M.","Netflix Premium","$9.49","completed"],["#PB-6J4D","Rafiq H.","Steam Wallet $50","$47.50","pending"],["#PB-5M8C","Lina P.","Midjourney Pro","$19.99","completed"]].map(([id,cust,prod,amt,status]) => (
              <div key={id} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-gold/10 text-xs">📦</span>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-white">{prod}</p><p className="text-[10px] text-muted-foreground">{id} · {cust}</p></div>
                <div className="text-right"><p className="text-xs font-bold text-white">{amt}</p><span className={cn("text-[9px] font-semibold",status==="completed"?"text-success":"text-gold")}>{status}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-white">Popular Products</h3><button className="text-xs text-gold hover:underline">View all</button></div>
          <div className="space-y-2">
            {[["ChatGPT Plus — 1 Month",3120,"$46,788"],["Steam Wallet $50",2840,"$134,900"],["Netflix Premium",2210,"$20,972"],["AI Mega Bundle",1240,"$61,988"]].map(([name,sales,rev],i) => (
              <div key={name as string} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                <span className="text-sm font-bold text-muted-foreground">#{i+1}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-white">{name}</p><p className="text-[10px] text-muted-foreground">{Number(sales).toLocaleString()} sales</p></div>
                <span className="text-xs font-bold text-success">{rev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5">
        <div className="mb-3 flex items-center gap-2"><span className="relative flex size-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span><h3 className="text-sm font-semibold text-white">Realtime Activity</h3></div>
        <div className="space-y-2">
          {[["New order #PB-9K3L","just now",ShoppingCart,"text-success"],["User signed up: adeel@example.com","2 min ago",Users,"text-azure"],["Product updated: ChatGPT Plus","5 min ago",Package,"text-gold"],["New review: 5 stars","8 min ago",Star,"text-success"],["Coupon used: PLAYBEAT10","12 min ago",Tag,"text-purple-400"]].map(([action,time,icon,color],i) => {
            const Icon = icon as React.ElementType;
            return <div key={i} className="flex items-center gap-3 py-1.5"><Icon className={cn("size-4 shrink-0",color as string)} /><span className="flex-1 text-xs text-white">{action}</span><span className="text-[10px] text-muted-foreground">{time}</span></div>;
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================== Products ============================== */
function ProductsView() {
  const [products, setProducts] = React.useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [showAdd, setShowAdd] = React.useState(false);

  const load = React.useCallback(async () => {
    try { setProducts(await fetchProducts()); } catch { /* fallback */ }
    setLoading(false);
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) => String(p.name).toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this product?")) return;
    try { await deleteProduct(slug); setProducts((prev) => prev.filter((p) => p.slug !== slug)); }
    catch { alert("Delete failed — RLS may block anon deletes. Use Supabase dashboard."); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Products</h1><p className="text-sm text-muted-foreground">{products.length} products in catalog</p></div>
        <Button onClick={() => setShowAdd(true)} className="bg-gold text-black hover:bg-gold/90"><Plus className="size-4" /> Add Product</Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="border-white/[0.06] bg-white/[0.02] pl-10" /></div>
        <Button variant="outline" className="border-white/[0.06] bg-white/[0.02]"><Filter className="size-4" /> Filter</Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d0d0d]">
        <table className="w-full">
          <thead><tr className="border-b border-white/[0.06] text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Price</th><th className="hidden px-4 py-3 font-medium lg:table-cell">Rating</th><th className="hidden px-4 py-3 font-medium lg:table-cell">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto mb-2 size-6 animate-spin" /> Loading...</td></tr>
            : filtered.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found.</td></tr>
            : filtered.map((p) => (
              <tr key={String(p.slug)} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-lg bg-white/[0.04] text-lg">{String(p.emoji)}</span><div><p className="text-sm font-medium text-white">{String(p.name)}</p><p className="text-[10px] text-muted-foreground">{String(p.slug)}</p></div></div></td>
                <td className="px-4 py-3 text-xs capitalize text-muted-foreground">{String(p.category_slug).replace("-"," ")}</td>
                <td className="px-4 py-3 text-sm font-semibold text-white">${Number(p.price).toFixed(2)}</td>
                <td className="hidden px-4 py-3 lg:table-cell"><span className="flex items-center gap-1 text-xs text-white"><Star className="size-3 fill-gold text-gold" />{Number(p.rating).toFixed(1)}</span></td>
                <td className="hidden px-4 py-3 lg:table-cell"><Badge className={p.is_active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}>{p.is_active ? "Active" : "Draft"}</Badge></td>
                <td className="px-4 py-3"><div className="flex items-center justify-end gap-1"><button className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-gold"><Edit className="size-3.5" /></button><button onClick={() => handleDelete(String(p.slug))} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"><Trash2 className="size-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>{showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdded={load} />}</AnimatePresence>
    </div>
  );
}

function AddProductModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = React.useState({ slug: "", name: "", category_slug: "ai-tools", description: "", price: "", old_price: "", emoji: "📦", rating: "5", reviews_count: "0", gradient: "linear-gradient(135deg, #FF1E1E 0%, #8A0F0F 100%)", is_featured: false, is_trending: false, is_best_seller: false, is_flash_deal: false, is_free: false });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      await createProduct({ ...form, price: parseFloat(form.price)||0, old_price: form.old_price?parseFloat(form.old_price):null, rating: parseFloat(form.rating)||5, reviews_count: parseInt(form.reviews_count)||0, tags: [], delivery: "instant", is_active: true });
      onAdded(); onClose();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to create product (RLS may block inserts)."); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="glass-strong max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-white/[0.08] p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-white">Add New Product</h2><button onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5"><X className="size-4" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-muted-foreground">Name *</label><Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required className="border-white/[0.06] bg-white/[0.02]" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Slug *</label><Input value={form.slug} onChange={(e)=>setForm({...form,slug:e.target.value})} required className="border-white/[0.06] bg-white/[0.02]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-muted-foreground">Category</label><select value={form.category_slug} onChange={(e)=>setForm({...form,category_slug:e.target.value})} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white">{[["ai-tools","AI Tools"],["games","Games"],["software","Software"],["subscriptions","Subscriptions"],["gift-cards","Gift Cards"],["free-tools","Free Tools"],["bundles","Bundles"]].map(([v,l])=><option key={v} value={v} className="bg-[#0d0d0d]">{l}</option>)}</select></div>
            <div><label className="text-xs font-medium text-muted-foreground">Emoji</label><Input value={form.emoji} onChange={(e)=>setForm({...form,emoji:e.target.value})} className="border-white/[0.06] bg-white/[0.02]" /></div>
          </div>
          <div><label className="text-xs font-medium text-muted-foreground">Description</label><textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows={2} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-medium text-muted-foreground">Price *</label><Input type="number" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required className="border-white/[0.06] bg-white/[0.02]" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Old Price</label><Input type="number" value={form.old_price} onChange={(e)=>setForm({...form,old_price:e.target.value})} className="border-white/[0.06] bg-white/[0.02]" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Rating</label><Input type="number" value={form.rating} onChange={(e)=>setForm({...form,rating:e.target.value})} className="border-white/[0.06] bg-white/[0.02]" /></div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[["is_featured","Featured"],["is_trending","Trending"],["is_best_seller","Best Seller"],["is_flash_deal","Flash Deal"],["is_free","Free"]].map(([key,label])=>(
              <label key={key} className="flex items-center gap-1.5 text-xs text-white"><input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e)=>setForm({...form,[key]:e.target.checked})} className="accent-gold" />{label}</label>
            ))}
          </div>
          <div className="flex gap-2 pt-2"><Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/[0.06]">Cancel</Button><Button type="submit" disabled={saving} className="flex-1 bg-gold text-black hover:bg-gold/90">{saving?<Loader2 className="size-4 animate-spin"/>:"Create"}</Button></div>
        </form>
      </motion.div>
    </div>
  );
}

/* ============================== Settings ============================== */
function SettingsView() {
  const [tab, setTab] = React.useState("general");
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-white">Settings</h1><p className="text-sm text-muted-foreground">Configure your marketplace</p></div>
      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] no-scrollbar">
        {[["general","General"],["payments","Payments"],["seo","SEO"],["email","Email"],["domains","Domains"],["analytics","Analytics"],["security","Security"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} className={cn("shrink-0 border-b-2 px-4 py-2.5 text-sm",tab===key?"border-gold text-white":"border-transparent text-muted-foreground hover:text-white")}>{label}</button>
        ))}
      </div>
      {tab==="general" && (
        <div className="max-w-2xl space-y-4 rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-6">
          <h3 className="text-sm font-semibold text-white">Store Information</h3>
          {[["Store Name","Playbeat Digital"],["Tagline","Premium Digital Marketplace"],["Support Email","support@playbeat.digital"],["Currency","USD ($)"]].map(([label,val])=>(
            <div key={label}><label className="text-xs font-medium text-muted-foreground">{label}</label><Input defaultValue={val} className="border-white/[0.06] bg-white/[0.02]" /></div>
          ))}
          <Button className="bg-gold text-black hover:bg-gold/90">Save Changes</Button>
        </div>
      )}
      {tab==="payments" && (
        <div className="max-w-2xl space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">Payment Gateways</h3>
            <div className="space-y-2">
              {[["Stripe","Card payments",true],["PayPal","PayPal balance & cards",true],["Paddle","SaaS & digital products",false],["Lemon Squeezy","Digital downloads",false],["Manual Bank Transfer","Bank transfer",true],["Cryptocurrency","BTC, ETH, USDT",true],["Cash on Delivery","Physical only",false]].map(([name,desc,active])=>(
                <div key={name as string} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                  <div><p className="text-sm font-medium text-white">{name}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                  <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" defaultChecked={active as boolean} className="peer sr-only" /><div className="peer h-5 w-9 rounded-full bg-white/[0.08] after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-gold peer-checked:after:translate-x-4" /></label>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Manual Payment Methods</h3>
            <p className="mb-4 text-xs text-muted-foreground">Add unlimited manual payment methods with dynamic configuration (bank, crypto, QR, etc.)</p>
            <Button className="bg-gold text-black hover:bg-gold/90"><Plus className="size-4" /> Add Payment Method</Button>
          </div>
        </div>
      )}
      {tab==="seo" && (
        <div className="max-w-2xl space-y-4 rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-6">
          <h3 className="text-sm font-semibold text-white">SEO Configuration</h3>
          {[["Meta Title","Playbeat Digital — Premium Digital Marketplace"],["Google Analytics ID","G-XXXXXXXXXX"],["Meta Pixel ID",""],["TikTok Pixel ID",""]].map(([label,val])=>(
            <div key={label}><label className="text-xs font-medium text-muted-foreground">{label}</label><Input defaultValue={val} className="border-white/[0.06] bg-white/[0.02]" /></div>
          ))}
          <div><label className="text-xs font-medium text-muted-foreground">Meta Description</label><textarea defaultValue="Software, AI Tools, Streaming, Games & Gift Cards with Instant Delivery." rows={2} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white" /></div>
          <Button className="bg-gold text-black hover:bg-gold/90">Save SEO Settings</Button>
        </div>
      )}
      {tab!=="general"&&tab!=="payments"&&tab!=="seo" && <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-6"><p className="text-sm text-muted-foreground">Configuration for {tab}.</p></div>}
    </div>
  );
}

/* ============================== Placeholder ============================== */
function PlaceholderView({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/20"><Icon className="size-8" /></div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">This module is configured and ready for data entry. Part of the enterprise admin suite.</p>
      <Button className="mt-4 bg-gold text-black hover:bg-gold/90"><Plus className="size-4" /> Get Started</Button>
    </div>
  );
}

/* ============================== Command Palette ============================== */
function CommandPalette({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (s: string) => void }) {
  const [query, setQuery] = React.useState("");
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const filtered = allItems.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.97 }} onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl border-white/[0.08]">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3"><Search className="size-4 text-muted-foreground" /><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Type a command or search..." className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none" /><kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px]">Esc</kbd></div>
            <div className="max-h-80 overflow-y-auto p-2">{filtered.map((item)=>(<button key={item.section} onClick={()=>{onSelect(item.section);onClose();}} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-white"><item.icon className="size-4" />{item.label}</button>))}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ============================== Main ============================== */
export default function AdminPage() {
  const { authed, loading, login, logout } = useAdminAuth();
  const [section, setSection] = React.useState("dashboard");
  const [mobileNav, setMobileNav] = React.useState(false);
  const [cmdOpen, setCmdOpen] = React.useState(false);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey||e.ctrlKey) && e.key==="k") { e.preventDefault(); setCmdOpen(v=>!v); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#050505]"><Loader2 className="size-8 animate-spin text-gold" /></div>;
  if (!authed) return <AdminLogin onLogin={login} />;

  const render = () => {
    switch (section) {
      case "dashboard": return <DashboardView />;
      case "products": return <ProductsView />;
      case "settings": return <SettingsView />;
      default: return <PlaceholderView title={section.charAt(0).toUpperCase()+section.slice(1)} icon={SettingsIcon} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminSidebar active={section} onSelect={setSection} onLogout={logout} mobileOpen={mobileNav} setMobileOpen={setMobileNav} />
      <div className="lg:pl-64">
        <TopBar onMenuClick={()=>setMobileNav(true)} onCommand={()=>setCmdOpen(true)} />
        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{render()}</motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={()=>setCmdOpen(false)} onSelect={setSection} />
    </div>
  );
}
