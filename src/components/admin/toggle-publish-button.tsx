"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function TogglePublishButton({ postId, published }: { postId: string; published: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("posts").update({ published: !published }).eq("id", postId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
        published
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
          : "bg-slate-700/50 text-slate-400 border-slate-600 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20"
      }`}
    >
      {published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {published ? "Yayında" : "Taslak"}
    </button>
  );
}
