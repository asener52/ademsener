import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import { MarkReadButton } from "@/components/admin/mark-read-button";

async function getMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            Mesajlar
            {unread > 0 && (
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 font-semibold">
                {unread} yeni
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{messages.length} mesaj</p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">Henüz mesaj yok.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all ${
                !msg.read
                  ? "bg-sky-500/5 border-sky-500/20"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />}
                    <h3 className="font-semibold text-white">{msg.name}</h3>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {msg.email}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-sky-400 mb-2">{msg.subject}</p>
                  <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{msg.body}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(msg.created_at)}
                  </div>
                </div>
                {!msg.read && <MarkReadButton messageId={msg.id} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
