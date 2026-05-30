"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MapPin, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",              label: "Ana Sayfa",    num: "01" },
  { href: "/skills",        label: "Uzmanlık",     num: "02" },
  { href: "/projects",      label: "Projeler",     num: "03" },
  { href: "/experience",    label: "Deneyim",      num: "04" },
  { href: "/articles",      label: "İçerikler",    num: "05" },
  { href: "/contact",       label: "İletişim",     num: "06" },
];

export function PublicSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
      }}
      className="flex flex-col justify-between p-6 backdrop-blur-2xl"
    >
      <div>
        {/* Brand */}
        <div className="flex items-center gap-4 mb-9">
          <div
            className="w-14 h-14 rounded-[18px] flex items-center justify-center text-white font-black text-xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1b9aaa, #4fb477)",
              boxShadow: "0 14px 32px rgba(27,154,170,0.28)",
            }}
          >
            <MapPin className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold leading-tight" style={{ color: "var(--text)" }}>
              Adem Şener
            </h1>
            <span className="text-[13px] font-medium" style={{ color: "var(--muted)" }}>
              CBS Uzmanı · Yazılım Geliştirici
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2.5">
          {navItems.map(({ href, label, num }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-[15px] rounded-[18px] text-[15px] font-bold transition-all duration-300",
                  active
                    ? "translate-x-1"
                    : "hover:translate-x-1"
                )}
                style={{
                  color: active ? "var(--text)" : "var(--muted)",
                  background: active
                    ? "rgba(255,255,255,0.82)"
                    : "transparent",
                  boxShadow: active
                    ? "0 12px 28px rgba(31,90,110,0.10)"
                    : "none",
                }}
              >
                {label}
                <small
                  className="text-[12px] font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {num}
                </small>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom card + theme */}
      <div className="space-y-3">
        <div
          className="p-[18px] rounded-[22px]"
          style={{
            background: "linear-gradient(135deg, rgba(27,154,170,0.12), rgba(108,99,255,0.10))",
            border: "1px solid rgba(255,255,255,0.70)",
          }}
        >
          <strong className="text-sm" style={{ color: "var(--text)" }}>Harita + Kod + Veri</strong>
          <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--muted)" }}>
            Coğrafi bilgiyi yazılımla birleştirerek karar destek sistemleri, web haritalar ve belediye odaklı dijital çözümler geliştiriyorum.
          </p>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            color: "var(--muted)",
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.5)",
          }}
        >
          <Sun className="w-4 h-4 dark:hidden" />
          <Moon className="w-4 h-4 hidden dark:block" />
          <span className="dark:hidden">Açık Tema</span>
          <span className="hidden dark:block">Koyu Tema</span>
        </button>
      </div>
    </aside>
  );
}
