"use client";

import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export function MarkReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();

  const markRead = async () => {
    await fetch(`/api/admin/messages/${messageId}`, { method: "PATCH" });
    router.refresh();
  };

  return (
    <button onClick={markRead}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "1px solid rgba(27,154,170,0.20)", background: "rgba(27,154,170,0.08)", color: "var(--primary)", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(27,154,170,0.08)"; e.currentTarget.style.color = "var(--primary)"; }}>
      <CheckCheck style={{ width: 14, height: 14 }} /> Okundu
    </button>
  );
}
