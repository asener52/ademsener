import Link from "next/link";
import {
  MapPin, Code2, ArrowRight, BookOpen, Megaphone,
  Newspaper, GraduationCap, Globe, Layers, Database,
  ChevronRight, Star, Eye, Calendar, Sparkles,
  FolderOpen, FileText, TrendingUp, Award, Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, typeColors, typeLabels } from "@/lib/utils";
import type { Post } from "@/types";

async function getFeaturedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data || [];
}

const stats = [
  { label: "CBS Projesi", value: "50+", icon: MapPin, color: "sky" },
  { label: "Yıl Deneyim", value: "10+", icon: Award, color: "violet" },
  { label: "Makale & Yazı", value: "30+", icon: FileText, color: "emerald" },
  { label: "Eğitim", value: "20+", icon: GraduationCap, color: "amber" },
];

const categories = [
  {
    href: "/news",
    label: "Son Gelişmeler",
    icon: Newspaper,
    color: "emerald",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    desc: "CBS ve teknoloji dünyasındaki güncel gelişmeler, haberler",
    badge: "Güncel",
  },
  {
    href: "/articles",
    label: "Makaleler",
    icon: BookOpen,
    color: "sky",
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
    border: "border-sky-500/20 hover:border-sky-500/50",
    desc: "CBS, GIS ve yazılım üzerine derinlemesine teknik yazılar",
    badge: "Teknik",
  },
  {
    href: "/trainings",
    label: "Eğitimler",
    icon: GraduationCap,
    color: "violet",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    border: "border-violet-500/20 hover:border-violet-500/50",
    desc: "QGIS, ArcGIS ve WebGIS konularında eğitim kaynakları",
    badge: "Öğren",
  },
  {
    href: "/projects",
    label: "Projeler",
    icon: FolderOpen,
    color: "rose",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    border: "border-rose-500/20 hover:border-rose-500/50",
    desc: "Geliştirdiğim CBS ve yazılım projeleri, portföy",
    badge: "Portföy",
  },
  {
    href: "/announcements",
    label: "Duyurular",
    icon: Megaphone,
    color: "amber",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/50",
    desc: "Etkinlik, seminer ve genel duyurular",
    badge: "Duyuru",
  },
  {
    href: "/publications",
    label: "Yayınlar",
    icon: FileText,
    color: "cyan",
    gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    desc: "Akademik yayınlar, bildiriler ve raporlar",
    badge: "Akademik",
  },
];

const skills = [
  { label: "QGIS", group: "CBS" },
  { label: "ArcGIS", group: "CBS" },
  { label: "PostGIS", group: "CBS" },
  { label: "WebGIS", group: "CBS" },
  { label: "Mekansal Analiz", group: "CBS" },
  { label: "Node.js", group: "Yazılım" },
  { label: "React", group: "Yazılım" },
  { label: "Next.js", group: "Yazılım" },
  { label: "PostgreSQL", group: "Yazılım" },
  { label: "Python", group: "Yazılım" },
  { label: "REST API", group: "Yazılım" },
];

