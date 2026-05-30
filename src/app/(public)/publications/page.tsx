import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Eye, Calendar, Star, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function PublicationsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("type", "publication")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-slate-950 min-h-screen py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="relative rounded-3xl overflow-hidden p-10 bg-slate-900/80 border border-white/6">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-5">
              <FileText className="w-3.5 h-3.5" /> Yayınlar
            </div>
            <h1 className="text-5xl font-black text-white mb-3">Yayınlarım</h1>
            <p className="text-slate-400 max-w-xl">Akademik bildiriler, teknik raporlar ve CBS alanında yayınlanmış yazılar.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-24 rounded-2xl bg-slate-900/50 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-slate-400 font-medium mb-2">Henüz yayın eklenmemiş</p>
            <p className="text-slate-600 text-sm">Akademik yayınlar yakında eklenecek.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex gap-5 p-6 rounded-2xl bg-slate-900/80 border border-white/6 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h2 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 leading-snug">{post.title}</h2>
                    {post.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">{post.excerpt}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-3 h-3" />{post.view_count} görüntülenme</span>
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
