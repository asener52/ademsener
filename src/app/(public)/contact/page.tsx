"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", subject: "", body: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.86)",
    borderRadius: "16px",
    padding: "15px 16px",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div className="p-[58px]">
      <div className="kicker">📬 İletişim</div>

      <h2 style={{
        fontSize: "clamp(32px, 4vw, 54px)",
        lineHeight: 1.05,
        letterSpacing: "-2px",
        fontWeight: 900,
        marginBottom: "40px",
        color: "var(--text)",
      }}>
        Harita tabanlı bir fikri<br />
        <span className="gradient-text">güçlü bir ürüne dönüştürelim.</span>
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "24px", alignItems: "stretch" }}>
        {/* Info */}
        <div
          className="p-7"
          style={{ borderRadius: "30px", background: "rgba(255,255,255,0.78)", border: "1px solid rgba(255,255,255,0.88)", boxShadow: "0 18px 42px rgba(31,90,110,0.10)" }}
        >
          <h3 className="text-[22px] font-bold mb-3" style={{ color: "var(--text)" }}>Bir proje konuşalım</h3>
          <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
            Web CBS, belediye uygulamaları, drone verisi, 3D model görüntüleme veya kurumsal yazılım geliştirme konularında iletişime geçebilirsiniz.
          </p>

          {[
            { icon: "📧", label: "E-posta", val: "iletisim@ademsener.org" },
            { icon: "🌐", label: "Web", val: "ademsener.org" },
            { icon: "📍", label: "Konum", val: "Ünye / Ordu" },
            { icon: "⏱️", label: "Yanıt", val: "24 saat içinde" },
          ].map(({ icon, label, val }) => (
            <div key={label} className="flex items-center gap-3 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-lg">{icon}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{val}</p>
              </div>
            </div>
          ))}

          {/* Expertise tags */}
          <div className="mt-5">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>Çalışma Konuları</p>
            <div className="flex flex-wrap gap-2">
              {["CBS / GIS", "WebGIS", "Belediye", "Drone", "3D Model", "Yazılım"].map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          className="p-7"
          style={{ borderRadius: "30px", background: "rgba(255,255,255,0.78)", border: "1px solid rgba(255,255,255,0.88)", boxShadow: "0 18px 42px rgba(31,90,110,0.10)" }}
        >
          <h3 className="text-[22px] font-bold mb-6" style={{ color: "var(--text)" }}>Mesaj gönder</h3>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 text-3xl" style={{ background: "rgba(79,180,119,0.15)" }}>
                ✅
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Mesajınız İletildi!</h3>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>En kısa sürede size geri dönüş yapacağım.</p>
              <button
                onClick={() => setStatus("idle")}
                className="font-bold text-sm text-white transition-all hover:-translate-y-1"
                style={{ padding: "12px 24px", borderRadius: "14px", background: "linear-gradient(135deg, #1b9aaa, #4fb477)", border: "none", cursor: "pointer" }}
              >
                Yeni Mesaj
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <input
                  type="text" required placeholder="Ad Soyad"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="email" required placeholder="E-posta"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <input
                type="text" required placeholder="Konu"
                value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={inputStyle}
              />
              <textarea
                required placeholder="Projenizden kısaca bahsedin..."
                rows={6} value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                style={{ ...inputStyle, resize: "vertical", minHeight: "130px" }}
              />

              {status === "error" && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", color: "#dc2626", fontSize: 14 }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Mesaj gönderilemedi. Lütfen tekrar deneyin.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2.5 font-black text-sm text-white transition-all hover:-translate-y-1 disabled:opacity-60"
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #1b9aaa, #4fb477)",
                  boxShadow: "0 16px 36px rgba(27,154,170,0.28)",
                }}
              >
                {status === "loading" ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gönderiliyor...</>
                ) : (
                  <><Send className="w-4 h-4" /> Mesajı Gönder</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
