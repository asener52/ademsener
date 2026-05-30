"use client";

import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Clock, MessageSquare } from "lucide-react";

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

  return (
    <div className="bg-slate-950 min-h-screen py-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Mail className="w-3.5 h-3.5" /> İletişim
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">Bana Ulaşın</h1>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            CBS projeleri, yazılım geliştirme veya herhangi bir iş birliği için mesaj gönderebilirsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Info panel */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, title: "Konum", value: "Ünye Belediyesi\nBilgi İşlem Müdürlüğü\nOrdu, Türkiye", color: "sky" },
              { icon: Mail, title: "E-posta", value: "iletisim@ademsener.org", color: "violet" },
              { icon: Clock, title: "Yanıt Süresi", value: "Genellikle 24 saat\niçinde yanıt veririm.", color: "emerald" },
              { icon: MessageSquare, title: "Çalışma Konuları", value: "CBS, GIS, WebGIS\nYazılım Geliştirme\nMekansal Analiz", color: "amber" },
            ].map(({ icon: Icon, title, value, color }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl bg-slate-900/80 border border-white/6 hover:border-white/10 transition-all group">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">{title}</p>
                  <p className="text-sm text-slate-400 whitespace-pre-line leading-relaxed">{value}</p>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-sky-600/20 to-violet-600/20 border border-white/10">
              <div className="absolute inset-0 map-grid opacity-20" />
              <div className="relative">
                <MapPin className="w-8 h-8 text-sky-400 mb-3" />
                <h3 className="font-bold text-white mb-2">CBS Projeleri</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Coğrafi Bilgi Sistemleri, WebGIS ve mekansal analiz konularında danışmanlık için iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-white/6">
              <h2 className="text-xl font-bold text-white mb-6">Mesaj Gönder</h2>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Mesajınız İletildi!</h3>
                  <p className="text-slate-500 text-sm mb-6">En kısa sürede size geri dönüş yapacağım.</p>
                  <button onClick={() => setStatus("idle")} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors">
                    Yeni Mesaj
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ad Soyad *</label>
                      <input
                        type="text" required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/12 focus:border-sky-500/50 text-white placeholder-slate-600 text-sm focus:outline-none transition-all"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">E-posta *</label>
                      <input
                        type="email" required value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/12 focus:border-sky-500/50 text-white placeholder-slate-600 text-sm focus:outline-none transition-all"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Konu *</label>
                    <input
                      type="text" required value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/12 focus:border-sky-500/50 text-white placeholder-slate-600 text-sm focus:outline-none transition-all"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mesaj *</label>
                    <textarea
                      required rows={7} value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/12 focus:border-sky-500/50 text-white placeholder-slate-600 text-sm focus:outline-none transition-all resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2.5 text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </div>
                  )}

                  <button
                    type="submit" disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:-translate-y-0.5"
                  >
                    {status === "loading" ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Gönderiliyor...</>
                    ) : (
                      <><Send className="w-4 h-4" />Mesaj Gönder</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
