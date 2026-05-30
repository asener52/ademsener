"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MapPin, Sun, Moon, Menu, X, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Anasayfa" },
  {
    label: "İçerikler",
    children: [
      { href: "/news",          label: "Son Gelişmeler",  dot: "bg-emerald-400" },
      { href: "/articles",      label: "Makaleler",       dot: "bg-sky-400" },
      { href: "/announcements", label: "Duyurular",       dot: "bg-amber-400" },
      { href: "/trainings",     label: "Eğitimler",       dot: "bg-violet-400" },
      { href: "/projects",      label: "Projeler",        dot: "bg-rose-400" },
      { href: "/publications",  label: "Yayınlar",        dot: "bg-cyan-400" },
    ],
  },
  { href: "/about",   label: "Hakkımda" },
  { href: "/contact", label: "İletişim" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled
        ? "py-0"
        : "py-2"
    )}>
      {/* Blur backdrop */}
      <div className={cn(
        "absolute inset-0 transition-all duration-500",
        scrolled
          ? "bg-slate-950/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20"
          : "bg-transparent"
      )} />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-all duration-300 group-hover:scale-105">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white tracking-tight leading-none">Adem ŞENER</p>
              <p className="text-[10px] text-sky-400 tracking-widest uppercase font-medium mt-0.5">CBS · Yazılım</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="relative" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                    <button className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      "text-slate-400 hover:text-white hover:bg-white/5"
                    )}>
                      {item.label}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", dropdown && "rotate-180")} />
                    </button>

                    {dropdown && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                        <div className="w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden p-1.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setDropdown(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                                pathname === child.href
                                  ? "bg-white/10 text-white"
                                  : "text-slate-400 hover:text-white hover:bg-white/5"
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", child.dot)} />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "text-white bg-white/8"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-105"
            >
              <Mail className="w-3.5 h-3.5" />
              İletişim
            </Link>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-all duration-200"
              aria-label="Tema"
            >
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
            </button>

            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
            <div className="p-4 space-y-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">Anasayfa</Link>
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">İçerikler</p>
                {navItems[1].children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className={cn("w-2 h-2 rounded-full", child.dot)} />
                    {child.label}
                  </Link>
                ))}
              </div>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">Hakkımda</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-400 border border-sky-500/20">İletişim</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
