import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, Eye, Calendar, Star, Search } from "lucide-react";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";
import type { Post } from "@/types";

async function getPosts(type?: string): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (type && type !== "all") query = query.eq("type", type);
  const { data } = await query;
  return data || [];
}

const tabs = [
  { value: "all",          label: "Tümü" },
  { value: "article",      label: "Makaleler" },
  { value: "news",         label: "Son Gelişmeler" },
  { value: "announcement", label: "Duyurular" },
  { value: "training",     label: "Eğitimler" },
  { value: "project",      label: "Projeler" },
  { value: "publication",  label: "Yayınlar" },
];

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const activeType = params.type || "all";
  const posts = await getPosts(activeType);

  return (
    <div className="bg-slate-950 min-h-screen py-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-3.5 h-3.5" /> Tüm İçerikler
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">İçerikler</h1>
          <p className="text-slate-500 max-w-xl mx-auto">CBS, GIS, yazılım geliştirme ve teknoloji üzerine yazılar, projeler, duyurular ve eğitim kaynakları</p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 justify-center p-1.5 rounded-2xl bg-slate-900/60 border border-white/5 max-w-3xl mx-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/articles" : `/articles?type=${tab.value}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeType === tab.value
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-24 rounded-2xl bg-slate-900/50 border border-white/5">
            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Bu kategoride henüz içerik bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex flex-col rounded-2xl bg-slate-900/80 border border-white/6 hover:border-white/14 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30"
              >
                {post.cover_image ? (
                  <div className="aspect-video overflow-hidden relative">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 map-grid-dense opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/8 to-violet-500/8" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-white/8" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeColors[post.type] || typeColors.article}`}>
                      {typeLabels[post.type] || post.type}
                    </span>
                    {post.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </div>
                  <h2 className="font-bold text-white mb-2 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">{post.title}</h2>
                  <p className="text-sm text-slate-500 flex-1 line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/6 text-slate-500">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-3 h-3" />{post.view_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
