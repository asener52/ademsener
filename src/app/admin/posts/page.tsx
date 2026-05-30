import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye, Star } from "lucide-react";
import { formatDate, typeLabels } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";

async function getPosts(type?: string) {
  const supabase = await createClient();
  let query = supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (type && type !== "all") query = query.eq("type", type);
  const { data } = await query;
  return data || [];
}

const tabs = [
  { value: "all", label: "Tümü" },
  { value: "article", label: "Makale" },
  { value: "news", label: "Haber" },
  { value: "announcement", label: "Duyuru" },
  { value: "training", label: "Eğitim" },
  { value: "project", label: "Proje" },
  { value: "publication", label: "Yayın" },
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>İçerik Yönetimi</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>{posts.length} içerik bulundu</p>
        </div>
        <Link href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 4px 14px rgba(27,154,170,0.28)" }}>
          <Plus className="w-4 h-4" /> Yeni İçerik
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tab) => (
          <Link key={tab.value}
            href={tab.value === "all" ? "/admin/posts" : `/admin/posts?type=${tab.value}`}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={activeType === tab.value
              ? { background: "linear-gradient(135deg,#1b9aaa,#4fb477)", color: "#ffffff", boxShadow: "0 3px 10px rgba(27,154,170,0.25)" }
              : { background: "#ffffff", color: "#64748b", border: "1px solid #e2e8f0" }}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-3" style={{ color: "#94a3b8" }}>Bu kategoride içerik yok.</p>
            <Link href="/admin/posts/new" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1b9aaa" }}>
              <Plus className="w-4 h-4" /> İlk içeriği oluştur
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider" style={{ borderBottom: "1px solid #f1f5f9", color: "#94a3b8" }}>
                  <th className="text-left px-5 py-3">Başlık</th>
                  <th className="text-left px-5 py-3">Tür</th>
                  <th className="text-left px-5 py-3">Durum</th>
                  <th className="text-left px-5 py-3">Görüntülenme</th>
                  <th className="text-left px-5 py-3">Tarih</th>
                  <th className="text-right px-5 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => {
                  const chip = typeChip[post.type] || typeChip.article;
                  return (
                    <tr key={post.id} className="transition-colors hover:bg-slate-50" style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {post.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />}
                          <span className="text-sm font-semibold line-clamp-1 max-w-xs" style={{ color: "#334155" }}>{post.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: chip.bg, color: chip.color }}>
                          {typeLabels[post.type] || post.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <TogglePublishButton postId={post.id} published={post.published} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm" style={{ color: "#64748b" }}>{post.view_count ?? 0}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm" style={{ color: "#94a3b8" }}>{formatDate(post.created_at)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/articles/${post.slug}`} target="_blank"
                            className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" style={{ color: "#94a3b8" }} title="Görüntüle">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/posts/${post.id}`}
                            className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" style={{ color: "#94a3b8" }} title="Düzenle">
                            <Edit className="w-4 h-4" />
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
