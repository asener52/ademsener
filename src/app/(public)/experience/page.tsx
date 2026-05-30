const timeline = [
  {
    year: "2010+",
    title: "Harita ve saha verisi temeli",
    desc: "Ölçüm, koordinat, parsel, imar ve arazi verilerinin üretimi, düzenlenmesi ve kurumsal kullanıma hazırlanması. QGIS, ArcGIS ve saha ölçüm araçlarıyla yoğun pratik deneyim.",
    tags: ["QGIS", "ArcGIS", "Ölçüm", "CAD"],
  },
  {
    year: "2015+",
    title: "Belediye CBS süreçleri",
    desc: "Kurumsal CBS altyapısı, vatandaş odaklı dijital hizmetler, taşınmaz ve kent rehberi uygulamalarında aktif rol. Ünye Belediyesi bünyesinde kapsamlı CBS projeleri.",
    tags: ["CBS", "Kent Rehberi", "Taşınmaz", "Belediye"],
  },
  {
    year: "2020+",
    title: "Web, mobil ve sunucu tarafı geliştirme",
    desc: "CBS bilgisini React, Node.js, PostgreSQL ve modern arayüzlerle birleştirerek uçtan uca uygulamalar geliştirme. REST API tasarımı, veritabanı yönetimi, deployment süreçleri.",
    tags: ["React", "Node.js", "PostgreSQL", "Leaflet"],
  },
  {
    year: "Bugün",
    title: "Akıllı şehir ve karar destek sistemleri",
    desc: "Harita, veri, raporlama ve saha ekiplerini aynı sistemde buluşturan daha akıllı kurumsal çözümler. WebGIS platformları, 3D görselleştirme, drone verisi entegrasyonu.",
    tags: ["WebGIS", "3D", "Drone", "Akıllı Şehir"],
  },
];

const achievements = [
  { icon: "🗺️", val: "50+", lbl: "CBS Projesi" },
  { icon: "💻", val: "30+", lbl: "Yazılım Projesi" },
  { icon: "📅", val: "10+", lbl: "Yıl Deneyim" },
  { icon: "🏛️", val: "1", lbl: "Belediye Kurumu" },
];

export default function ExperiencePage() {
  return (
    <div className="p-[58px]">
      <div className="kicker">📌 Deneyim çizgisi</div>

      <h2 style={{
        fontSize: "clamp(34px, 4vw, 56px)",
        lineHeight: 1.05,
        letterSpacing: "-2px",
        fontWeight: 900,
        marginBottom: "16px",
        color: "var(--text)",
      }}>
        Saha bilgisinden <span className="gradient-text">yazılım ürününe</span><br />uzanan pratik deneyim.
      </h2>

      <p className="mb-10" style={{ color: "var(--muted)", fontSize: "17px", lineHeight: 1.75, maxWidth: "580px" }}>
        Harita ve CBS dünyasından başlayıp modern yazılım geliştirmeye uzanan süreç.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {achievements.map(({ icon, val, lbl }) => (
          <div
            key={lbl}
            className="p-5 text-center"
            style={{ borderRadius: "22px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.82)", boxShadow: "0 12px 30px rgba(31,90,110,0.09)" }}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-3xl font-black" style={{ color: "var(--primary)" }}>{val}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: "var(--muted)" }}>{lbl}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col gap-5">
        {/* Line */}
        <div className="absolute left-[59px] top-5 bottom-5 w-px" style={{ background: "linear-gradient(to bottom, var(--primary), var(--secondary), var(--accent))" }} />

        {timeline.map(({ year, title, desc, tags }, i) => (
          <div
            key={year}
            className="flex gap-6 items-start"
            style={{ padding: "22px 24px", borderRadius: "24px", background: "rgba(255,255,255,0.78)", border: "1px solid rgba(255,255,255,0.86)", boxShadow: "0 10px 28px rgba(31,90,110,0.08)" }}
          >
            {/* Year bubble */}
            <div className="flex-shrink-0 w-[70px] text-center">
              <span className="text-sm font-black" style={{ color: "var(--primary)" }}>{year}</span>
            </div>

            <div className="flex-1">
              <h3 className="text-[17px] font-bold mb-2" style={{ color: "var(--text)" }}>{title}</h3>
              <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--muted)" }}>{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
