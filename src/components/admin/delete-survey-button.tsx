"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteSurveyButton({ surveyId }: { surveyId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu anketi ve tüm yanıtları silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    await fetch(`/api/admin/surveys/${surveyId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button onClick={handleDelete} disabled={loading}
      className="p-1.5 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50"
      style={{ color: "#94a3b8" }}
      onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
      onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
      title="Sil">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
