"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#f0fdf9 0%,#eff6ff 50%,#fdf4ff 100%)" }}>
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(27,154,170,0.12)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(108,99,255,0.10)" }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4 text-white"
            style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 16px 40px rgba(27,154,170,0.30)" }}>
            <MapPin className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Admin Paneli</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Adem ŞENER · CBS & Yazılım</p>
        </div>

        <div className="p-8 rounded-3xl" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.90)", backdropFilter: "blur(20px)", boxShadow: "0 24px 60px rgba(27,154,170,0.12)" }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={e => (e.target.style.borderColor = "#1b9aaa")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                  placeholder="admin@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                <input type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  onFocus={e => (e.target.style.borderColor = "#1b9aaa")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", color: "#ef4444" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#1b9aaa,#4fb477)", boxShadow: "0 8px 24px rgba(27,154,170,0.30)" }}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-6" style={{ color: "#94a3b8" }}>© 2025 Adem ŞENER · Ünye Belediyesi</p>
      </div>
    </div>
  );
}
