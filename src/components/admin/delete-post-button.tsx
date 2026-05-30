"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DeletePostButton({ postId }: { postId: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", postId);
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
        >
          Evet
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
        >
          İptal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      title="Sil"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
