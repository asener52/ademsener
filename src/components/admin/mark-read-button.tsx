"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export function MarkReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();

  const markRead = async () => {
    const supabase = createClient();
    await supabase.from("messages").update({ read: true }).eq("id", messageId);
    router.refresh();
  };

  return (
    <button
      onClick={markRead}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white text-xs font-medium transition-all"
    >
      <CheckCheck className="w-3.5 h-3.5" />
      Okundu
    </button>
  );
}
