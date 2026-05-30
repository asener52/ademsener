import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText, MessageSquare, Users, Eye, Plus, ArrowRight,
  Newspaper, BookOpen, Megaphone, GraduationCap, Calendar, ClipboardList,
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
  return {
    totalPosts: postsR.count || 0,
    publishedPosts: postsR.data?.filter(p => p.published).length || 0,
    totalMessages: messagesR.count || 0, unread,
    totalSubscribers: subsR.count || 0, totalViews,
    totalEvents: eventsR.count || 0,
    upcomingEvents: eventsR.data?.filter(e => e.status === "upcoming").length || 0,
    totalSurveys: surveysR.count || 0,
    activeSurveys: surveysR.data?.filter(s => s.is_active).length || 0,
    typeCounts: {
      article:      postsR.data?.filter(p => p.type === "article").length || 0,
      news:         postsR.data?.filter(p => p.type === "news").length || 0,
      announcement: postsR.data?.filter(p => p.type === "announcement").length || 0,
      training:     postsR.data?.filter(p => p.type === "training").length || 0,
    },
  };
}

async function getRecent() {
  const supabase = await createClient();
  const [postsR, msgsR, eventsR] = await Promise.all([
    supabase.from("posts").select("id,title,type,published,created_at,view_count").order("created_at", { ascending: false }).limit(5),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("events").select("id,title,event_date,status").order("event_date", { ascending: true }).limit(4),
  ]);
  return { posts: postsR.data || [], msgs: msgsR.data || [], events: eventsR.data || [] };
}

const statusColor: Record<string, string> = { upcoming: "var(--primary)", ongoing: "var(--secondary)", completed: "var(--muted)", cancelled: "#ef4444" };
const statusLabel: Record<string, string> = { upcoming: "Yaklaşan", ongoing: "Devam Ediyor", completed: "Tamamlandı", cancelled: "İptal" };

// ── Bileşenler ──────────────────────────────────────
const card = (content: React.ReactNode, style?: React.CSSProperties) => (
  <div style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 12px 28px rgba(31,90,110,0.08)", ...style }}>
    {content}
  </div>
);

