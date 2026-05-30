import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText, MessageSquare, Users, Eye, Plus, ArrowRight,
  Newspaper, BookOpen, Megaphone, GraduationCap, Calendar, ClipboardList,
  TrendingUp, Activity,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getStats() {
  const supabase = await createClient();
  const [postsR, messagesR, subsR, viewsR, eventsR, surveysR] = await Promise.all([
    supabase.from("posts").select("id, type, published", { count: "exact" }),
    supabase.from("messages").select("id, read", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
    supabase.from("posts").select("view_count"),
    supabase.from("events").select("id, status", { count: "exact" }),
    supabase.from("surveys").select("id, is_active", { count: "exact" }),
  ]);

  const totalViews = viewsR.data?.reduce((s, p) => s + (p.view_count || 0), 0) || 0;
  const unread = messagesR.data?.filter(m => !m.read).length || 0;
  const upcomingEvents = eventsR.data?.filter(e => e.status === "upcoming").length || 0;
  const activeSurveys = surveysR.data?.filter(s => s.is_active).length || 0;

  return {
    totalPosts: postsR.count || 0,
    publishedPosts: postsR.data?.filter(p => p.published).length || 0,
    totalMessages: messagesR.count || 0, unread,
    totalSubscribers: subsR.count || 0,
    totalViews,
    totalEvents: eventsR.count || 0, upcomingEvents,
    totalSurveys: surveysR.count || 0, activeSurveys,
    typeCounts: {
      article: postsR.data?.filter(p => p.type === "article").length || 0,
      news: postsR.data?.filter(p => p.type === "news").length || 0,
      announcement: postsR.data?.filter(p => p.type === "announcement").length || 0,
      training: postsR.data?.filter(p => p.type === "training").length || 0,
    },
  };
}

async function getRecent() {
  const supabase = await createClient();
  const [postsR, msgsR, eventsR] = await Promise.all([
    supabase.from("posts").select("id,title,type,published,created_at,view_count").order("created_at", { ascending: false }).limit(5),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("events").select("id,title,event_date,status,type").order("event_date", { ascending: true }).limit(4),
  ]);
  return { posts: postsR.data || [], msgs: msgsR.data || [], events: eventsR.data || [] };
}

const statusColor: Record<string, string> = {
  upcoming: "#1b9aaa", ongoing: "#4fb477", completed: "#94a3b8", cancelled: "#ef4444",
};
const statusLabel: Record<string, string> = {
  upcoming: "Yaklaşan", ongoing: "Devam Ediyor", completed: "Tamamlandı", cancelled: "İptal",
};

export default async function DashboardPage() {
  const [stats, { posts, msgs, events }] = await Promise.all([getStats(), getRecent()]);

  const topCards = [
    { label: "Toplam İçerik", value: stats.totalPosts, sub: `${stats.publishedPosts} yayında`, icon: FileText, color: "#1b9aaa", bg: "rgba(27,154,170,0.10)" },
    { label: "Okunmamış Mesaj", value: stats.unread, sub: `${stats.totalMessages} toplam`, icon: MessageSquare, color: "#ef4444", bg: "rgba(239,68,68,0.10)", alert: stats.unread > 0 },
    { label: "Bülten Abonesi", value: stats.totalSubscribers, sub: "E-posta abonesi", icon: Users, color: "#4fb477", bg: "rgba(79,180,119,0.10)" },
    { label: "Toplam Görüntülenme", value: stats.totalViews, sub: "Tüm içerikler", icon: Eye, color: "#6c63ff", bg: "rgba(108,99,255,0.10)" },
    { label: "Etkinlik", value: stats.totalEvents, sub: `${stats.upcomingEvents} yaklaşan`, icon: Calendar, color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
    { label: "Anket", value: stats.totalSurveys, sub: `${stats.activeSurveys} aktif`, icon: ClipboardList, color: "#06b6d4", bg: "rgba(6,182,212,0.10)" },
  ];

  const typeCards = [
    { label: "Makale", icon: BookOpen, color: "#1b9aaa", count: stats.typeCounts.article, href: "/admin/posts?type=article" },
    { label: "Haber", icon: Newspaper, color: "#4fb477", count: stats.typeCounts.news, href: "/admin/posts?type=news" },
    { label: "Duyuru", icon: Megaphone, color: "#f59e0b", count: stats.typeCounts.announcement, href: "/admin/posts?type=announcement" },
    { label: "Eğitim", icon: GraduationCap, color: "#6c63ff", count: stats.typeCounts.training, href: "/admin/posts?type=training" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Hoş geldiniz, Adem Bey 👋</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/events/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "rgba(27,154,170,0.10)", color: "#1b9aaa", border: "1px solid rgba(27,154,170,0.20)" }}>
            <Calendar className="w-4 h-4" /> Etkinlik Ekle
          </Link>
          <Link href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
            style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 4px 14px rgba(27,154,170,0.30)" }}>
            <Plus className="w-4 h-4" /> Yeni İçerik
          </Link>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {topCards.map(({ label, value, sub, icon: Icon, color, bg, alert }) => (
          <div key={label} className="p-4 rounded-2xl relative" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            {alert && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-2xl font-black" style={{ color: "#0f172a" }}>{value}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: "#334155" }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Type counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {typeCards.map(({ label, icon: Icon, color, count, href }) => (
          <Link key={label} href={href}
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-black" style={{ color: "#0f172a" }}>{count}</p>
              <p className="text-xs" style={{ color: "#64748b" }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent posts */}
        <div className="lg:col-span-1 rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h2 className="font-bold text-sm" style={{ color: "#0f172a" }}>Son İçerikler</h2>
            <Link href="/admin/posts" className="text-xs flex items-center gap-1 font-semibold" style={{ color: "#1b9aaa" }}>
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
            {posts.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: "#94a3b8" }}>İçerik yok</p>
            ) : posts.map((post: any) => (
              <Link key={post.id} href={`/admin/posts/${post.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#334155" }}>{post.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{formatDate(post.created_at)}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={post.published ? { background: "rgba(79,180,119,0.12)", color: "#4fb477" } : { background: "#f1f5f9", color: "#94a3b8" }}>
                  {post.published ? "Yayında" : "Taslak"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="lg:col-span-1 rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h2 className="font-bold text-sm flex items-center gap-2" style={{ color: "#0f172a" }}>
              Mesajlar
              {stats.unread > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
                  {stats.unread} yeni
                </span>
              )}
            </h2>
            <Link href="/admin/messages" className="text-xs flex items-center gap-1 font-semibold" style={{ color: "#1b9aaa" }}>
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
            {msgs.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: "#94a3b8" }}>Mesaj yok</p>
            ) : msgs.map((msg: any) => (
              <div key={msg.id} className="px-5 py-3 hover:bg-slate-50 transition-colors"
                style={!msg.read ? { background: "rgba(27,154,170,0.04)" } : {}}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!msg.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1b9aaa" }} />}
                      <p className="text-sm font-semibold truncate" style={{ color: "#334155" }}>{msg.name}</p>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#64748b" }}>{msg.subject}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{formatDate(msg.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="lg:col-span-1 rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h2 className="font-bold text-sm" style={{ color: "#0f172a" }}>Yaklaşan Etkinlikler</h2>
            <Link href="/admin/events" className="text-xs flex items-center gap-1 font-semibold" style={{ color: "#1b9aaa" }}>
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm mb-2" style={{ color: "#94a3b8" }}>Etkinlik yok</p>
                <Link href="/admin/events/new" className="text-xs font-semibold" style={{ color: "#1b9aaa" }}>
                  + Etkinlik Ekle
                </Link>
              </div>
            ) : events.map((ev: any) => (
              <Link key={ev.id} href={`/admin/events/${ev.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(27,154,170,0.10)" }}>
                  <Calendar className="w-4 h-4" style={{ color: "#1b9aaa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#334155" }}>{ev.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                    {new Date(ev.event_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: `${statusColor[ev.status] || "#94a3b8"}18`, color: statusColor[ev.status] || "#94a3b8" }}>
                  {statusLabel[ev.status] || ev.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
