import { queryOne, execute } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Tag, Star, Clock } from "lucide-react";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";

async function getPost(slug: string) {
  const data = await queryOne<any>("SELECT * FROM posts WHERE slug = ? AND published = 1", [slug]);
  if (!data) return null;
  if (data.tags && typeof data.tags === "string") {
    try { data.tags = JSON.parse(data.tags); } catch { data.tags = []; }
  }
  // increment view count
  await execute("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [data.id]);
  return data;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const readTime = Math.max(1, Math.ceil((post.content?.split(" ").length || 0) / 200));

  return (
    <div className="p-[48px] max-w-4xl">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-all hover:-translate-x-1"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="w-4 h-4" /> Tüm İçerikler
      </Link>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${(typeColors as any)[post.type] || (typeColors as any).article}`}>
          {(typeLabels as any)[post.type] || post.type}
        </span>
        {post.featured ? (
          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--warning)" }}>
            <Star className="w-3.5 h-3.5" fill="currentColor" /> Öne Çıkan
          </span>
        ) : null}
      </div>

      <h1 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px", color: "var(--text)" }}>
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="text-[17px] leading-relaxed mb-6" style={{ color: "var(--muted)" }}>{post.excerpt}</p>
      )}

      <div className="flex flex-wrap items-center gap-5 mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        {[
          { icon: Calendar, val: formatDate(post.created_at) },
          { icon: Clock, val: `${readTime} dk okuma` },
          { icon: Eye, val: `${post.view_count} görüntülenme` },
        ].map(({ icon: Icon, val }) => (
          <div key={val} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--muted)" }}>
            <Icon className="w-4 h-4" /> {val}
          </div>
        ))}
      </div>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span key={tag} className="tag flex items-center gap-1">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
      )}

      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full rounded-3xl mb-10" style={{ boxShadow: "0 28px 60px rgba(31,90,110,0.20)" }} />
      )}

      {/* Content */}
      <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

      {/* Author */}
      <div
        className="mt-14 p-6 rounded-3xl flex items-center gap-5"
        style={{ background: "linear-gradient(135deg, rgba(27,154,170,0.08), rgba(108,99,255,0.06))", border: "1px solid rgba(255,255,255,0.80)" }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1b9aaa, #4fb477)" }}>AS</div>
        <div>
          <p className="font-bold" style={{ color: "var(--text)" }}>Adem ŞENER</p>
          <p className="text-sm" style={{ color: "var(--primary)" }}>CBS Uzmanı & Yazılım Geliştirici</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Ünye Belediyesi Bilgi İşlem Müdürlüğü</p>
        </div>
      </div>
    </div>
  );
}