export default async function HomePage() {
  const posts = await getFeaturedPosts();

  return (
    <div className="bg-slate-950 text-white overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center">
        {/* Layered background */}
        <div className="absolute inset-0 map-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />

        {/* Orbs */}
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-sky-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />

        {/* Floating elements */}
        <div className="absolute top-32 right-24 float opacity-20 hidden xl:block">
          <div className="w-16 h-16 rounded-2xl border border-sky-500/30 bg-sky-500/5 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-sky-400" />
          </div>
        </div>
        <div className="absolute bottom-40 right-64 float-delay-1 opacity-15 hidden xl:block">
          <div className="w-12 h-12 rounded-xl border border-violet-500/30 bg-violet-500/5 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-violet-400" />
          </div>
        </div>
        <div className="absolute top-56 left-16 float-delay-2 opacity-10 hidden xl:block">
          <div className="w-10 h-10 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-4xl">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-white/10 text-sm text-slate-300 mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Ünye Belediyesi Bilgi İşlem Müdürlüğü · CBS Uzmanı
            </div>

            {/* Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
              <span className="block text-white">Merhaba,</span>
              <span className="block gradient-text mt-2">Adem ŞENER</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold">
                <MapPin className="w-3.5 h-3.5" /> CBS Uzmanı
              </div>
              <span className="text-slate-600 text-xl font-light">&</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold">
                <Code2 className="w-3.5 h-3.5" /> Yazılım Geliştirici
              </div>
            </div>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Coğrafi Bilgi Sistemleri ve modern yazılım geliştirme alanlarında
              uzmanlaşmış olarak <span className="text-slate-200">mekansal verinin gücünü</span> dijital çözümlerle
              birleştiriyorum. WebGIS uygulamalarından full-stack web projelerine kadar üretiyorum.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/about" className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm hover:from-sky-400 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5">
                Hakkımda Keşfet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/projects" className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-bold text-sm glass transition-all duration-300 hover:-translate-y-0.5">
                <FolderOpen className="w-4 h-4" />
                Projelerim
              </Link>
              <Link href="/contact" className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-sky-500/30 hover:border-sky-500/60 text-sky-400 hover:text-sky-300 font-bold text-sm transition-all duration-300 hover:-translate-y-0.5">
                İletişime Geç
              </Link>
            </div>

            {/* Skills row */}
            <div className="flex flex-wrap gap-2">
              {skills.map(({ label, group }) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-lg bg-white/4 border border-white/6 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/8 hover:border-white/10 transition-all cursor-default"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="relative group p-6 rounded-2xl glass border border-white/6 hover:border-white/12 transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <p className="text-4xl font-black text-white mb-1 tracking-tight">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold mb-3">
                <Sparkles className="w-4 h-4" />
                İçerik Kategorileri
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                Her şey bir arada
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
              CBS'den yazılıma, akademik yayınlardan pratik eğitimlere — tüm üretimim burada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(({ href, label, icon: Icon, color, gradient, border, desc, badge }) => (
              <Link
                key={href}
                href={href}
                className={`group relative flex flex-col p-6 rounded-2xl bg-slate-900/60 border ${border} overflow-hidden card-hover`}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 text-${color}-400`} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                      {badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">{label}</h3>
                  <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">{desc}</p>

                  <div className={`mt-5 flex items-center gap-1.5 text-xs font-semibold text-${color}-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                    Keşfet <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST POSTS ─── */}
      {posts.length > 0 && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-14">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Son Paylaşımlar
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white">En Güncel İçerikler</h2>
              </div>
              <Link href="/articles" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-sm text-slate-400 hover:text-white glass transition-all duration-200">
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, idx) => (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="group flex flex-col rounded-2xl bg-slate-900/80 border border-white/6 hover:border-white/12 overflow-hidden card-hover"
                >
                  {/* Cover */}
                  {post.cover_image ? (
                    <div className="aspect-video overflow-hidden relative">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="aspect-video relative overflow-hidden">
                      <div className="absolute inset-0 map-grid-dense opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-violet-500/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-white/10" />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeColors[post.type] || typeColors.article}`}>
                        {typeLabels[post.type] || post.type}
                      </span>
                      {post.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>

                    <h3 className="font-bold text-white mb-2 group-hover:text-sky-300 transition-colors duration-200 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 flex-1 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3 h-3" />
                        {post.view_count}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link href="/articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white glass transition-all">
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── EXPERTISE BANDS ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CBS */}
            <div className="relative rounded-3xl overflow-hidden p-8 bg-slate-900/80 border border-white/6">
              <div className="absolute inset-0 map-grid opacity-30" />
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-sky-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">CBS Uzmanlığı</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Coğrafi Bilgi Sistemleri alanında kapsamlı deneyim. Belediye bilgi sistemlerinden WebGIS uygulamalarına, mekansal analizden harita tasarımına kadar.</p>
                <div className="flex flex-wrap gap-2">
                  {["QGIS", "ArcGIS", "PostGIS", "Leaflet.js", "OpenLayers", "Geoserver", "WMS/WFS", "Mekansal SQL"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-sky-500/8 border border-sky-500/15 text-sky-400 text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Yazılım */}
            <div className="relative rounded-3xl overflow-hidden p-8 bg-slate-900/80 border border-white/6">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <Code2 className="w-7 h-7 text-violet-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Yazılım Geliştirme</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Modern web teknolojileriyle ölçeklenebilir uygulamalar geliştirme. Backend API'lerden React frontend'lerine, veritabanı tasarımından deployment'a kadar.</p>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "React", "Next.js", "TypeScript", "PostgreSQL", "Python", "REST API", "Supabase"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-violet-500/8 border border-violet-500/15 text-violet-400 text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-12 lg:p-16 text-center">
            {/* BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-blue-700/20 to-violet-700/20" />
            <div className="absolute inset-0 map-grid opacity-20" />
            <div className="absolute inset-0 bg-slate-900/60" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-sky-500/15 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 shadow-2xl shadow-sky-500/30 mb-8">
                <MapPin className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Projeniz için<br />
                <span className="gradient-text">birlikte çalışalım</span>
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                CBS projeleri, WebGIS uygulamaları, mekansal veri analizi veya yazılım geliştirme konularında ihtiyacınız varsa benimle iletişime geçin.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact" className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-sky-50 transition-all duration-300 shadow-2xl hover:-translate-y-0.5">
                  İletişime Geç <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="flex items-center gap-2.5 px-8 py-4 rounded-2xl border border-white/20 hover:border-white/30 text-white font-bold text-sm glass transition-all duration-300 hover:-translate-y-0.5">
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
