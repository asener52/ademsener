import { query } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Eye, Star } from "lucide-react";
import { formatDate, typeLabels } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";

async function getPosts(type?: string) {
  if (type && type !== "all") {
    return query<any>("SELECT * FROM posts WHERE type = ? ORDER BY created_at DESC", [type]);
  }
  return query<any>("SELECT * FROM posts ORDER BY created_at DESC");
}

const tabs = [
  { value: "all",          label: "Tümü" },
  { value: "article",      label: "Makale" },
  { value: "news",         label: "Haber" },
  { value: "announcement", label: "Duyuru" },
  { value: "training",     label: "Eğitim" },
  { value: "project",      label: "Proje" },
  { value: "publication",  label: "Yayın" },
];

const typeChip: Record<string, { bg: string; color: string }> = {
  article:      { bg: "rgba(27,154,170,0.10)",  color: "#1b9aaa" },
  news:         { bg: "rgba(79,180,119,0.10)",  color: "#4fb477" },
  announcement: { bg: "rgba(245,158,11,0.10)",  color: "#f59e0b" },
  training:     { bg: "rgba(108,99,255,0.10)",  color: "#6c63ff" },
  project:      { bg: "rgba(239,68,68,0.10)",   color: "#ef4444" },
  publication:  { bg: "rgba(128,90,213,0.10)",  color: "#805ad5" },
};

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const activeType = params.type || "all";
  const posts = await getPosts(activeType);

  return (
    <div style={{ padding: 48 }}>
      <div className="kicker">📝 İçerik Yönetimi</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text)" }}>İçerikler</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{posts.length} içerik bulundu</p>
        </div>
        <Link href="/admin/posts/new"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 16, fontSize: 14, fontWeight: 800, textDecoration: "none", color: "#fff", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 10px 24px rgba(27,154,170,0.28)" }}>
          <Plus style={{ width: 16, height: 16 }} /> Yeni İçerik
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {tabs.map(tab => (
          <Link key={tab.value}
            href={tab.value === "all" ? "/admin/posts" : `/admin/posts?type=${tab.value}`}
            style={{
              padding: "9px 18px", borderRadius: 14, fontSize: 13, fontWeight: 700, textDecoration: "none",
              ...(activeType === tab.value
                ? { background: "linear-gradient(135deg,var(--primary),var(--secondary))", color: "#fff", boxShadow: "0 6px 16px rgba(27,154,170,0.25)" }
                : { background: "rgba(255,255,255,0.76)", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 4px 10px rgba(31,90,110,0.06)" }),
            }}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, overflow: "hidden", boxShadow: "0 14px 32px rgba(31,90,110,0.09)" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <p style={{ color: "var(--muted)", marginBottom: 14, fontSize: 14 }}>Bu kategoride içerik yok.</p>
            <Link href="/admin/posts/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
              <Plus style={{ width: 14, height: 14 }} /> İlk içeriği oluştur
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(22,48,64,0.08)" }}>
                  {["Başlık", "Tür", "Durum", "Görüntülenme", "Tarih", ""].map(h => (
                    <th key={h} style={{ textAlign: h === "" ? "right" : "left", padding: "14px 20px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => {
                  const chip = typeChip[post.type] || typeChip.article;
                  return (
                    <tr key={post.id} style={{ borderBottom: "1px solid rgba(22,48,64,0.05)", transition: "background 0.18s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(27,154,170,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {post.featured && <Star style={{ width: 13, height: 13, fill: "#f59e0b", color: "#f59e0b", flexShrink: 0 }} />}
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{post.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8, background: chip.bg, color: chip.color }}>
                          {typeLabels[post.type] || post.type}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <TogglePublishButton postId={post.id} published={post.published} />
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: 13, color: "var(--muted)" }}>{post.view_count ?? 0}</span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(post.created_at)}</span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                          <Link href={`/articles/${post.slug}`} target="_blank"
                            style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center", transition: "all 0.18s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,154,170,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
                            <Eye style={{ width: 15, height: 15 }} />
                          </Link>
                          <Link href={`/admin/posts/${post.id}`}
                            style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center", transition: "all 0.18s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,99,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
                            <Edit style={{ width: 15, height: 15 }} />
                          </Link>
                          <DeletePostButton postId={post.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
