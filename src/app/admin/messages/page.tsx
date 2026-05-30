import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import { MarkReadButton } from "@/components/admin/mark-read-button";

async function getMessages() {
  const supabase = await createClient();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return data || [];
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black flex items-center gap-3" style={{ color: "#0f172a" }}>
          Mesajlar
          {unread > 0 && (
            <span className="text-sm px-2.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
              {unread} yeni
            </span>
          )}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>{messages.length} mesaj</p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: "#cbd5e1" }} />
            <p style={{ color: "#94a3b8" }}>Henüz mesaj yok.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-5 rounded-2xl transition-all"
              style={{
                background: !msg.read ? "rgba(27,154,170,0.04)" : "#ffffff",
                border: !msg.read ? "1px solid rgba(27,154,170,0.20)" : "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#1b9aaa" }} />}
                    <h3 className="font-bold" style={{ color: "#0f172a" }}>{msg.name}</h3>
                    <span style={{ color: "#cbd5e1" }}>·</span>
                    <span className="text-xs flex items-center gap-1" style={{ color: "#94a3b8" }}>
                      <Mail className="w-3 h-3" /> {msg.email}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "#1b9aaa" }}>{msg.subject}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#64748b" }}>{msg.body}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: "#94a3b8" }}>
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
