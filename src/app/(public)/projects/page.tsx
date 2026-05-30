import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Star, Eye, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

const staticProjects = [
  {
    num: "01",
    title: "Akıllı Şehir Web CBS Platformu",
    desc: "Katman yönetimi, parsel sorgulama, ortofoto gösterimi, ölçüm araçları ve kent rehberi modülleri bulunan modern belediye CBS sistemi.",
    tags: ["Leaflet", "PostGIS", "Node.js", "Raster Tile"],
  },
  {
    num: "02",
    title: "Belediye Çözüm Merkezi",
    desc: "Vatandaş taleplerini ilgili birimlere yönlendiren, süreç takibi ve raporlama sağlayan web ve mobil uyumlu kurumsal sistem.",
    tags: ["React", "API", "MSSQL", "Bildirim"],
  },
  {
    num: "03",
    title: "3D Model ve Ölçüm Uygulaması",
    desc: "PLY, OBJ ve GLB modelleri görüntüleyen; mesafe, alan, koordinat ve hacim ölçümleri yapabilen teknik görüntüleme uygulaması.",
    tags: ["Three.js", "CesiumJS", "3D Ölçüm", "Model Viewer"],
  },
];

async function getDynPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts").select("*").eq("published", true).eq("type", "project")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function ProjectsPage() {
  const dynProjects = await getDynPosts();
  const hasDyn = dynProjects.length > 0;

  return (
    <div className="p-[58px]">
      <div className="kicker">✨ Seçili projeler</div>

      <h2 style={{
        fontSize: "clamp(34px, 4vw, 58px)",
        lineHeight: 1.05,
        letterSpacing: "-2px",
        fontWeight: 900,
        marginBottom: "40px",
        color: "var(--text)",
      }}>
        Kurumsal ihtiyacı sahada çalışan<br />
        <span className="gradient-text">çözüme dönüştüren işler.</span>
      </h2>

      {/* Dynamic posts from DB */}
      {hasDyn && (
        <div className="flex flex-col gap-5 mb-10">
          {dynProjects.map((post: any, i: number) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              className="grid gap-5 items-center p-6 transition-all hover:-translate-y-1 group"
              style={{
                gridTemplateColumns: "1fr auto",
                borderRadius: "26px",
                background: "rgba(255,255,255,0.76)",
                border: "1px solid rgba(255,255,255,0.86)",
                boxShadow: "0 18px 38px rgba(31,90,110,0.10)",
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {post.featured && <Star className="w-4 h-4" style={{ color: "var(--warning)" }} fill="currentColor" />}
                  <h3 className="text-[20px] font-bold group-hover:text-[#1b9aaa] transition-colors" style={{ color: "var(--text)" }}>{post.title}</h3>
                </div>
                <p className="text-[14px] leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((t: string) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div
                className="w-[74px] h-[74px] rounded-[24px] flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1b9aaa, #6c63ff)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Static projects */}
      <div className="flex flex-col gap-5">
        {!hasDyn && <p className="text-sm font-semibold mb-2" style={{ color: "var(--muted)" }}>Örnek Projeler</p>}
        {staticProjects.map(({ num, title, desc, tags }) => (
          <article
            key={num}
            className="p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "18px",
              alignItems: "center",
              borderRadius: "26px",
              background: hasDyn ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.76)",
              border: "1px solid rgba(255,255,255,0.86)",
              boxShadow: "0 10px 28px rgba(31,90,110,0.08)",
              opacity: hasDyn ? 0.65 : 1,
            }}
          >
            <div>
              <h3 className="text-[20px] font-bold mb-2" style={{ color: "var(--text)" }}>{title}</h3>
              <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--muted)" }}>{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div
              className="w-[74px] h-[74px] rounded-[24px] flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1b9aaa, #6c63ff)" }}
            >
              {num}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
