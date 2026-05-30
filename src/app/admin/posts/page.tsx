import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Filter } from "lucide-react";
import { formatDate, typeLabels, typeColors } from "@/lib/utils";
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
  { value: "news", label: "Son Gelişme" },
  { value: "announcement", label: "Duyuru" },
  { value: "training", label: "Eğitim" },
];

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const activeType = params.type || "all";
  const posts = await getPosts(activeType);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">İçerik Yönetimi</h1>
          <p className="text-slate-400 text-sm mt-1">{posts.length} içerik bulundu</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni İçerik
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/posts" : `/admin/posts?type=${tab.value}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeType === tab.value
                ? "bg-sky-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500">Henüz içerik yok.</p>
            <Link href="/admin/posts/new" className="mt-4 inline-flex items-center gap-2 text-sky-400 text-sm hover:text-sky-300">
              <Plus className="w-4 h-4" /> İlk içeriği oluştur
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Başlık</th>
                  <th className="text-left px-5 py-3">Tür</th>
                  <th className="text-left px-5 py-3">Durum</th>
                  <th className="text-left px-5 py-3">Görüntülenme</th>
                  <th className="text-left px-5 py-3">Tarih</th>
                  <th className="text-right px-5 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {post.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <span className="text-sm font-medium text-slate-200 line-clamp-1 max-w-xs">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${typeColors[post.type] || typeColors.article}`}>
                        {typeLabels[post.type] || post.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <TogglePublishButton postId={post.id} published={post.published} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-400">{post.view_count}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">{formatDate(post.created_at)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/articles/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
