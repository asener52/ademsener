import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Tag, Star, Clock } from "lucide-react";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";
import type { Post } from "@/types";

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (data) {
    await supabase.rpc("increment_view_count", { post_id: data.id });
  }

  return data;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const wordCount = post.content?.split(" ").length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <div className="relative py-16 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 map-grid opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> İçeriklere Dön
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeColors[post.type] || typeColors.article}`}>
              {typeLabels[post.type] || post.type}
            </span>
            {post.featured && (
              <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> Öne Çıkan
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{post.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} dk okuma
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.view_count} görüntülenme
            </div>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose-content text-slate-700 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </div>

      {/* Author */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500/5 to-violet-500/5 border border-sky-500/20 flex items-center gap-5">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">AS</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Adem ŞENER</p>
            <p className="text-sm text-sky-600 dark:text-sky-400">CBS Uzmanı & Yazılım Geliştirici</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ünye Belediyesi Bilgi İşlem Müdürlüğü</p>
          </div>
        </div>
      </div>
    </div>
  );
}
