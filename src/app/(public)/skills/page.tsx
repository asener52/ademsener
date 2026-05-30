import Link from "next/link";

const skills = [
  {
    icon: "🗺️",
    title: "Web CBS Uygulamaları",
    desc: "Leaflet, OpenLayers, CesiumJS ve PostGIS altyapısıyla hızlı, katmanlı ve ölçüm araçları bulunan web haritalar.",
    tags: ["Leaflet", "OpenLayers", "PostGIS", "WMS/WFS"],
  },
  {
    icon: "🛰️",
    title: "Ortofoto & Drone Verisi",
    desc: "Drone görüntülerinden ortofoto, 3D model, değişim analizi ve raster tile servisleri üretimi.",
    tags: ["Drone", "Ortofoto", "3D Model", "Tile"],
  },
  {
    icon: "💻",
    title: "Full Stack Geliştirme",
    desc: "React, Node.js, REST API, MSSQL, PostgreSQL ve kullanıcı odaklı yönetim panelleri.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
  },
  {
    icon: "📊",
    title: "Mekansal Veri Analizi",
    desc: "Konumsal sorgular, tampon analizleri, parsel kesişimleri, raporlama ve karar destek ekranları.",
    tags: ["QGIS", "ArcGIS", "PostGIS", "SQL"],
  },
  {
    icon: "🏛️",
    title: "Belediye Sistemleri",
    desc: "Çözüm merkezi, ilan-duyuru, meclis oylama, kent rehberi ve kurumsal iş akışı uygulamaları.",
    tags: ["e-Devlet", "Entegrasyon", "API", "Kurum"],
  },
  {
    icon: "🚀",
    title: "Yayınlama & DevOps",
    desc: "IIS, nginx, SSL, sunucu yapılandırması, domain yönlendirme ve üretim ortamı optimizasyonu.",
    tags: ["IIS", "nginx", "SSL", "CI/CD"],
  },
];

const techStack = [
  { group: "CBS & Harita", items: ["QGIS", "ArcGIS", "PostGIS", "Leaflet", "OpenLayers", "GeoServer", "MapServer"] },
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js", "CesiumJS"] },
  { group: "Backend", items: ["Node.js", "Express", "Python", "Django", "REST API"] },
  { group: "Veritabanı", items: ["PostgreSQL", "MSSQL", "Supabase", "SQLite"] },
];

export default function SkillsPage() {
  return (
    <div className="p-[58px]">
      <div className="kicker">🧭 Uzmanlık alanları</div>

      <h2 style={{
        fontSize: "clamp(34px, 4vw, 58px)",
        lineHeight: 1.05,
        letterSpacing: "-2px",
        fontWeight: 900,
        marginBottom: "16px",
        color: "var(--text)",
      }}>
        CBS bilgisini modern yazılım<br />
        <span className="gradient-text">mimarisiyle birleştiririm.</span>
      </h2>

      <p className="mb-10" style={{ maxWidth: "640px", color: "var(--muted)", fontSize: "17px", lineHeight: 1.75 }}>
        Sadece harita gösteren değil, veri işleyen, analiz yapan ve kurum süreçlerine değer katan uygulamalar geliştiririm.
      </p>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {skills.map(({ icon, title, desc, tags }) => (
          <article
            key={title}
            className="p-6 transition-all duration-300 hover:-translate-y-2 group"
            style={{
              borderRadius: "26px",
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(255,255,255,0.82)",
              boxShadow: "0 18px 40px rgba(31,90,110,0.10)",
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 text-2xl mb-5"
              style={{
                borderRadius: "17px",
                background: "linear-gradient(135deg, rgba(27,154,170,0.14), rgba(108,99,255,0.12))",
              }}
            >
              {icon}
            </div>
            <h3 className="text-[17px] font-bold mb-2.5" style={{ color: "var(--text)" }}>{title}</h3>
            <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => <span key={t} className="tag text-xs">{t}</span>)}
            </div>
          </article>
        ))}
      </div>

      {/* Tech stack */}
      <div
        className="p-7"
        style={{
          borderRadius: "26px",
          background: "rgba(255,255,255,0.76)",
          border: "1px solid rgba(255,255,255,0.82)",
          boxShadow: "0 18px 40px rgba(31,90,110,0.10)",
        }}
      >
        <h3 className="text-lg font-bold mb-6" style={{ color: "var(--text)" }}>Teknoloji Yığını</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map(({ group, items }) => (
            <div key={group}>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>{group}</p>
              <div className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <span key={item} className="text-sm font-semibold" style={{ color: "var(--muted)" }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
