import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Mail, ExternalLink, Check } from "lucide-react";

async function getAbout() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_info").select("*").limit(1).single();
  return data;
}

export default async function AboutPage() {
  const about = await getAbout();
  const skills = about?.skills || ["CBS / GIS", "QGIS", "ArcGIS", "PostGIS", "Node.js", "React", "Python", "PostgreSQL", "WebGIS", "REST API"];

  return (
    <div className="p-[58px]">
      <div className="kicker">👤 Hakkımda</div>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1b9aaa, #4fb477)", boxShadow: "0 16px 36px rgba(27,154,170,0.28)" }}
        >
          {about?.profile_image ? (
            <img src={about.profile_image} alt="Profil" className="w-full h-full object-cover rounded-3xl" />
          ) : "AS"}
        </div>
        <div>
          <h1 className="font-black mb-1" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px", color: "var(--text)" }}>
            {about?.full_name || "Adem ŞENER"}
          </h1>
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--primary)" }}>{about?.title || "CBS Uzmanı & Yazılım Geliştirici"}</p>
          <p className="text-sm font-medium mb-4" style={{ color: "var(--muted)" }}>{about?.organization || "Ünye Belediyesi Bilgi İşlem Müdürlüğü"}</p>
          <div className="flex gap-3">
            <Link href="/contact" className="px-5 py-2.5 rounded-2xl text-sm font-black text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #1b9aaa, #4fb477)", boxShadow: "0 12px 28px rgba(27,154,170,0.25)" }}>
              İletişime Geç
            </Link>
            {about?.social_links?.linkedin && (
              <a href={about.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ color: "var(--text)", background: "rgba(255,255,255,0.82)", border: "1px solid var(--border)" }}>
                <ExternalLink className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {about?.bio && (
        <div className="p-6 rounded-3xl mb-8" style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{about.bio}</p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--primary)" }}>Teknolojiler & Beceriler</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string) => (
            <div
              key={skill}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", color: "var(--text)", boxShadow: "0 4px 12px rgba(31,90,110,0.06)" }}
            >
              <Check className="w-3.5 h-3.5" style={{ color: "var(--secondary)" }} />
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/skills", label: "🧭 Uzmanlık Alanları", desc: "Detaylı teknik yetkinlikler" },
          { href: "/experience", label: "📌 Deneyim Çizgisi", desc: "Kariyerin hikayesi" },
          { href: "/projects", label: "✨ Projeler", desc: "Geliştirdiğim uygulamalar" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href} href={href}
            className="p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1.5"
            style={{ background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 12px 28px rgba(31,90,110,0.08)" }}
          >
            <p className="font-bold mb-1" style={{ color: "var(--text)" }}>{label}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
