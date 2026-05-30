import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GraduationCap, Eye, Calendar, Star, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function TrainingsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("type", "training")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" /> Eğitimler
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Eğitimler</h1>
          <p className="text-slate-500 dark:text-slate-400">CBS, GIS ve yazılım geliştirme konularında eğitim kaynakları</p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Henüz eğitim içeriği bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-violet-500/5 to-sky-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-violet-500" />
                    </div>
                    {post.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">{post.title}</h2>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 line-clamp-3 mb-4">{post.excerpt}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.view_count}</span>
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
