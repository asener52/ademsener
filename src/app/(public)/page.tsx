import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";
import type { Post } from "@/types";

async function getLatestPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts").select("*").eq("published", true)
    .order("created_at", { ascending: false }).limit(3);
  return data || [];
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <div className="p-[58px]" style={{ minHeight: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "38px", alignItems: "center", minHeight: "calc(100vh - 150px)" }}>

        {/* Left */}
        <div>
          <div className="kicker">🌍 CBS tabanlı yazılım çözümleri</div>

          <h2 style={{
            fontSize: "clamp(38px, 5vw, 72px)",
            lineHeight: 0.98,
            letterSpacing: "-3px",
            marginBottom: "24px",
            fontWeight: 900,
            color: "var(--text)",
          }}>
            Haritayı{" "}
            <span className="gradient-text">akıllı yazılıma</span>{" "}
            dönüştüren geliştirici.
          </h2>

          <p style={{ maxWidth: "600px", color: "var(--muted)", fontSize: "18px", lineHeight: 1.75, marginBottom: "28px" }}>
            CBS, uzaktan algılama, web harita teknolojileri ve modern yazılım geliştirme alanlarını
            birleştirerek; belediyeler, kurumlar ve saha ekipleri için hızlı, ölçülebilir ve
            kullanıcı dostu dijital sistemler geliştiriyorum.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/projects"
              className="font-black text-[14px] text-white transition-all hover:-translate-y-1"
              style={{
                padding: "15px 24px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #1b9aaa, #4fb477)",
                boxShadow: "0 16px 36px rgba(27,154,170,0.28)",
              }}
            >
              Projeleri Gör
            </Link>
            <Link href="/contact"
              className="font-black text-[14px] transition-all hover:-translate-y-1"
              style={{
                padding: "15px 24px",
                borderRadius: "16px",
                color: "var(--text)",
                background: "rgba(255,255,255,0.82)",
                border: "1px solid var(--border)",
              }}
            >
              İletişime Geç
            </Link>
          </div>

          {/* Son içerikler */}
          {posts.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Son Paylaşımlar</p>
              <div className="flex flex-col gap-2">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/articles/${post.slug}`}
                    className="flex items-center justify-between p-3 rounded-2xl transition-all hover:-translate-y-0.5 group"
                    style={{ background: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.80)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${typeColors[post.type]}`}>
                        {typeLabels[post.type]}
                      </span>
                      <span className="text-sm font-semibold truncate line-clamp-1" style={{ color: "var(--text)" }}>{post.title}</span>
                    </div>
                    <span className="text-xs flex-shrink-0 ml-3" style={{ color: "var(--muted)" }}>{formatDate(post.created_at)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Map card */}
        <div
          className="relative overflow-hidden float"
          style={{
            minHeight: "480px",
            borderRadius: "34px",
            background: "linear-gradient(120deg, rgba(255,255,255,0.42), rgba(255,255,255,0.12))",
            border: "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 28px 70px rgba(31,90,110,0.18)",
          }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 map-grid" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(27,154,170,0.15), rgba(108,99,255,0.10))" }} />

          {/* Orbs */}
          <div className="float absolute rounded-full" style={{ width: 155, height: 155, background: "rgba(79,180,119,0.38)", top: 58, left: 52, filter: "blur(0.2px)" }} />
          <div className="float2 absolute rounded-full" style={{ width: 210, height: 210, background: "rgba(108,99,255,0.22)", right: 28, bottom: 80, filter: "blur(0.2px)" }} />

          {/* Pins */}
          {[
            { top: "34%", left: "38%", color: "#1b9aaa" },
            { top: "58%", left: "62%", color: "#4fb477" },
            { top: "26%", left: "70%", color: "#6c63ff" },
          ].map(({ top, left, color }, i) => (
            <span key={i} className="absolute rounded-full" style={{
              width: 17, height: 17,
              top, left,
              background: "#ffffff",
              border: `5px solid ${color}`,
              boxShadow: "0 12px 26px rgba(27,154,170,0.35)",
              transform: "translate(-50%, -50%)",
            }} />
          ))}

          {/* Stats overlay */}
          <div className="absolute top-5 right-5 flex gap-2">
            {[
              { val: "50+", lbl: "Proje" },
              { val: "10+", lbl: "Yıl" },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.80)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.90)" }}>
                <p className="text-lg font-black" style={{ color: "var(--primary)" }}>{val}</p>
                <p className="text-[11px] font-semibold" style={{ color: "var(--muted)" }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Floating panel */}
          <div
            className="absolute left-[28px] right-[28px] bottom-[28px] p-5 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.92)",
            }}
          >
            <h3 className="text-[18px] font-bold mb-2" style={{ color: "var(--text)" }}>Akıllı Şehir Paneli</h3>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Katman yönetimi, ortofoto görüntüleme, parsel analizi, saha verisi ve karar destek modülleri tek ekranda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
