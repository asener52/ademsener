import { query } from "@/lib/db";
import Link from "next/link";
import { FileText, Eye, Calendar, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function PublicationsPage() {
  const posts = await query<any>(
    "SELECT * FROM posts WHERE published = 1 AND type = 'publication' ORDER BY created_at DESC"
  );
  posts.forEach((p: any) => {
    if (p.tags && typeof p.tags === "string") { try { p.tags = JSON.parse(p.tags); } catch { p.tags = []; } }
  });

  return (
    <div className="p-[58px]">
      <div className="kicker">📄 Yayınlar</div>
      <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", fontWeight: 900, marginBottom: "32px", color: "var(--text)" }}>
        Yayınlarım
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", borderRadius: 28, background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.80)" }}>
          <FileText style={{ width: 48, height: 48, margin: "0 auto 16px", color: "rgba(22,48,64,0.15)" }} />
          <p style={{ color: "var(--muted)", fontWeight: 500 }}>Henüz yayın eklenmemiş</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Akademik yayınlar yakında eklenecek.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              style={{ display: "flex", gap: 20, padding: 24, borderRadius: 22, background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 10px 28px rgba(31,90,110,0.08)", textDecoration: "none", transition: "all 0.3s" }}
            >
              <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: "rgba(27,154,170,0.08)", border: "1px solid rgba(27,154,170,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText style={{ width: 22, height: 22, color: "var(--primary)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <h2 style={{ fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>{post.title}</h2>
                  {post.featured ? <Star style={{ width: 16, height: 16, color: "#f59e0b", flexShrink: 0 }} fill="#f59e0b" /> : null}
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, lineHeight: 1.6 }}>{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {post.tags.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar style={{ width: 12, height: 12 }} />{formatDate(post.created_at)}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye style={{ width: 12, height: 12 }} />{post.view_count} görüntülenme</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
