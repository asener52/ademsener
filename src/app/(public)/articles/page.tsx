import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, Search, Star, Eye, Calendar } from "lucide-react";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";
import type { Post } from "@/types";

async function getPosts(type?: string): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  const { data } = await query;
  return data || [];
}

const tabs = [
  { value: "all", label: "Tümü" },
  { value: "article", label: "Makaleler" },
  { value: "news", label: "Son Gelişmeler" },
  { value: "announcement", label: "Duyurular" },
  { value: "training", label: "Eğitimler" },
];

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const activeType = params.type || "all";
  const posts = await getPosts(activeType);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" /> İçerikler
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Makaleler & İçerikler
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CBS, GIS, yazılım geliştirme ve teknoloji üzerine yazılar, duyurular ve eğitim kaynakları
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/articles" : `/articles?type=${tab.value}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeType === tab.value
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Henüz içerik bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1"
              >
                {post.cover_image ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-sky-500/10 to-violet-500/10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                    <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeColors[post.type] || typeColors.article}`}>
                      {typeLabels[post.type] || post.type}
                    </span>
                    {post.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.view_count}
                    </div>
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
