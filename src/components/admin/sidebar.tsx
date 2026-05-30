"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin, LayoutDashboard, FileText, MessageSquare, User,
  LogOut, ChevronRight, Mail, Calendar, ClipboardList,
} from "lucide-react";
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
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-aside">
      {/* Brand */}
      <div>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{
              width: 54, height: 54, borderRadius: 18, display: "grid", placeItems: "center",
              color: "white", background: "linear-gradient(135deg,var(--primary),var(--secondary))",
              boxShadow: "0 14px 32px rgba(27,154,170,0.28)", flexShrink: 0,
            }}>
              <MapPin style={{ width: 24, height: 24, strokeWidth: 2.5 }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", lineHeight: 1.2 }}>Admin Panel</p>
              <p style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700, marginTop: 3 }}>Adem ŞENER</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {navGroups.map((group) => (
            <div key={group.label}>
              <p style={{
                fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.10em", color: "var(--muted)", padding: "0 8px", marginBottom: 6,
              }}>
                {group.label}
              </p>
              <div style={{ display: "grid", gap: 3 }}>
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 14px", borderRadius: 16,
                        fontSize: 14, fontWeight: 700, textDecoration: "none",
                        transition: "all 0.25s ease",
                        ...(active ? {
                          background: "rgba(255,255,255,0.82)",
                          boxShadow: "0 10px 24px rgba(31,90,110,0.10)",
                          color: "var(--primary)",
                          transform: "translateX(4px)",
                        } : {
                          background: "transparent",
                          color: "var(--muted)",
                        }),
                      }}
                    >
                      <Icon style={{ width: 17, height: 17, flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{label}</span>
                      {active && <ChevronRight style={{ width: 13, height: 13, opacity: 0.6 }} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          padding: "14px 16px", borderRadius: 20,
          background: "linear-gradient(135deg,rgba(27,154,170,0.10),rgba(108,99,255,0.08))",
          border: "1px solid rgba(255,255,255,0.60)",
          marginBottom: 8,
        }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 4 }}>Kurum</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>Ünye Belediyesi Bilgi İşlem</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", borderRadius: 14, border: 0, cursor: "pointer",
            fontSize: 13, fontWeight: 700, background: "transparent",
            color: "var(--muted)", fontFamily: "inherit",
            transition: "all 0.22s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
