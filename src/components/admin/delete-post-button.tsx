"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeletePostButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu içeriği silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button onClick={handleDelete} disabled={loading}
      style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.18s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
      title="Sil">
      {loading ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> : <Trash2 style={{ width: 15, height: 15 }} />}
    </button>
  );
}
