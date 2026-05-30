"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",           label: "Ana Sayfa" },
  { href: "/skills",     label: "Uzmanlık" },
  { href: "/projects",   label: "Projeler" },
  { href: "/experience", label: "Deneyim" },
  { href: "/articles",   label: "İçerikler" },
  { href: "/contact",    label: "İletişim" },
];

export function MobileTopbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-4"
      style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(22,48,64,0.10)" }}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #1b9aaa, #4fb477)" }}>
          <MapPin className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold leading-none" style={{ color: "#163040" }}>Adem Şener</p>
          <p className="text-[10px] font-medium" style={{ color: "#5f7787" }}>CBS Uzmanı · Yazılım</p>
        </div>
      </Link>

      <button onClick={() => setOpen(!open)} className="p-2 rounded-xl" style={{ color: "#5f7787" }}>
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 p-3 shadow-xl" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(22,48,64,0.10)" }}>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                color: pathname === href ? "#1b9aaa" : "#5f7787",
                background: pathname === href ? "rgba(27,154,170,0.10)" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
