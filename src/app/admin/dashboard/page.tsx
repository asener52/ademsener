import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText, MessageSquare, Users, Eye, Plus,
  ArrowRight, TrendingUp, Newspaper, BookOpen, Megaphone, GraduationCap
} from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getStats() {
  const supabase = await createClient();

  const [postsResult, messagesResult, subscribersResult, viewsResult] = await Promise.all([
    supabase.from("posts").select("id, type, published", { count: "exact" }),
    supabase.from("messages").select("id, read", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
    supabase.from("posts").select("view_count"),
  ]);

  const totalViews = viewsResult.data?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
  const unreadMessages = messagesResult.data?.filter((m) => !m.read).length || 0;

  const typeCounts = {
    article: postsResult.data?.filter((p) => p.type === "article").length || 0,
    news: postsResult.data?.filter((p) => p.type === "news").length || 0,
    announcement: postsResult.data?.filter((p) => p.type === "announcement").length || 0,
    training: postsResult.data?.filter((p) => p.type === "training").length || 0,
  };

  return {
    totalPosts: postsResult.count || 0,
    publishedPosts: postsResult.data?.filter((p) => p.published).length || 0,
    totalMessages: messagesResult.count || 0,
    unreadMessages,
    totalSubscribers: subscribersResult.count || 0,
    totalViews,
    typeCounts,
  };
}

async function getRecentMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

async function getRecentPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, type, published, created_at, view_count")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function DashboardPage() {
  const [stats, recentMessages, recentPosts] = await Promise.all([
    getStats(),
    getRecentMessages(),
    getRecentPosts(),
  ]);

  const statCards = [
    { label: "Toplam İçerik", value: stats.totalPosts, sub: `${stats.publishedPosts} yayında`, icon: FileText, color: "sky" },
    { label: "Okunmamış Mesaj", value: stats.unreadMessages, sub: `${stats.totalMessages} toplam`, icon: MessageSquare, color: "red", alert: stats.unreadMessages > 0 },
    { label: "Bülten Abonesi", value: stats.totalSubscribers, sub: "E-posta abonesi", icon: Users, color: "emerald" },
    { label: "Toplam Görüntülenme", value: stats.totalViews, sub: "Tüm içerikler", icon: Eye, color: "violet" },
  ];

  const typeCards = [
    { type: "article", label: "Makale", icon: BookOpen, color: "sky", count: stats.typeCounts.article },
    { type: "news", label: "Son Gelişme", icon: Newspaper, color: "emerald", count: stats.typeCounts.news },
    { type: "announcement", label: "Duyuru", icon: Megaphone, color: "amber", count: stats.typeCounts.announcement },
    { type: "training", label: "Eğitim", icon: GraduationCap, color: "violet", count: stats.typeCounts.training },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Hoş geldiniz, Adem Bey!</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Yeni İçerik
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, sub, icon: Icon, color, alert }) => (
          <div
            key={label}
            className={`p-5 rounded-2xl bg-slate-900 border ${alert ? "border-red-500/40" : "border-slate-800"} relative`}
          >
            {alert && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-500`} />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-sm font-semibold text-slate-300 mt-0.5">{label}</p>
            <p className="text-xs text-slate-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Content types */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {typeCards.map(({ type, label, icon: Icon, color, count }) => (
          <Link
            key={type}
            href={`/admin/posts?type=${type}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/30 transition-all group"
          >
            <div className={`w-9 h-9 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <div>
              <p className="text-lg font-black text-white">{count}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Son İçerikler</h2>
            <Link href="/admin/posts" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Henüz içerik yok</p>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{post.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(post.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                      {post.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              Son Mesajlar
              {stats.unreadMessages > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                  {stats.unreadMessages} yeni
                </span>
              )}
            </h2>
            <Link href="/admin/messages" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Henüz mesaj yok</p>
            ) : (
              recentMessages.map((msg: any) => (
                <div key={msg.id} className={`p-3 rounded-xl border ${!msg.read ? "border-sky-500/20 bg-sky-500/5" : "border-transparent hover:bg-slate-800"} transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-300 truncate">{msg.name}</p>
                      <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                    </div>
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 mt-1.5 ml-2" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(msg.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
