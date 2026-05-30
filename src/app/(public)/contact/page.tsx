"use client";

import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Phone, Clock } from "lucide-react";

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
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", body: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-sm font-medium mb-6">
            <Mail className="w-4 h-4" /> İletişim
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Bana Ulaşın
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CBS projeleri, yazılım geliştirme veya herhangi bir konu hakkında mesaj gönderebilirsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            {[
              {
                icon: MapPin,
                title: "Konum",
                value: "Ünye Belediyesi\nBilgi İşlem Müdürlüğü\nOrdu, Türkiye",
                color: "sky"
              },
              {
                icon: Mail,
                title: "E-posta",
                value: "iletisim@ademsener.com",
                color: "violet"
              },
              {
                icon: Clock,
                title: "Yanıt Süresi",
                value: "Genellikle 24 saat içinde\nyaniıt veririm.",
                color: "emerald"
              },
            ].map(({ icon: Icon, title, value, color }) => (
              <div key={title} className={`flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-500`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white">
              <MapPin className="w-8 h-8 mb-3 text-white/80" />
              <h3 className="font-bold mb-2">CBS Projeleri</h3>
              <p className="text-sm text-sky-100 leading-relaxed">
                Coğrafi Bilgi Sistemleri, WebGIS, mekansal analiz ve harita uygulamaları konularında danışmanlık için iletişime geçebilirsiniz.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Mesaj Gönder</h2>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Mesajınız İletildi!</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">En kısa sürede size geri dönüş yapacağım.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2 rounded-xl bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 transition-colors"
                  >
                    Yeni Mesaj
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ad Soyad *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors text-sm"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-posta *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors text-sm"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Konu *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors text-sm"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mesaj *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors text-sm resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold transition-colors shadow-lg"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Mesaj Gönder
                      </>
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