export default async function DashboardPage() {
  const [stats, { posts, msgs, events }] = await Promise.all([getStats(), getRecent()]);

  const topCards = [
    { label: "Toplam İçerik",        value: stats.totalPosts,        sub: `${stats.publishedPosts} yayında`,    icon: FileText,     color: "var(--primary)",   bg: "rgba(27,154,170,0.10)" },
    { label: "Okunmamış Mesaj",       value: stats.unread,            sub: `${stats.totalMessages} toplam`,      icon: MessageSquare,color: "#ef4444",           bg: "rgba(239,68,68,0.10)", alert: stats.unread > 0 },
    { label: "Bülten Abonesi",        value: stats.totalSubscribers,  sub: "E-posta abonesi",                    icon: Users,        color: "var(--secondary)", bg: "rgba(79,180,119,0.10)" },
    { label: "Görüntülenme",          value: stats.totalViews,        sub: "Tüm içerikler",                      icon: Eye,          color: "var(--accent)",    bg: "rgba(108,99,255,0.10)" },
    { label: "Etkinlik",              value: stats.totalEvents,       sub: `${stats.upcomingEvents} yaklaşan`,   icon: Calendar,     color: "#f59e0b",           bg: "rgba(245,158,11,0.10)" },
    { label: "Anket",                 value: stats.totalSurveys,      sub: `${stats.activeSurveys} aktif`,       icon: ClipboardList,color: "#06b6d4",           bg: "rgba(6,182,212,0.10)" },
  ];

  const typeCards = [
    { label: "Makale",  icon: BookOpen,   color: "var(--primary)",   bg: "rgba(27,154,170,0.10)",  count: stats.typeCounts.article,      href: "/admin/posts?type=article" },
    { label: "Haber",   icon: Newspaper,  color: "var(--secondary)", bg: "rgba(79,180,119,0.10)",  count: stats.typeCounts.news,         href: "/admin/posts?type=news" },
    { label: "Duyuru",  icon: Megaphone,  color: "#f59e0b",          bg: "rgba(245,158,11,0.10)",  count: stats.typeCounts.announcement, href: "/admin/posts?type=announcement" },
    { label: "Eğitim",  icon: GraduationCap, color: "var(--accent)", bg: "rgba(108,99,255,0.10)", count: stats.typeCounts.training,     href: "/admin/posts?type=training" },
  ];

  return (
    <div style={{ padding: "48px 48px 48px" }}>
      {/* Header */}
      <div className="kicker" style={{ marginBottom: 8 }}>⚙️ Yönetim Paneli</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)", lineHeight: 1 }}>
            Hoş geldiniz, <span style={{ background: "linear-gradient(135deg,var(--primary),var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Adem Bey</span> 👋
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/events/new"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 14, fontSize: 13, fontWeight: 700, textDecoration: "none", background: "rgba(255,255,255,0.80)", border: "1px solid var(--border)", color: "var(--text)", boxShadow: "0 6px 16px rgba(31,90,110,0.06)" }}>
            <Calendar style={{ width: 15, height: 15, color: "var(--primary)" }} /> Etkinlik
          </Link>
          <Link href="/admin/posts/new"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 14, fontSize: 13, fontWeight: 700, textDecoration: "none", background: "linear-gradient(135deg,var(--primary),var(--secondary))", color: "#fff", boxShadow: "0 10px 24px rgba(27,154,170,0.28)" }}>
            <Plus style={{ width: 15, height: 15 }} /> Yeni İçerik
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 18 }}>
        {topCards.map(({ label, value, sub, icon: Icon, color, bg, alert }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 22, padding: "20px 18px", boxShadow: "0 10px 24px rgba(31,90,110,0.07)", position: "relative" }}>
            {alert && <div style={{ position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />}
            <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", marginBottom: 14, background: bg }}>
              <Icon style={{ width: 18, height: 18, color }} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{label}</p>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Type quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {typeCards.map(({ label, icon: Icon, color, bg, count, href }) => (
          <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 20, textDecoration: "none", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 8px 20px rgba(31,90,110,0.06)", transition: "transform 0.22s ease, box-shadow 0.22s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(31,90,110,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 20px rgba(31,90,110,0.06)"; }}>
            <div style={{ width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center", background: bg, flexShrink: 0 }}>
              <Icon style={{ width: 17, height: 17, color }} />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>{count}</p>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>

        {/* Recent posts */}
        <div style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(22,48,64,0.07)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>Son İçerikler</p>
            <Link href="/admin/posts" style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Tümü <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div>
            {posts.length === 0 ? (
              <p style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: "var(--muted)" }}>İçerik yok</p>
            ) : posts.map((post: any) => (
              <Link key={post.id} href={`/admin/posts/${post.id}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", textDecoration: "none", borderBottom: "1px solid rgba(22,48,64,0.05)", transition: "background 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(27,154,170,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</p>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{formatDate(post.created_at)}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 8, flexShrink: 0, ...(post.published ? { background: "rgba(79,180,119,0.12)", color: "var(--secondary)" } : { background: "rgba(22,48,64,0.06)", color: "var(--muted)" }) }}>
                  {post.published ? "Yayında" : "Taslak"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(22,48,64,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>Mesajlar</p>
              {stats.unread > 0 && (
                <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>{stats.unread} yeni</span>
              )}
            </div>
            <Link href="/admin/messages" style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Tümü <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div>
            {msgs.length === 0 ? (
              <p style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: "var(--muted)" }}>Mesaj yok</p>
            ) : msgs.map((msg: any) => (
              <div key={msg.id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(22,48,64,0.05)", background: !msg.read ? "rgba(27,154,170,0.04)" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {!msg.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />}
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.name}</p>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject}</p>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, opacity: 0.7 }}>{formatDate(msg.created_at)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, overflow: "hidden", boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(22,48,64,0.07)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>Etkinlikler</p>
            <Link href="/admin/events" style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Tümü <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div>
            {events.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 20px" }}>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>Etkinlik yok</p>
                <Link href="/admin/events/new" style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>+ Etkinlik Ekle</Link>
              </div>
            ) : events.map((ev: any) => {
              const d = new Date(ev.event_date);
              return (
                <Link key={ev.id} href={`/admin/events/${ev.id}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", textDecoration: "none", borderBottom: "1px solid rgba(22,48,64,0.05)", transition: "background 0.18s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(27,154,170,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(27,154,170,0.08)", flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "var(--primary)", lineHeight: 1 }}>{d.getDate()}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{d.toLocaleString("tr-TR", { month: "short" })}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[ev.status] || "var(--muted)" }}>{statusLabel[ev.status]}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
