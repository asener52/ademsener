"use client";

import { useState, useEffect } from "react";
import { MapPin, Mail, ExternalLink, Check, ChevronRight } from "lucide-react";

type Page = "home" | "skills" | "projects" | "experience" | "articles" | "contact";

interface Post {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt?: string;
  tags?: string[];
  published_at?: string;
  view_count?: number;
}

interface About {
  full_name?: string;
  title?: string;
  organization?: string;
  bio?: string;
  skills?: string[];
  social_links?: { linkedin?: string; github?: string };
}

const navItems: { id: Page; label: string; num: string }[] = [
  { id: "home",       label: "Ana Sayfa", num: "01" },
  { id: "skills",     label: "Uzmanlık",  num: "02" },
  { id: "projects",   label: "Projeler",  num: "03" },
  { id: "experience", label: "Deneyim",   num: "04" },
  { id: "articles",   label: "İçerikler", num: "05" },
  { id: "contact",    label: "İletişim",  num: "06" },
];

const typeLabel: Record<string, string> = {
  article: "Makale", news: "Haber", announcement: "Duyuru",
  training: "Eğitim", project: "Proje", publication: "Yayın",
};
const typeColor: Record<string, string> = {
  article: "#1b9aaa", news: "#4fb477", announcement: "#6c63ff",
  training: "#ffb84d", project: "#f56565", publication: "#805ad5",
};

