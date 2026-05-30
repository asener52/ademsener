import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Calendar, MapPin, Wifi, Users } from "lucide-react";
import { DeleteEventButton } from "@/components/admin/delete-event-button";

async function getEvents() {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
  return data || [];
}

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  upcoming:  { bg: "rgba(27,154,170,0.10)",  color: "#1b9aaa",  label: "Yaklaşan" },
  ongoing:   { bg: "rgba(79,180,119,0.10)",  color: "#4fb477",  label: "Devam Ediyor" },
  completed: { bg: "rgba(100,116,139,0.10)", color: "#64748b",  label: "Tamamlandı" },
  cancelled: { bg: "rgba(239,68,68,0.10)",   color: "#ef4444",  label: "İptal Edildi" },
};

const typeStyle: Record<string, { bg: string; color: string; label: string }> = {
  event:    { bg: "rgba(108,99,255,0.10)", color: "#6c63ff", label: "Etkinlik" },
  seminar:  { bg: "rgba(27,154,170,0.10)", color: "#1b9aaa", label: "Seminer" },
  workshop: { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", label: "Çalıştay" },
  training: { bg: "rgba(79,180,119,0.10)", color: "#4fb477", label: "Eğitim" },
  meeting:  { bg: "rgba(100,116,139,0.10)",color: "#64748b", label: "Toplantı" },
};

export default async function EventsPage() {
  const events = await getEvents();

  const upcoming = events.filter(e => e.status === "upcoming" || e.status === "ongoing");
  const past = events.filter(e => e.status === "completed" || e.status === "cancelled");

  function EventCard({ ev }: { ev: any }) {
    const st = statusStyle[ev.status] || statusStyle.upcoming;
    const ty = typeStyle[ev.type] || typeStyle.event;
    const date = new Date(ev.event_date);
    return (
      <div className="p-5 rounded-2xl flex gap-4 transition-all hover:-translate-y-0.5"
        style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {/* Date box */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center"
          style={{ background: "rgba(27,154,170,0.08)", border: "1px solid rgba(27,154,170,0.15)" }}>
          <span className="text-xl font-black leading-none" style={{ color: "#1b9aaa" }}>
            {date.getDate()}
          </span>
          <span className="text-[10px] font-bold uppercase" style={{ color: "#64748b" }}>
            {date.toLocaleString("tr-TR", { month: "short" })}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: ty.bg, color: ty.color }}>
                {ty.label}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                {st.label}
              </span>
              {ev.is_online && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: "rgba(6,182,212,0.10)", color: "#06b6d4" }}>
                  <Wifi className="w-3 h-3" /> Online
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link href={`/admin/events/${ev.id}`}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: "#94a3b8" }}>
                <Edit className="w-4 h-4" />
              </Link>
              <DeleteEventButton eventId={ev.id} />
            </div>
          </div>
          <h3 className="font-bold text-base mb-1 truncate" style={{ color: "#0f172a" }}>{ev.title}</h3>
          {ev.description && (
            <p className="text-sm line-clamp-1 mb-2" style={{ color: "#64748b" }}>{ev.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs" style={{ color: "#94a3b8" }}>
            {ev.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {ev.location}
              </span>
            )}
            {ev.max_participants && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> Maks. {ev.max_participants} kişi
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date.toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Etkinlikler</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>{events.length} etkinlik · {upcoming.length} yaklaşan</p>
        </div>
        <Link href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 4px 14px rgba(27,154,170,0.28)" }}>
          <Plus className="w-4 h-4" /> Yeni Etkinlik
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: "#e2e8f0" }} />
          <p className="font-semibold mb-2" style={{ color: "#334155" }}>Henüz etkinlik yok</p>
          <Link href="/admin/events/new" className="text-sm font-semibold" style={{ color: "#1b9aaa" }}>
            + İlk etkinliği oluştur
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
                Yaklaşan & Devam Eden
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcoming.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
                Geçmiş Etkinlikler
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {past.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
