import { query } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostsTable } from "@/components/admin/posts-table";

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
        <Link href="/yonetim/posts/new"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 16, fontSize: 14, fontWeight: 800, textDecoration: "none", color: "#fff", background: "linear-gradient(135deg,var(--primary),var(--secondary))", boxShadow: "0 10px 24px rgba(27,154,170,0.28)" }}>
          <Plus style={{ width: 16, height: 16 }} /> Yeni İçerik
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {tabs.map(tab => (
          <Link key={tab.value}
            href={tab.value === "all" ? "/yonetim/posts" : `/yonetim/posts?type=${tab.value}`}
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
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}
