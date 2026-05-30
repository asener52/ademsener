import { createClient } from "@/lib/supabase/server";
import { Mail, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false });

  return (
    <div style={{ padding: 48 }}>
      <div className="kicker">📬 Bülten</div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)" }}>Aboneler</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{count} e-posta abonesi</p>
      </div>

      {/* Stat */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        <div style={{ padding: "22px 20px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 10px 24px rgba(31,90,110,0.07)" }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(27,154,170,0.10)", marginBottom: 14 }}>
            <Users style={{ width: 20, height: 20, color: "var(--primary)" }} />
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>{count}</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Toplam Abone</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, overflow: "hidden", boxShadow: "0 14px 32px rgba(31,90,110,0.09)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "14px 24px", borderBottom: "1px solid rgba(22,48,64,0.07)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>
          <span>E-posta</span>
          <span>Kayıt Tarihi</span>
        </div>
        <div>
          {subscribers?.map((sub) => (
            <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "13px 24px", alignItems: "center", borderBottom: "1px solid rgba(22,48,64,0.04)", transition: "background 0.18s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(27,154,170,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail style={{ width: 15, height: 15, color: "var(--muted)", flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{sub.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                <Calendar style={{ width: 13, height: 13 }} />
                {formatDate(sub.created_at)}
              </div>
            </div>
          ))}
          {(!subscribers || subscribers.length === 0) && (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <Mail style={{ width: 36, height: 36, color: "rgba(22,48,64,0.12)", margin: "0 auto 10px" }} />
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Henüz abone yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
