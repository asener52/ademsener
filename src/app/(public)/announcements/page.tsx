import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Megaphone, Eye, Calendar, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("type", "announcement")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium mb-6">
            <Megaphone className="w-4 h-4" /> Duyurular
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Duyurular</h1>
          <p className="text-slate-500 dark:text-slate-400">Etkinlik, proje ve genel duyurular</p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Henüz duyuru bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex items-start gap-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">{post.title}</h2>
                    {post.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
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
