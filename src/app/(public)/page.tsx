import Link from "next/link";
import {
  MapPin, Code2, ArrowRight, BookOpen, Megaphone,
  Newspaper, GraduationCap, Globe, Layers, Database,
  ChevronRight, ExternalLink, Star
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

const skills = [
  { label: "CBS / GIS", icon: MapPin, color: "text-sky-400", bg: "bg-sky-500/10" },
  { label: "QGIS & ArcGIS", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "PostGIS", icon: Database, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "WebGIS", icon: Layers, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Node.js", icon: Code2, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "React", icon: Code2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const sections = [
  { href: "/news", label: "Son Gelişmeler", icon: Newspaper, color: "emerald", desc: "CBS ve teknoloji dünyasındaki güncel gelişmeler" },
  { href: "/articles", label: "Makaleler", icon: BookOpen, color: "sky", desc: "CBS, GIS ve yazılım üzerine teknik yazılar" },
  { href: "/announcements", label: "Duyurular", icon: Megaphone, color: "amber", desc: "Etkinlik ve proje duyuruları" },
  { href: "/trainings", label: "Eğitimler", icon: GraduationCap, color: "violet", desc: "CBS ve yazılım eğitim kaynakları" },
];

export default async function HomePage() {
  const posts = await getFeaturedPosts();

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 map-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-slate-950/50 to-white dark:to-slate-950" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-sm font-medium mb-8">
              <MapPin className="w-4 h-4" />
              Ünye Belediyesi Bilgi İşlem Müdürlüğü
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-slate-900 dark:text-white">Merhaba, ben </span>
              <span className="gradient-text">Adem ŞENER</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-light mb-4">
              <span className="text-sky-600 dark:text-sky-400 font-semibold">CBS Uzmanı</span>
              {" & "}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">Yazılım Geliştirici</span>
            </p>

            <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Coğrafi Bilgi Sistemleri ve yazılım geliştirme alanlarında çalışıyor,
              mekansal verinin gücünü dijital çözümlerle birleştiriyorum.
              WebGIS uygulamalarından modern web projelerine kadar geniş bir alanda üretiyorum.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-sky-500/30"
              >
                Hakkımda
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-sky-500/50 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-semibold text-sm transition-all duration-200 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              >
                İletişime Geç
              </Link>
            </div>

            {/* Skills row */}
            <div className="flex flex-wrap gap-2 mt-12">
              {skills.map(({ label, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${bg} border border-current/10 text-xs font-medium ${color}`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
          <span className="text-xs">Aşağı kaydır</span>
          <div className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-current animate-bounce" />
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">İçerikler</h2>
            <p className="text-slate-500 dark:text-slate-400">CBS, teknoloji ve yazılım üzerine paylaşımlarım</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sections.map(({ href, label, icon: Icon, color, desc }) => (
              <Link
                key={href}
                href={href}
                className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Keşfet <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Son Paylaşımlar</h2>
                <p className="text-slate-500 dark:text-slate-400">En güncel içeriklerim</p>
              </div>
              <Link
                href="/articles"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
              >
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1"
                >
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeColors[post.type] || typeColors.article}`}>
                        {typeLabels[post.type] || post.type}
                      </span>
                      {post.featured && (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span>{formatDate(post.created_at)}</span>
                      <span>{post.view_count} görüntülenme</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl overflow-hidden p-12 bg-gradient-to-br from-sky-600 to-violet-700 shadow-2xl">
            <div className="absolute inset-0 map-grid opacity-20" />
            <div className="relative">
              <MapPin className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-white mb-4">Birlikte çalışalım</h2>
              <p className="text-sky-100 mb-8 max-w-lg mx-auto">
                CBS projeleri, WebGIS uygulamaları veya yazılım geliştirme konularında iletişime geçmekten çekinmeyin.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-sky-700 font-bold hover:bg-sky-50 transition-colors shadow-lg"
              >
                İletişime Geç <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
