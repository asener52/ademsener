import { query } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Calendar, MapPin, Wifi, Users } from "lucide-react";
import { DeleteEventButton } from "@/components/admin/delete-event-button";

async function getEvents() {
  try {
    return await query<any>("SELECT * FROM events ORDER BY event_date ASC");
  } catch { return []; }
}

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  upcoming:  { bg: "rgba(27,154,170,0.10)",  color: "var(--primary)",   label: "Yaklaşan" },
  ongoing:   { bg: "rgba(79,180,119,0.10)",  color: "var(--secondary)", label: "Devam Ediyor" },
  completed: { bg: "rgba(22,48,64,0.07)",    color: "var(--muted)",     label: "Tamamlandı" },
  cancelled: { bg: "rgba(239,68,68,0.10)",   color: "#ef4444",          label: "İptal Edildi" },
};

const typeStyle: Record<string, { bg: string; color: string; label: string }> = {
  event:    { bg: "rgba(108,99,255,0.10)", color: "var(--accent)",   label: "Etkinlik" },
  seminar:  { bg: "rgba(27,154,170,0.10)", color: "var(--primary)",  label: "Seminer" },
  workshop: { bg: "rgba(245,158,11,0.10)", color: "#f59e0b",         label: "Çalıştay" },
  training: { bg: "rgba(79,180,119,0.10)", color: "var(--secondary)",label: "Eğitim" },
  meeting:  { bg: "rgba(22,48,64,0.07)",   color: "var(--muted)",    label: "Toplantı" },
};

function EventCard({ ev }: { ev: any }) {
  const st = statusStyle[ev.status] || statusStyle.upcoming;
  const ty = typeStyle[ev.type] || typeStyle.event;
  const date = new Date(ev.event_date);
  return (
    <div style={{ padding: "20px 22px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 22, display: "flex", gap: 16, boxShadow: "0 10px 24px rgba(31,90,110,0.07)", transition: "transform 0.22s ease, box-shadow 0.22s ease" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 42px rgba(31,90,110,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 24px rgba(31,90,110,0.07)"; }}>
      {/* Date box */}
      <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(27,154,170,0.08)", border: "1px solid rgba(27,154,170,0.14)" }}>
        <span style={{ fontSize: 20, fontWeight: 900, lineHeight: 1, color: "var(--primary)" }}>{date.getDate()}</span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)" }}>
          {date.toLocaleString("tr-TR", { month: "short" })}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 8, background: ty.bg, color: ty.color }}>{ty.label}</span>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 8, background: st.bg, color: st.color }}>{st.label}</span>
            {ev.is_online && (
              <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(6,182,212,0.10)", color: "#06b6d4" }}>
                <Wifi style={{ width: 11, height: 11 }} /> Online
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <Link href={`/yonetim/events/${ev.id}`}
              style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,99,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
              <Edit style={{ width: 15, height: 15 }} />
            </Link>
            <DeleteEventButton eventId={ev.id} />
          </div>
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</h3>
        {ev.description && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.description}</p>
        )}
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--muted)" }}>
          {ev.location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin style={{ width: 11, height: 11 }} />{ev.location}</span>}
          {ev.max_participants && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users style={{ width: 11, height: 11 }} />Maks. {ev.max_participants}</span>}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar style={{ width: 11, height: 11 }} />
            {date.toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter(e => e.status === "upcoming" || e.status === "ongoing");
  const past = events.filter(e => e.status === "completed" || e.status === "cancelled");

  return (
    <div style={{ padding: 48 }}>
      <div className="kicker">📅 Takvim</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)" }}>Etkinlikler</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{events.length} etkinlik · {upcoming.length} yaklaşan</p>
        </div>
        <Link href="/yonetim/events/new"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 16, fontSize: 14, fontWeight: 800, textDecoration: "none", color: "#fff", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 10px 24px rgba(27,154,170,0.28)" }}>
          <Plus style={{ width: 16, height: 16 }} /> Yeni Etkinlik
        </Link>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <Calendar style={{ width: 48, height: 48, color: "rgba(22,48,64,0.12)", margin: "0 auto 14px" }} />
          <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Henüz etkinlik yok</p>
          <Link href="/yonetim/events/new" style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>+ İlk etkinliği oluştur</Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--primary)", marginBottom: 14 }}>Yaklaşan & Devam Eden</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))", gap: 14 }}>
                {upcoming.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--muted)", marginBottom: 14 }}>Geçmiş</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))", gap: 14, opacity: 0.75 }}>
                {past.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
