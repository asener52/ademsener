"use client";

import Link from "next/link";
import { MapPin, ExternalLink, Mail, Code2, Globe } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setSubscribed(true); setEmail(""); }
    } catch {}
  };

  return (
    <footer className="bg-slate-950 dark:bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Adem ŞENER</p>
                <p className="text-xs text-sky-400">CBS & Yazılım</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Ünye Belediyesi Bilgi İşlem Müdürlüğü bünyesinde CBS Uzmanı ve Yazılım Geliştirici olarak çalışmaktayım.
            </p>
            <div className="flex gap-3">
              {[
                { icon: ExternalLink, href: "#", label: "GitHub" },
                { icon: ExternalLink, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "/contact", label: "E-posta" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 flex items-center justify-center text-slate-400 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">İçerikler</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/news", label: "Son Gelişmeler" },
                { href: "/articles", label: "Makaleler" },
                { href: "/announcements", label: "Duyurular" },
                { href: "/trainings", label: "Eğitimler" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "Hakkımda" },
                { href: "/contact", label: "İletişim" },
                { href: "/about#skills", label: "Beceriler" },
                { href: "/about#experience", label: "Deneyim" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Bülten</h3>
            <p className="text-sm text-slate-400 mb-4">
              Yeni içeriklerden haberdar olmak için bültene abone olun.
            </p>
            {subscribed ? (
              <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
                Abone olduğunuz için teşekkürler!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
                >
                  Abone Ol
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Adem ŞENER. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Globe className="w-3 h-3" />
            <span>CBS & Yazılım</span>
            <span className="mx-1">·</span>
            <Code2 className="w-3 h-3" />
            <span>Next.js + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
