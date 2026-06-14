import { query } from "@/lib/db";
import { DownloadsManager } from "@/components/admin/downloads-manager";

export const dynamic = "force-dynamic";

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
    <div style={{ padding: 48 }}>
      <div className="kicker">📥 Dosya Yönetimi</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 32 }}>İndirmeler</h1>
      <DownloadsManager downloads={downloads} formatBytes={formatBytes} />
    </div>
  );
}
