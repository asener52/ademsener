"use client";

import Link from "next/link";
import { MapPin, Mail, ExternalLink, ArrowRight, Code2, Globe, ChevronRight } from "lucide-react";
import { useState } from "react";

const links = {
  içerikler: [
    { href: "/news",          label: "Son Gelişmeler" },
    { href: "/articles",      label: "Makaleler" },
    { href: "/announcements", label: "Duyurular" },
    { href: "/trainings",     label: "Eğitimler" },
    { href: "/projects",      label: "Projeler" },
    { href: "/publications",  label: "Yayınlar" },
  ],
  sayfalar: [
    { href: "/about",         label: "Hakkımda" },
    { href: "/about#skills",  label: "Beceriler" },
    { href: "/about#experience", label: "Deneyim" },
    { href: "/contact",       label: "İletişim" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setSubscribed(true); setEmail(""); }
    } catch {}
    setLoading(false);
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
      {/* BG glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-sky-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 border-b border-white/5">

          {/* Brand - 4 col */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-shadow">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Adem ŞENER</p>
                <p className="text-[10px] text-sky-400 tracking-widest uppercase font-medium">CBS · Yazılım</p>
              </div>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              Ünye Belediyesi Bilgi İşlem Müdürlüğü bünyesinde CBS Uzmanı ve Yazılım Geliştirici olarak görev yapıyorum. Mekansal veri ve modern web teknolojilerini bir araya getiriyorum.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {["CBS / GIS", "WebGIS", "Node.js", "React"].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-white/4 border border-white/6 text-xs text-slate-500">{t}</span>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { icon: ExternalLink, href: "#", label: "GitHub" },
                { icon: ExternalLink, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "/contact", label: "E-posta" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/4 border border-white/6 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-400 flex items-center justify-center text-slate-500 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* İçerikler - 2 col */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-5">İçerikler</h4>
            <ul className="space-y-3">
              {links.içerikler.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200">
                    <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-sky-500 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sayfalar - 2 col */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-5">Sayfalar</h4>
            <ul className="space-y-3">
              {links.sayfalar.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200">
                    <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-sky-500 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - 4 col */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-5">E-Bülten</h4>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              CBS, GIS ve yazılım dünyasındaki gelişmelerden haberdar olmak için bültenime abone olun.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Abone oldunuz!</p>
                  <p className="text-xs text-emerald-500/60">Teşekkürler, haberdar olacaksınız.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresiniz"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 hover:border-white/12 focus:border-sky-500/40 text-sm text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white transition-colors flex-shrink-0"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-700 mt-2">Spam yok. İstediğiniz zaman çıkabilirsiniz.</p>
              </form>
            )}

            {/* Contact info */}
            <div className="mt-6 p-4 rounded-xl bg-white/2 border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Konum</p>
                  <p className="text-xs text-slate-600">Ünye / Ordu, Türkiye</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-slate-700">
          <p>© {new Date().getFullYear()} <span className="text-slate-500">Adem ŞENER</span> · Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>CBS & GIS</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Code2 className="w-3 h-3" />
              <span>Next.js · Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
