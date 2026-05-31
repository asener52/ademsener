"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

interface EventData {
  id?: string;
  title?: string;
  description?: string;
  location?: string;
  event_date?: string;
  end_date?: string;
  type?: string;
  status?: string;
  max_participants?: number | null;
  is_online?: boolean;
  registration_url?: string;
  tags?: string[];
}

export function EventEditor({ event }: { event?: EventData | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toDatetimeLocal = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    event_date: toDatetimeLocal(event?.event_date),
    end_date: toDatetimeLocal(event?.end_date),
    type: event?.type || "event",
    status: event?.status || "upcoming",
    max_participants: event?.max_participants ?? "",
    is_online: event?.is_online ?? false,
    registration_url: event?.registration_url || "",
    tags: (event?.tags || []).join(", "),
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        max_participants: form.max_participants ? Number(form.max_participants) : null,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      };
      const url = event?.id ? `/api/admin/events/${event.id}` : "/api/admin/events";
      const method = event?.id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      router.push("/yonetim/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: 14,
    border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a",
    outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Title */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <label style={labelStyle}>Başlık *</label>
        <input style={inputStyle} required value={form.title} onChange={e => set("title", e.target.value)} placeholder="Etkinlik başlığı..." />
      </div>

      {/* Type / Status / Online */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label style={labelStyle}>Tür</label>
            <select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="event">Etkinlik</option>
              <option value="seminar">Seminer</option>
              <option value="workshop">Çalıştay</option>
              <option value="training">Eğitim</option>
              <option value="meeting">Toplantı</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Durum</label>
            <select style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="upcoming">Yaklaşan</option>
              <option value="ongoing">Devam Ediyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl" style={{ border: "1px solid #e2e8f0", background: form.is_online ? "rgba(6,182,212,0.06)" : "#f8fafc" }}>
              <div
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{ background: form.is_online ? "#06b6d4" : "#cbd5e1" }}
                onClick={() => set("is_online", !form.is_online)}
              >
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                  style={{ left: form.is_online ? "calc(100% - 20px)" : 4 }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: form.is_online ? "#06b6d4" : "#64748b" }}>Online Etkinlik</span>
            </label>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Başlangıç Tarihi & Saati *</label>
            <input type="datetime-local" style={inputStyle} required value={form.event_date} onChange={e => set("event_date", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Bitiş Tarihi & Saati</label>
            <input type="datetime-local" style={inputStyle} value={form.end_date} onChange={e => set("end_date", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Location / Participants */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Lokasyon / Platform</label>
            <input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Ünye Belediyesi Kültür Merkezi..." />
          </div>
          <div>
            <label style={labelStyle}>Maksimum Katılımcı</label>
            <input type="number" min={1} style={inputStyle} value={form.max_participants} onChange={e => set("max_participants", e.target.value)} placeholder="Sınırsız için boş bırakın" />
          </div>
        </div>
      </div>

      {/* Registration URL */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <label style={labelStyle}>Kayıt / Başvuru Linki</label>
        <input type="url" style={inputStyle} value={form.registration_url} onChange={e => set("registration_url", e.target.value)} placeholder="https://..." />
      </div>

      {/* Description */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <label style={labelStyle}>Açıklama</label>
        <textarea rows={5} style={{ ...inputStyle, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Etkinlik detayları..." />
      </div>

      {/* Tags */}
      <div className="p-5 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <label style={labelStyle}>Etiketler (virgülle ayırın)</label>
        <input style={inputStyle} value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="CBS, WebGIS, eğitim..." />
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.20)" }}>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 4px 14px rgba(27,154,170,0.28)" }}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {event?.id ? "Güncelle" : "Kaydet"}
        </button>
        <a href="/yonetim/events" className="px-6 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-slate-100"
          style={{ color: "#64748b", border: "1px solid #e2e8f0" }}>
          İptal
        </a>
      </div>
    </form>
  );
}
