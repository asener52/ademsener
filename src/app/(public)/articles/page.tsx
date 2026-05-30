import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Eye, Calendar, Star } from "lucide-react";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";

const tabs = [
  { value: "all", label: "Tümü" },
  { value: "article", label: "Makaleler" },
  { value: "news", label: "Son Gelişmeler" },
  { value: "announcement", label: "Duyurular" },
  { value: "training", label: "Eğitimler" },
  { value: "project", label: "Projeler" },
  { value: "publication", label: "Yayınlar" },
];

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const activeType = params.type || "all";

  const supabase = await createClient();
  let query = supabase.from("posts").select("*").eq("published", true).order("created_at", { ascending: false });
  if (activeType !== "all") query = query.eq("type", activeType);
  const { data: posts } = await query;

  return (
    <div className="p-[58px]">
      <div className="kicker">📚 Tüm içerikler</div>

      <h2 style={{
        fontSize: "clamp(32px, 4vw, 52px)",
        lineHeight: 1.05,
        letterSpacing: "-2px",
        fontWeight: 900,
        marginBottom: "28px",
        color: "var(--text)",
      }}>
        CBS'den yazılıma,<br />
        <span className="gradient-text">tüm üretimim burada.</span>
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-3xl" style={{ background: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.80)", width: "fit-content" }}>
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/articles" : `/articles?type=${tab.value}`}
            className="px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200"
            style={{
              color: activeType === tab.value ? "white" : "var(--muted)",
              background: activeType === tab.value ? "linear-gradient(135deg, #1b9aaa, #4fb477)" : "transparent",
              boxShadow: activeType === tab.value ? "0 8px 20px rgba(27,154,170,0.25)" : "none",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl" style={{ background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.80)" }}>
          <p className="text-[15px]" style={{ color: "var(--muted)" }}>Bu kategoride henüz içerik bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              className="flex flex-col transition-all duration-300 hover:-translate-y-2 group"
              style={{ borderRadius: "26px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 18px 40px rgba(31,90,110,0.10)", overflow: "hidden" }}
            >
              {post.cover_image ? (
                <div className="aspect-video overflow-hidden">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-video map-grid flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(27,154,170,0.10), rgba(108,99,255,0.08))" }}>
                  <span className="text-3xl opacity-30">📄</span>
                </div>
              )}

              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeColors[post.type] || typeColors.article}`}>
                    {typeLabels[post.type] || post.type}
                  </span>
                  {post.featured && <Star className="w-3.5 h-3.5" style={{ color: "var(--warning)" }} fill="currentColor" />}
                </div>
                <h3 className="font-bold mb-2 line-clamp-2 leading-snug group-hover:text-[#1b9aaa] transition-colors" style={{ color: "var(--text)", fontSize: "16px" }}>{post.title}</h3>
                <p className="text-[13px] leading-relaxed flex-1 line-clamp-3 mb-4" style={{ color: "var(--muted)" }}>{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((t: string) => <span key={t} className="tag text-[11px]">{t}</span>)}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs pt-3" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.view_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
