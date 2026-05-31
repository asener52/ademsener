"use client";

import Link from "next/link";
import { Eye, Edit, Star } from "lucide-react";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";
import { formatDate, typeLabels } from "@/lib/utils";

const typeChip: Record<string, { bg: string; color: string }> = {
  article:      { bg: "rgba(27,154,170,0.10)",  color: "#1b9aaa" },
  news:         { bg: "rgba(79,180,119,0.10)",  color: "#4fb477" },
  announcement: { bg: "rgba(245,158,11,0.10)",  color: "#f59e0b" },
  training:     { bg: "rgba(108,99,255,0.10)",  color: "#6c63ff" },
  project:      { bg: "rgba(239,68,68,0.10)",   color: "#ef4444" },
  publication:  { bg: "rgba(128,90,213,0.10)",  color: "#805ad5" },
};

export function PostsTable({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "64px 24px" }}>
        <p style={{ color: "var(--muted)", marginBottom: 14, fontSize: 14 }}>Bu kategoride içerik yok.</p>
        <Link href="/yonetim/posts/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
          İlk içeriği oluştur
        </Link>
      </div>
    );
  }

  return (
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
              <tr key={post.id} style={{ borderBottom: "1px solid rgba(22,48,64,0.05)" }}
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
                      style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center" }}>
                      <Eye style={{ width: 15, height: 15 }} />
                    </Link>
                    <Link href={`/yonetim/posts/${post.id}`}
                      style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center" }}>
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
  );
}
