import Link from "next/link";
import { query } from "@/lib/db";
import {
  FileText, MessageSquare, Users, Eye, Plus, ArrowRight,
  Newspaper, BookOpen, Megaphone, GraduationCap, Calendar, ClipboardList,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getStats() {
  try {
    const [posts, messages, subs, events, surveys] = await Promise.all([
      query("SELECT type, published, view_count FROM posts"),
      query("SELECT `read` FROM messages"),
      query("SELECT id FROM newsletter_subscribers"),
      query("SELECT status FROM events"),
      query("SELECT is_active FROM surveys"),
    ]);
    return {
      totalPosts:       posts.length,
      publishedPosts:   posts.filter(p => p.published).length,
      totalMessages:    messages.length,
      unread:           messages.filter(m => !m.read).length,
      totalSubscribers: subs.length,
      totalViews:       posts.reduce((s: number, p: any) => s + (p.view_count || 0), 0),
      totalEvents:      events.length,
      upcomingEvents:   events.filter(e => e.status === "upcoming").length,
      totalSurveys:     surveys.length,
      activeSurveys:    surveys.filter(s => s.is_active).length,
      typeCounts: {
        article:      posts.filter(p => p.type === "article").length,
        news:         posts.filter(p => p.type === "news").length,
        announcement: posts.filter(p => p.type === "announcement").length,
        training:     posts.filter(p => p.type === "training").length,
      },
    };
  } catch {
    return { totalPosts:0, publishedPosts:0, totalMessages:0, unread:0, totalSubscribers:0, totalViews:0, totalEvents:0, upcomingEvents:0, totalSurveys:0, activeSurveys:0, typeCounts:{article:0,news:0,announcement:0,training:0} };
  }
}

async function getRecent() {
  try {
    const [posts, msgs, events] = await Promise.all([
      query("SELECT id, title, type, published, created_at, view_count FROM posts ORDER BY created_at DESC LIMIT 5"),
      query("SELECT id, name, subject, `read`, created_at FROM messages ORDER BY created_at DESC LIMIT 5"),
      query("SELECT id, title, event_date, status FROM events ORDER BY event_date ASC LIMIT 4"),
    ]);
    return { posts, msgs, events };
  } catch {
    return { posts: [], msgs: [], events: [] };
  }
}

const statusColor: Record<string, string> = { upcoming: "var(--primary)", ongoing: "var(--secondary)", completed: "var(--muted)", cancelled: "#ef4444" };
const statusLabel: Record<string, string> = { upcoming: "Yaklaşan", ongoing: "Devam Ediyor", completed: "Tamamlandı", cancelled: "İptal" };

export default async function DashboardPage() {
  const [stats, { posts, msgs, events }] = await Promise.all([getStats(), getRecent()]);

  const topCards = [
    { label: "Toplam İçerik",   value: stats.totalPosts,       sub: `${stats.publishedPosts} yayında`,   icon: FileText,     color: "var(--primary)",   bg: "rgba(27,154,170,0.10)" },
    { label: "Okunmamış Mesaj", value: stats.unread,           sub: `${stats.totalMessages} toplam`,     icon: MessageSquare,color: "#ef4444",           bg: "rgba(239,68,68,0.10)", alert: stats.unread > 0 },
    { label: "Bülten Abonesi",  value: stats.totalSubscribers, sub: "E-posta abonesi",                   icon: Users,        color: "var(--secondary)", bg: "rgba(79,180,119,0.10)" },
    { label: "Görüntülenme",    value: stats.totalViews,       sub: "Tüm içerikler",                     icon: Eye,          color: "var(--accent)",    bg: "rgba(108,99,255,0.10)" },
    { label: "Etkinlik",        value: stats.totalEvents,      sub: `${stats.upcomingEvents} yaklaşan`,  icon: Calendar,     color: "#f59e0b",           bg: "rgba(245,158,11,0.10)" },
    { label: "Anket",           value: stats.totalSurveys,     sub: `${stats.activeSurveys} aktif`,      icon: ClipboardList,color: "#06b6d4",           bg: "rgba(6,182,212,0.10)" },
  ];

  const typeCards = [
    { label: "Makale", icon: BookOpen,      color: "var(--primary)",   bg: "rgba(27,154,170,0.10)", count: stats.typeCounts.article,      href: "/yonetim/posts?type=article" },
    { label: "Haber",  icon: Newspaper,     color: "var(--secondary)", bg: "rgba(79,180,119,0.10)", count: stats.typeCounts.news,         href: "/yonetim/posts?type=news" },
    { label: "Duyuru", icon: Megaphone,     color: "#f59e0b",          bg: "rgba(245,158,11,0.10)", count: stats.typeCounts.announcement, href: "/yonetim/posts?type=announcement" },
    { label: "Eğitim", icon: GraduationCap, color: "var(--accent)",   bg: "rgba(108,99,255,0.10)", count: stats.typeCounts.training,     href: "/yonetim/posts?type=training" },
  ];

  return (
    <div style={{ padding: "48px" }}>
      <div className="kicker">⚙️ Yönetim Paneli</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <h1 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)" }}>
          Hoş geldiniz, <span style={{ background: "linear-gradient(135deg,var(--primary),var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Adem Bey</span> 👋
        </h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/yonetim/events/new" style={{ display:"flex",alignItems:"center",gap:8,padding:"11px 18px",borderRadius:14,fontSize:13,fontWeight:700,textDecoration:"none",background:"rgba(255,255,255,0.80)",border:"1px solid var(--border)",color:"var(--text)",boxShadow:"0 6px 16px rgba(31,90,110,0.06)" }}>
            <Calendar style={{ width:15,height:15,color:"var(--primary)" }} /> Etkinlik
          </Link>
          <Link href="/yonetim/posts/new" style={{ display:"flex",alignItems:"center",gap:8,padding:"11px 18px",borderRadius:14,fontSize:13,fontWeight:700,textDecoration:"none",background:"linear-gradient(135deg,var(--primary),var(--secondary))",color:"#fff",boxShadow:"0 10px 24px rgba(27,154,170,0.28)" }}>
            <Plus style={{ width:15,height:15 }} /> Yeni İçerik
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:14,marginBottom:18 }}>
        {topCards.map(({ label, value, sub, icon: Icon, color, bg, alert }) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.76)",border:"1px solid rgba(255,255,255,0.86)",borderRadius:22,padding:"20px 18px",boxShadow:"0 10px 24px rgba(31,90,110,0.07)",position:"relative" }}>
            {alert && <div style={{ position:"absolute",top:14,right:14,width:8,height:8,borderRadius:"50%",background:"#ef4444" }} />}
            <div style={{ width:40,height:40,borderRadius:14,display:"grid",placeItems:"center",marginBottom:14,background:bg }}>
              <Icon style={{ width:18,height:18,color }} />
            </div>
            <p style={{ fontSize:26,fontWeight:900,color:"var(--text)",lineHeight:1 }}>{value}</p>
            <p style={{ fontSize:12,fontWeight:700,color:"var(--text)",marginTop:4 }}>{label}</p>
            <p style={{ fontSize:11,color:"var(--muted)",marginTop:2 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Type counts */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28 }}>
        {typeCards.map(({ label, icon: Icon, color, bg, count, href }) => (
          <Link key={label} href={href} style={{ display:"flex",alignItems:"center",gap:12,padding:"16px 18px",borderRadius:20,textDecoration:"none",background:"rgba(255,255,255,0.76)",border:"1px solid rgba(255,255,255,0.86)",boxShadow:"0 8px 20px rgba(31,90,110,0.06)" }}>
            <div style={{ width:38,height:38,borderRadius:13,display:"grid",placeItems:"center",background:bg,flexShrink:0 }}>
              <Icon style={{ width:17,height:17,color }} />
            </div>
            <div>
              <p style={{ fontSize:20,fontWeight:900,color:"var(--text)",lineHeight:1 }}>{count}</p>
              <p style={{ fontSize:12,color:"var(--muted)" }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom panels */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18 }}>
        {/* Posts */}
        <div style={{ background:"rgba(255,255,255,0.76)",border:"1px solid rgba(255,255,255,0.86)",borderRadius:24,overflow:"hidden",boxShadow:"0 12px 28px rgba(31,90,110,0.08)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:"1px solid rgba(22,48,64,0.07)" }}>
            <p style={{ fontWeight:800,fontSize:14,color:"var(--text)" }}>Son İçerikler</p>
            <Link href="/yonetim/posts" style={{ fontSize:12,fontWeight:700,color:"var(--primary)",textDecoration:"none",display:"flex",alignItems:"center",gap:4 }}>Tümü <ArrowRight style={{ width:12,height:12 }} /></Link>
          </div>
          {(posts as any[]).map(p => (
            <Link key={p.id} href={`/yonetim/posts/${p.id}`} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 20px",textDecoration:"none",borderBottom:"1px solid rgba(22,48,64,0.04)" }}>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.title}</p>
                <p style={{ fontSize:11,color:"var(--muted)",marginTop:2 }}>{formatDate(p.created_at)}</p>
              </div>
              <span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:8,flexShrink:0,...(p.published ? {background:"rgba(79,180,119,0.12)",color:"var(--secondary)"} : {background:"rgba(22,48,64,0.06)",color:"var(--muted)"}) }}>
                {p.published ? "Yayında" : "Taslak"}
              </span>
            </Link>
          ))}
          {posts.length === 0 && <p style={{ textAlign:"center",padding:"32px 0",fontSize:13,color:"var(--muted)" }}>İçerik yok</p>}
        </div>

        {/* Messages */}
        <div style={{ background:"rgba(255,255,255,0.76)",border:"1px solid rgba(255,255,255,0.86)",borderRadius:24,overflow:"hidden",boxShadow:"0 12px 28px rgba(31,90,110,0.08)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:"1px solid rgba(22,48,64,0.07)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <p style={{ fontWeight:800,fontSize:14,color:"var(--text)" }}>Mesajlar</p>
              {stats.unread > 0 && <span style={{ fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:8,background:"rgba(239,68,68,0.12)",color:"#ef4444" }}>{stats.unread} yeni</span>}
            </div>
            <Link href="/yonetim/messages" style={{ fontSize:12,fontWeight:700,color:"var(--primary)",textDecoration:"none",display:"flex",alignItems:"center",gap:4 }}>Tümü <ArrowRight style={{ width:12,height:12 }} /></Link>
          </div>
          {(msgs as any[]).map(m => (
            <div key={m.id} style={{ padding:"12px 20px",borderBottom:"1px solid rgba(22,48,64,0.04)",background:!m.read?"rgba(27,154,170,0.04)":"transparent" }}>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                {!m.read && <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--primary)",flexShrink:0 }} />}
                <p style={{ fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.name}</p>
              </div>
              <p style={{ fontSize:12,color:"var(--muted)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.subject}</p>
            </div>
          ))}
          {msgs.length === 0 && <p style={{ textAlign:"center",padding:"32px 0",fontSize:13,color:"var(--muted)" }}>Mesaj yok</p>}
        </div>

        {/* Events */}
        <div style={{ background:"rgba(255,255,255,0.76)",border:"1px solid rgba(255,255,255,0.86)",borderRadius:24,overflow:"hidden",boxShadow:"0 12px 28px rgba(31,90,110,0.08)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:"1px solid rgba(22,48,64,0.07)" }}>
            <p style={{ fontWeight:800,fontSize:14,color:"var(--text)" }}>Etkinlikler</p>
            <Link href="/yonetim/events" style={{ fontSize:12,fontWeight:700,color:"var(--primary)",textDecoration:"none",display:"flex",alignItems:"center",gap:4 }}>Tümü <ArrowRight style={{ width:12,height:12 }} /></Link>
          </div>
          {(events as any[]).map(ev => {
            const d = new Date(ev.event_date);
            return (
              <Link key={ev.id} href={`/yonetim/events/${ev.id}`} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 20px",textDecoration:"none",borderBottom:"1px solid rgba(22,48,64,0.04)" }}>
                <div style={{ width:38,height:38,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(27,154,170,0.08)",flexShrink:0 }}>
                  <span style={{ fontSize:14,fontWeight:900,color:"var(--primary)",lineHeight:1 }}>{d.getDate()}</span>
                  <span style={{ fontSize:9,fontWeight:700,color:"var(--muted)",textTransform:"uppercase" }}>{d.toLocaleString("tr-TR",{month:"short"})}</span>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{ev.title}</p>
                  <span style={{ fontSize:11,fontWeight:700,color:statusColor[ev.status]||"var(--muted)" }}>{statusLabel[ev.status]}</span>
                </div>
              </Link>
            );
          })}
          {events.length === 0 && (
            <div style={{ textAlign:"center",padding:"32px 20px" }}>
              <p style={{ fontSize:13,color:"var(--muted)",marginBottom:8 }}>Etkinlik yok</p>
              <Link href="/yonetim/events/new" style={{ fontSize:12,fontWeight:700,color:"var(--primary)",textDecoration:"none" }}>+ Etkinlik Ekle</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
