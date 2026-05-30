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
    <div style={{ padding: 48 }}>
      <div className="kicker">✉️ Gelen Kutusu</div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)", display: "flex", alignItems: "center", gap: 12 }}>
          Mesajlar
          {unread > 0 && (
            <span style={{ fontSize: 14, fontWeight: 800, padding: "4px 12px", borderRadius: 10, background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
              {unread} yeni
            </span>
          )}
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{messages.length} mesaj</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
            <MessageSquare style={{ width: 40, height: 40, color: "rgba(22,48,64,0.15)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--muted)" }}>Henüz mesaj yok.</p>
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} style={{
            padding: "22px 24px", borderRadius: 22, transition: "transform 0.22s ease",
            background: !msg.read ? "rgba(27,154,170,0.04)" : "rgba(255,255,255,0.76)",
            border: !msg.read ? "1px solid rgba(27,154,170,0.18)" : "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 10px 24px rgba(31,90,110,0.07)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  {!msg.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />}
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{msg.name}</h3>
                  <span style={{ color: "rgba(22,48,64,0.20)" }}>·</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Mail style={{ width: 12, height: 12 }} /> {msg.email}
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", marginBottom: 10 }}>{msg.subject}</p>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{msg.body}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
                  <Calendar style={{ width: 12, height: 12 }} />
                  {formatDate(msg.created_at)}
                </div>
              </div>
              {!msg.read && <MarkReadButton messageId={msg.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
