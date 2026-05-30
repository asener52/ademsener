import { query } from "@/lib/db";
import Link from "next/link";
import { Megaphone, Eye, Calendar, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AnnouncementsPage() {
  const posts = await query<any>(
    "SELECT * FROM posts WHERE published = 1 AND type = 'announcement' ORDER BY created_at DESC"
  );

  return (
    <div className="p-[58px]">
      <div className="kicker">📢 Duyurular</div>
      <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", fontWeight: 900, marginBottom: "32px", color: "var(--text)" }}>
        Duyurular
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", borderRadius: 28, background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.80)" }}>
          <Megaphone style={{ width: 48, height: 48, margin: "0 auto 16px", color: "rgba(22,48,64,0.15)" }} />
          <p style={{ color: "var(--muted)" }}>Henüz duyuru bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: 20, borderRadius: 22, background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 10px 28px rgba(31,90,110,0.08)", textDecoration: "none", transition: "all 0.2s" }}
            >
              <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Megaphone style={{ width: 22, height: 22, color: "#f59e0b" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <h2 style={{ fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</h2>
                  {post.featured ? <Star style={{ width: 16, height: 16, color: "#f59e0b", flexShrink: 0 }} fill="#f59e0b" /> : null}
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--muted)" }}>
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
