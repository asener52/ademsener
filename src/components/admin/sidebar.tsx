"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin, LayoutDashboard, FileText, MessageSquare, User,
  LogOut, ChevronRight, Mail, Calendar, ClipboardList,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Genel",
    items: [
      { href: "/admin/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
      { href: "/admin/messages",   label: "Mesajlar",     icon: MessageSquare },
    ],
  },
  {
    label: "İçerik",
    items: [
      { href: "/admin/posts",      label: "Yazılar",      icon: FileText },
      { href: "/admin/events",     label: "Etkinlikler",  icon: Calendar },
      { href: "/admin/surveys",    label: "Anketler",     icon: ClipboardList },
    ],
  },
  {
    label: "Yönetim",
    items: [
      { href: "/admin/newsletter", label: "Bülten",       icon: Mail },
      { href: "/admin/about",      label: "Hakkımda",     icon: User },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: "#ffffff", borderRight: "1px solid #e2e8f0" }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 6px 16px rgba(27,154,170,0.28)" }}
          >
            <MapPin className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: "#0f172a" }}>Admin Panel</p>
            <p className="text-xs font-semibold" style={{ color: "#1b9aaa" }}>Adem ŞENER</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-black uppercase tracking-widest px-3 mb-2" style={{ color: "#94a3b8" }}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                      active
                        ? "border"
                        : "hover:bg-slate-50"
                    )}
                    style={active ? {
                      background: "rgba(27,154,170,0.08)",
                      borderColor: "rgba(27,154,170,0.20)",
                      color: "#1b9aaa",
                    } : { color: "#64748b" }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight className="w-3 h-3 opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid #e2e8f0" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-red-50"
          style={{ color: "#94a3b8" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