export function PublicApp() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [posts, setPosts] = useState<Post[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [newsletter, setNewsletter] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    fetch("/api/public/posts").then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {});
    fetch("/api/public/about").then(r => r.json()).then(d => setAbout(d.about || null)).catch(() => {});
  }, []);

  const skills = about?.skills || ["CBS / GIS", "QGIS", "ArcGIS", "PostGIS", "Node.js", "React", "Python", "PostgreSQL", "WebGIS", "REST API", "TypeScript", "Next.js", "Leaflet.js", "OpenLayers", "GDAL"];

  const skillGroups = [
    { title: "CBS & Uzaktan Algılama", icon: "🗺️", items: ["QGIS", "ArcGIS Pro", "PostGIS", "GDAL/OGR", "WebGIS", "OpenLayers", "Leaflet.js", "GeoServer"] },
    { title: "Yazılım Geliştirme", icon: "💻", items: ["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "REST API", "Docker"] },
    { title: "Veri & Analiz", icon: "📊", items: ["PostgreSQL", "PostGIS", "Pandas", "GeoPandas", "SQL", "ETL", "Mekânsal Analiz", "Raster İşleme"] },
    { title: "Altyapı & DevOps", icon: "⚙️", items: ["Linux", "Nginx", "Docker", "Git", "CI/CD", "Supabase", "Vercel", "Cloud GIS"] },
  ];

  const experiences = [
    { year: "2019 – Günümüz", title: "CBS Uzmanı & Yazılım Geliştirici", place: "Ünye Belediyesi Bilgi İşlem Müdürlüğü", desc: "Kent Bilgi Sistemi geliştirme, WebGIS uygulamaları, mekânsal veritabanı yönetimi ve yazılım projeleri koordinasyonu." },
    { year: "2016 – 2019", title: "CBS Teknisyeni", place: "Ordu Büyükşehir Belediyesi", desc: "Kent verilerinin sayısallaştırılması, QGIS & ArcGIS ile harita üretimi, kadastral veri yönetimi." },
    { year: "2014 – 2016", title: "Harita Teknikeri", place: "Özel Sektör", desc: "Arazi ölçümü, jeodezi, kadastro ve veri toplama projeleri." },
  ];

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactForm) });
      if (res.ok) { setContactStatus("sent"); setContactForm({ name: "", email: "", subject: "", message: "" }); }
      else setContactStatus("error");
    } catch { setContactStatus("error"); }
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterStatus("sending");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletter }) });
      if (res.ok) { setNewsletterStatus("done"); setNewsletter(""); }
      else setNewsletterStatus("error");
    } catch { setNewsletterStatus("error"); }
  }

  const articles = posts.filter(p => p.type === "article" || p.type === "news" || p.type === "announcement" || p.type === "training" || p.type === "publication");
  const projects = posts.filter(p => p.type === "project");

  return (
    <div className="spa-app">
      {/* ── Sidebar ── */}
      <aside className="spa-aside">
        {/* Brand */}
        <div>
          <div className="spa-brand">
            <div className="spa-logo">
              <MapPin style={{ width: 24, height: 24, strokeWidth: 2.5 }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", lineHeight: 1.2 }}>{about?.full_name || "Adem Şener"}</p>
              <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>CBS · Yazılım</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="spa-nav">
            {navItems.map(({ id, label, num }) => (
              <button
                key={id}
                className={`spa-nav-btn${activePage === id ? " active" : ""}`}
                onClick={() => setActivePage(id)}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: activePage === id ? "var(--primary)" : "var(--muted)", minWidth: 22 }}>{num}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                {activePage === id && <ChevronRight style={{ width: 14, height: 14, color: "var(--primary)" }} />}
              </button>
            ))}
          </nav>
        </div>

        {/* Side card */}
        <div className="spa-side-card">
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 6 }}>Kurum</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>{about?.organization || "Ünye Belediyesi\nBilgi İşlem Müdürlüğü"}</p>
          <div style={{ width: 32, height: 2, background: "linear-gradient(90deg,var(--primary),var(--secondary))", borderRadius: 2, marginTop: 10 }} />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="spa-main">

        {/* ── HOME ── */}
        <div className={`spa-page${activePage === "home" ? " active" : ""}`}>
          <div className="kicker">🗺️ Merhaba, ben</div>
          <div className="hero-grid">
            <div>
              <h1 className="hero-h2">
                <span className="gradient-text">{about?.full_name || "Adem Şener"}</span>
              </h1>
              <p style={{ fontSize: 18, fontWeight: 600, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
                {about?.title || "CBS Uzmanı & Yazılım Geliştirici"}
              </p>
              {about?.bio && <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75, marginBottom: 28, maxWidth: 500 }}>{about.bio}</p>}
              {!about?.bio && (
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75, marginBottom: 28, maxWidth: 500 }}>
                  Mekânsal veriler ile yazılımı birleştiriyor; CBS uygulamaları, WebGIS çözümleri ve modern web projeleri geliştiriyorum.
                </p>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => setActivePage("projects")}>Projeleri Gör</button>
                <button className="btn-ghost" onClick={() => setActivePage("contact")}>
                  <Mail style={{ width: 16, height: 16 }} /> İletişime Geç
                </button>
              </div>
            </div>
            <div className="map-card">
              <div className="orb" style={{ width: 280, height: 280, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(27,154,170,0.18) 0%, transparent 70%)" }} />
              <div className="map-pin" style={{ top: "40%", left: "45%" }}>
                <div style={{ width: 10, height: 10, background: "var(--primary)", borderRadius: "50%", border: "2px solid white", boxShadow: "0 0 0 4px rgba(27,154,170,0.25)" }} />
              </div>
              <div className="floating-panel" style={{ bottom: 24, left: 24, right: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text)" }}>📍 Ünye, Ordu</p>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>CBS & Yazılım · Türkiye</p>
              </div>
            </div>
          </div>
          {/* Skill tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
            {skills.slice(0, 10).map((s: string) => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className={`spa-page${activePage === "skills" ? " active" : ""}`}>
          <div className="kicker">🧭 Uzmanlık Alanları</div>
          <h2 className="hero-h2" style={{ marginBottom: 8 }}>Teknik <span className="gradient-text">Yetkinlikler</span></h2>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>CBS/GIS teknolojileri ve yazılım geliştirme alanındaki uzmanlıklarım.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {skillGroups.map((group) => (
              <div key={group.title} className="glass-card">
                <div className="card-icon">{group.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 14 }}>{group.title}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {group.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 10, background: "rgba(27,154,170,0.07)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                      <Check style={{ width: 11, height: 11, color: "var(--secondary)" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <div className={`spa-page${activePage === "projects" ? " active" : ""}`}>
          <div className="kicker">✨ Projeler</div>
          <h2 className="hero-h2" style={{ marginBottom: 8 }}>Geliştirdiğim <span className="gradient-text">Uygulamalar</span></h2>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>Kent Bilgi Sistemi, WebGIS ve yazılım projeleri.</p>
          {projects.length === 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {[
                { num: "01", title: "Kent Bilgi Sistemi", desc: "Ünye Belediyesi için geliştirilen entegre CBS platformu. PostGIS + React + Leaflet.js teknolojileri kullanıldı.", tags: ["PostGIS", "Leaflet.js", "React"] },
                { num: "02", title: "WebGIS Portali", desc: "Tapu ve kadastro verilerinin web ortamında görüntülenmesi ve analizi için geliştirilen sistem.", tags: ["GeoServer", "OpenLayers", "PostgreSQL"] },
                { num: "03", title: "Mekânsal Raporlama", desc: "Belediye hizmet verilerinin mekânsal analizle raporlandığı Python tabanlı otomasyon sistemi.", tags: ["Python", "GeoPandas", "GDAL"] },
              ].map((p) => (
                <div key={p.num} className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span className="project-number">{p.num}</span>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {projects.map((p, i) => (
                <div key={p.id} className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span className="project-number">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>{p.title}</h3>
                  {p.excerpt && <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 14 }}>{p.excerpt}</p>}
                  {p.tags && <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── EXPERIENCE ── */}
        <div className={`spa-page${activePage === "experience" ? " active" : ""}`}>
          <div className="kicker">📌 Kariyer</div>
          <h2 className="hero-h2" style={{ marginBottom: 8 }}>Deneyim <span className="gradient-text">Çizgisi</span></h2>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>Kariyerimin önemli dönüm noktaları.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {experiences.map((exp, i) => (
              <div key={i} className="timeline-step">
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "var(--primary)", whiteSpace: "nowrap" }}>{exp.year}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{exp.place}</span>
                </div>
                <div style={{ flex: 1, paddingLeft: 24, borderLeft: "2px solid var(--border)" }}>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{exp.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 16 }}>Eğitim</p>
            <div className="glass-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>🎓</span>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>Harita ve Kadastro Bölümü</p>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Haritacılık Teknikeri · 2014</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ARTICLES ── */}
        <div className={`spa-page${activePage === "articles" ? " active" : ""}`}>
          <div className="kicker">📚 İçerikler</div>
          <h2 className="hero-h2" style={{ marginBottom: 8 }}>Yazılar & <span className="gradient-text">Paylaşımlar</span></h2>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>Makaleler, haberler, duyurular, eğitimler ve yayınlar.</p>
          {articles.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📝</p>
              <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Henüz içerik yok</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Yakında içerikler eklenecek.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {articles.map((post) => (
                <div key={post.id} className="article-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 8, color: "white", background: typeColor[post.type] || "#1b9aaa" }}>
                      {typeLabel[post.type] || post.type}
                    </span>
                    {post.published_at && (
                      <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                        {new Date(post.published_at).toLocaleDateString("tr-TR")}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{post.title}</h3>
                  {post.excerpt && <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                      {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Newsletter */}
          <div className="glass-card" style={{ marginTop: 32 }}>
            <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>📬 Bülten</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Yeni içeriklerden haberdar olmak için abone ol.</p>
            {newsletterStatus === "done" ? (
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--secondary)" }}>✓ Abone oldunuz!</p>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: "flex", gap: 10 }}>
                <input
                  type="email" placeholder="E-posta adresiniz" required
                  value={newsletter} onChange={e => setNewsletter(e.target.value)}
                  className="form-input" style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" disabled={newsletterStatus === "sending"}>
                  {newsletterStatus === "sending" ? "..." : "Abone Ol"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className={`spa-page${activePage === "contact" ? " active" : ""}`}>
          <div className="kicker">✉️ İletişim</div>
          <h2 className="hero-h2" style={{ marginBottom: 8 }}>Benimle <span className="gradient-text">İletişime</span> Geç</h2>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 15 }}>Proje fikriniz ya da bir sorunuz mu var? Mesaj bırakın.</p>

          <div className="contact-grid">
            {/* Info panel */}
            <div className="contact-panel">
              <div className="contact-line">
                <span style={{ fontSize: 20 }}>📧</span>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)" }}>E-posta</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>adem@ademsener.org</p>
                </div>
              </div>
              <div className="contact-line">
                <span style={{ fontSize: 20 }}>📍</span>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)" }}>Konum</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Ünye, Ordu – Türkiye</p>
                </div>
              </div>
              <div className="contact-line">
                <span style={{ fontSize: 20 }}>🏢</span>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)" }}>Kurum</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Ünye Belediyesi Bilgi İşlem Müdürlüğü</p>
                </div>
              </div>
              {about?.social_links?.linkedin && (
                <a href={about.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                  className="contact-line" style={{ textDecoration: "none" }}>
                  <ExternalLink style={{ width: 18, height: 18, color: "var(--primary)" }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "var(--primary)" }}>LinkedIn Profili</span>
                </a>
              )}
            </div>

            {/* Form */}
            <div>
              {contactStatus === "sent" ? (
                <div className="glass-card" style={{ textAlign: "center", padding: "40px 24px" }}>
                  <p style={{ fontSize: 36, marginBottom: 12 }}>✅</p>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>Mesajınız İletildi!</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>En kısa sürede geri dönüş yapacağım.</p>
                  <button className="btn-ghost" style={{ marginTop: 20 }} onClick={() => setContactStatus("idle")}>Yeni Mesaj</button>
                </div>
              ) : (
                <form onSubmit={handleContact} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input className="form-input" placeholder="Adınız" required value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} />
                    <input className="form-input" type="email" placeholder="E-posta" required value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <input className="form-input" placeholder="Konu" required value={contactForm.subject} onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))} />
                  <textarea className="form-input" placeholder="Mesajınız..." required rows={5} value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} style={{ resize: "vertical" }} />
                  {contactStatus === "error" && <p style={{ fontSize: 13, color: "#f56565", fontWeight: 600 }}>Bir hata oluştu. Tekrar deneyin.</p>}
                  <button type="submit" className="btn-primary" disabled={contactStatus === "sending"} style={{ alignSelf: "flex-start" }}>
                    {contactStatus === "sending" ? "Gönderiliyor..." : "Gönder →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
