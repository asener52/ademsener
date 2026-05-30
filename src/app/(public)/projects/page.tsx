import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FolderOpen, Eye, Calendar, Star, Tag, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("type", "project")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-slate-950 min-h-screen py-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="relative rounded-3xl overflow-hidden p-10 bg-slate-900/80 border border-white/6">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rose-500/8 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-5">
              <FolderOpen className="w-3.5 h-3.5" /> Projeler
            </div>
            <h1 className="text-5xl font-black text-white mb-3">Projelerim</h1>
            <p className="text-slate-400 max-w-xl">CBS ve yazılım geliştirme alanlarında tamamladığım projeler, portföy çalışmaları ve açık kaynak katkılar.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-24 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-rose-400" />
            </div>
            <p className="text-slate-400 font-medium mb-2">Henüz proje eklenmemiş</p>
            <p className="text-slate-600 text-sm">Yakında projelerim burada yayınlanacak.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex flex-col rounded-2xl bg-slate-900/80 border border-white/6 hover:border-rose-500/30 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-500/5"
              >
                {post.cover_image ? (
                  <div className="aspect-video overflow-hidden relative">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-rose-500/10 to-pink-500/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 map-grid opacity-40" />
                    <FolderOpen className="w-10 h-10 text-rose-500/30 relative z-10" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">Proje</span>
                    {post.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </div>
                  <h2 className="font-bold text-white mb-2 group-hover:text-rose-300 transition-colors line-clamp-2 leading-snug">{post.title}</h2>
                  <p className="text-sm text-slate-500 flex-1 line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/6 text-slate-500">{tag}</span>
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
