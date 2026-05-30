import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Newspaper, Eye, Calendar, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("type", "news")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" /> Güncel
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Son Gelişmeler</h1>
          <p className="text-slate-500 dark:text-slate-400">CBS, GIS ve teknoloji dünyasındaki güncel gelişmeler</p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Henüz içerik bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {post.cover_image ? (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/10 to-sky-500/10 flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-emerald-500/30" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Son Gelişme</span>
                    {post.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</div>
                    <div className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.view_count}</div>
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
