import { query } from "@/lib/db";
import Link from "next/link";
import { GraduationCap, Eye, Calendar, Star, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function TrainingsPage() {
  const posts = await query<any>(
    "SELECT * FROM posts WHERE published = 1 AND type = 'training' ORDER BY created_at DESC"
  );
  posts.forEach((p: any) => {
    if (p.tags && typeof p.tags === "string") { try { p.tags = JSON.parse(p.tags); } catch { p.tags = []; } }
  });

  return (
    <div className="p-[58px]">
      <div className="kicker">🎓 Eğitimler</div>
      <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", fontWeight: 900, marginBottom: "32px", color: "var(--text)" }}>
        Eğitimler
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", borderRadius: 28, background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.80)" }}>
          <GraduationCap style={{ width: 48, height: 48, margin: "0 auto 16px", color: "rgba(22,48,64,0.15)" }} />
          <p style={{ color: "var(--muted)" }}>Henüz eğitim içeriği bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              style={{ display: "flex", flexDirection: "column", borderRadius: 26, background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 18px 40px rgba(31,90,110,0.10)", overflow: "hidden", textDecoration: "none", transition: "all 0.3s" }}
            >
              <div style={{ padding: 20, borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg, rgba(108,99,255,0.05), rgba(27,154,170,0.05))" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(108,99,255,0.10)", border: "1px solid rgba(108,99,255,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GraduationCap style={{ width: 20, height: 20, color: "var(--accent)" }} />
                  </div>
                  {post.featured ? <Star style={{ width: 16, height: 16, color: "#f59e0b" }} fill="#f59e0b" /> : null}
                </div>
                <h3 style={{ fontWeight: 700, color: "var(--text)", fontSize: 15, lineHeight: 1.4 }}>{post.title}</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 20 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", flex: 1, marginBottom: 16, lineHeight: 1.6 }}>{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {post.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="tag" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                        <Tag style={{ width: 10, height: 10 }} />{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar style={{ width: 12, height: 12 }} />{formatDate(post.created_at)}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye style={{ width: 12, height: 12 }} />{post.view_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
