import { query } from "@/lib/db";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { EventCard } from "@/components/admin/event-card";

async function getEvents() {
  try {
    return await query<any>("SELECT * FROM events ORDER BY event_date ASC");
  } catch { return []; }
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
