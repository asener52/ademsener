"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function TogglePublishButton({ postId, published }: { postId: string; published: boolean }) {
  const [state, setState] = useState(published);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const next = !state;
    await fetch(`/api/admin/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    setState(next);
    router.refresh();
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 8,
        fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s",
        ...(state
          ? { background: "rgba(79,180,119,0.12)", color: "var(--secondary)" }
          : { background: "rgba(22,48,64,0.07)", color: "var(--muted)" }),
      }}>
      {state ? <Eye style={{ width: 12, height: 12 }} /> : <EyeOff style={{ width: 12, height: 12 }} />}
      {state ? "Yayında" : "Taslak"}
    </button>
  );
}
