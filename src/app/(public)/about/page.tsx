import { createClient } from "@/lib/supabase/server";
import {
  MapPin, Code2, Globe, Database, Layers, GraduationCap,
  Briefcase, Mail, ExternalLink, Check
} from "lucide-react";
import type { AboutInfo } from "@/types";

async function getAboutInfo(): Promise<AboutInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("about_info").select("*").limit(1).single();
  return data;
}

const expertise = [
  {
    title: "CBS / GIS Uzmanlığı",
    icon: MapPin,
    color: "sky",
    items: ["QGIS & ArcGIS", "PostGIS & Mekansal Sorgular", "WebGIS Uygulamaları", "Mekansal Veri Analizi", "Harita Tasarımı & Kartografi", "Uydu Görüntü İşleme"]
  },
  {
    title: "Yazılım Geliştirme",
    icon: Code2,
    color: "violet",
    items: ["Node.js & Express", "React & Next.js", "Python", "PostgreSQL", "REST API Tasarımı", "Veritabanı Yönetimi"]
  },
  {
    title: "Kurumsal Deneyim",
    icon: Briefcase,
    color: "amber",
    items: ["Belediye Bilgi Sistemleri", "E-Devlet Entegrasyonları", "Proje Yönetimi", "Teknik Raporlama", "Eğitim & Danışmanlık", "CBS Veri Standartları"]
  },
];

export default async function AboutPage() {
  const about = await getAboutInfo();

  const bio = about?.bio || "Coğrafi Bilgi Sistemleri ve yazılım geliştirme alanlarında uzmanlaşmış bir profesyonel olarak, mekansal veri analizinden web uygulamalarına kadar geniş bir yelpazede çalışmalar yürütmekteyim. Ünye Belediyesi Bilgi İşlem Müdürlüğü bünyesinde CBS Uzmanı olarak görev yapmakta, aynı zamanda modern web teknolojileriyle çözümler üretmekteyim.";

  const skills = about?.skills || ["CBS / GIS", "QGIS", "ArcGIS", "PostGIS", "Node.js", "React", "Python", "PostgreSQL", "WebGIS", "REST API"];

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        <div className="absolute inset-0 map-grid opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-2xl">
                  {about?.profile_image ? (
                    <img src={about.profile_image} alt="Profil" className="w-full h-full object-cover rounded-3xl" />
                  ) : (
                    <MapPin className="w-24 h-24 text-white/80" />
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Aktif
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-sm font-medium mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {about?.organization || "Ünye Belediyesi Bilgi İşlem Müdürlüğü"}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">
                {about?.full_name || "Adem ŞENER"}
              </h1>
              <p className="text-xl text-sky-600 dark:text-sky-400 font-semibold mb-6">
                {about?.title || "CBS Uzmanı & Yazılım Geliştirici"}
              </p>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
                {bio}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${about?.social_links?.email || "adem@example.com"}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  <Mail className="w-4 h-4" /> E-posta Gönder
                </a>
                {about?.social_links?.linkedin && (
                  <a href={about.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500/50 font-semibold text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {about?.social_links?.github && (
                  <a href={about.social_links.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500/50 font-semibold text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Uzmanlık Alanları</h2>
            <p className="text-slate-500 dark:text-slate-400">CBS ve yazılım geliştirme konularındaki yetkinliklerim</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {expertise.map(({ title, icon: Icon, color, items }) => (
              <div key={title} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Skill tags */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Teknolojiler</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Deneyim</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500 via-violet-500 to-transparent" />
            <div className="space-y-8">
              {[
                {
                  title: "CBS Uzmanı",
                  org: "Ünye Belediyesi Bilgi İşlem Müdürlüğü",
                  period: "Devam ediyor",
                  desc: "Belediye bünyesinde Coğrafi Bilgi Sistemleri altyapısının kurulumu, yönetimi ve geliştirilmesi. WebGIS uygulamaları, mekansal veri analizi ve CBS tabanlı karar destek sistemleri.",
                  icon: MapPin,
                  color: "sky"
                },
                {
                  title: "Yazılım Geliştirici",
                  org: "Serbest / Proje Bazlı",
                  period: "Devam ediyor",
                  desc: "Node.js, React ve modern web teknolojileriyle web uygulamaları geliştirme. REST API tasarımı, veritabanı yönetimi ve frontend geliştirme.",
                  icon: Code2,
                  color: "violet"
                }
              ].map(({ title, org, period, desc, icon: Icon, color }) => (
                <div key={title} className="flex gap-6">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center z-10`}>
                    <Icon className={`w-5 h-5 text-${color}-500`} />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-sky-600 dark:text-sky-400">{org}</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                        {period}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
