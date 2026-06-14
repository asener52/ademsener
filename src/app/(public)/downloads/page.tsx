import { query } from "@/lib/db";
import { Download, FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DownloadsPage() {
  let downloads: any[] = [];
  try {
    downloads = await query("SELECT * FROM downloads ORDER BY created_at DESC");
  } catch { downloads = []; }

  return (
    <div className="p-[58px]">
      <div className="kicker">📥 Dosyalar</div>
      <h2 style={{ fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.05, letterSpacing: "-2px", fontWeight: 900, marginBottom: 10, color: "var(--text)" }}>
        İndirilebilir <span className="gradient-text">Dosyalar</span>
      </h2>
      <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 40 }}>Sunumlar, belgeler ve diğer paylaşılan dosyalar.</p>

      {downloads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", background: "rgba(255,255,255,0.60)", borderRadius: 28, border: "1px solid rgba(255,255,255,0.80)" }}>
          <Download style={{ width: 48, height: 48, color: "rgba(22,48,64,0.15)", margin: "0 auto 14px" }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--muted)" }}>Henüz dosya paylaşılmadı.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {downloads.map((dl: any) => (
            <a
              key={dl.id}
              href={`/api/downloads/${dl.id}`}
              style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 22, boxShadow: "0 10px 24px rgba(31,90,110,0.07)", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 16, display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgba(27,154,170,0.12),rgba(108,99,255,0.08))", border: "1px solid rgba(27,154,170,0.15)", flexShrink: 0 }}>
                <FileText style={{ width: 24, height: 24, color: "var(--primary)" }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dl.title}</p>
                {dl.description && (
                  <p style={{ fontSize: 13, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dl.description}</p>
                )}
                <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  <span>{dl.original_name}</span>
                  <span>·</span>
                  <span>{formatBytes(dl.file_size)}</span>
                  <span>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar style={{ width: 11, height: 11 }} />{formatDate(dl.created_at)}
                  </span>
                  <span>·</span>
                  <span>{dl.download_count} indirme</span>
                </div>
              </div>

              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 14, background: "linear-gradient(135deg,var(--primary),var(--secondary))", color: "#fff", fontSize: 13, fontWeight: 800, boxShadow: "0 6px 16px rgba(27,154,170,0.25)" }}>
                <Download style={{ width: 15, height: 15 }} />
                İndir
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
