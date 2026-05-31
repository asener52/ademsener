"use client";

import { Mail, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function NewsletterList({ subscribers }: { subscribers: any[] }) {
  if (!subscribers || subscribers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <Mail style={{ width: 36, height: 36, color: "rgba(22,48,64,0.12)", margin: "0 auto 10px" }} />
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Henüz abone yok.</p>
      </div>
    );
  }
  return (
    <div>
      {subscribers.map((sub) => (
        <div key={sub.id}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "13px 24px", alignItems: "center", borderBottom: "1px solid rgba(22,48,64,0.04)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(27,154,170,0.03)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail style={{ width: 15, height: 15, color: "var(--muted)", flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{sub.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
            <Calendar style={{ width: 13, height: 13 }} />
            {formatDate(sub.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
}
