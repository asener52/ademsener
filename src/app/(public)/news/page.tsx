import { query } from "@/lib/db";
import Link from "next/link";
import { Newspaper, Eye, Calendar, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function NewsPage() {
  const posts = await query<any>(
    "SELECT * FROM posts WHERE published = 1 AND type = 'news' ORDER BY created_at DESC"
  );

  return (
    <div className="p-[58px]">
      <div className="kicker">📰 Güncel</div>
      <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", fontWeight: 900, marginBottom: "32px", color: "var(--text)" }}>
        Son Gelişmeler
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", borderRadius: 28, background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.80)" }}>
          <Newspaper style={{ width: 48, height: 48, margin: "0 auto 16px", color: "rgba(22,48,64,0.15)" }} />
          <p style={{ color: "var(--muted)" }}>Henüz içerik bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              style={{ display: "flex", flexDirection: "column", borderRadius: 26, background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 18px 40px rgba(31,90,110,0.10)", overflow: "hidden", textDecoration: "none", transition: "all 0.3s" }}
            >
              {post.cover_image ? (
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <img src={post.cover_image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(27,154,170,0.10), rgba(108,99,255,0.08))" }}>
                  <Newspaper style={{ width: 40, height: 40, color: "rgba(27,154,170,0.30)" }} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 20, background: "rgba(79,180,119,0.12)", color: "var(--secondary)", border: "1px solid rgba(79,180,119,0.20)" }}>Son Gelişme</span>
                  {post.featured ? <Star style={{ width: 14, height: 14, color: "#f59e0b" }} fill="#f59e0b" /> : null}
                </div>
                <h3 style={{ fontWeight: 700, color: "var(--text)", fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)", flex: 1, marginBottom: 16, lineHeight: 1.6 }}>{post.excerpt}</p>
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
