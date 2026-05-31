"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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
      router.push("/panel/dashboard");
      router.refresh();
    } else {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    }
  };

  return (
    /* fixed overlay — bütün global CSS'den izole */
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, zIndex: 9999,
      background: "linear-gradient(135deg,#f0fdf9 0%,#eff6ff 55%,#fdf4ff 100%)",
      overflow: "auto",
    }}>
      {/* Dekoratif blur topları */}
      <div style={{ position: "absolute", top: "20%", left: "15%", width: 360, height: 360, borderRadius: "50%", background: "rgba(27,154,170,0.10)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 320, height: 320, borderRadius: "50%", background: "rgba(108,99,255,0.09)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        {/* Logo & başlık */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", width: 68, height: 68, borderRadius: 22,
            alignItems: "center", justifyContent: "center", marginBottom: 16,
            background: "linear-gradient(135deg,#1b9aaa,#4fb477)",
            boxShadow: "0 16px 42px rgba(27,154,170,0.32)",
          }}>
            <MapPin style={{ width: 32, height: 32, color: "#fff" }} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#163040", letterSpacing: "-0.8px", margin: 0 }}>Admin Paneli</h1>
          <p style={{ fontSize: 13, color: "#5f7787", marginTop: 4 }}>Adem ŞENER · CBS & Yazılım</p>
        </div>

        {/* Kart */}
        <div style={{
          padding: "36px 32px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 64px rgba(27,154,170,0.13), 0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* E-posta */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#5f7787", marginBottom: 8 }}>
                E-posta
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: 44, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
                    borderRadius: 14, fontSize: 14, fontFamily: "inherit",
                    background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#163040",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#1b9aaa")}
                  onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#5f7787", marginBottom: 8 }}>
                Şifre
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                <input
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: 44, paddingRight: 48, paddingTop: 13, paddingBottom: 13,
                    borderRadius: 14, fontSize: 14, fontFamily: "inherit",
                    background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#163040",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#1b9aaa")}
                  onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
                  {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Hata */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#ef4444" }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} /> {error}
              </div>
            )}

            {/* Giriş butonu */}
            <button type="submit" disabled={loading} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 24px", borderRadius: 16, fontSize: 14, fontWeight: 800,
              color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg,#1b9aaa,#4fb477)",
              boxShadow: "0 10px 28px rgba(27,154,170,0.30)",
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
              fontFamily: "inherit",
            }}>
              {loading
                ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                : <Lock style={{ width: 16, height: 16 }} />}
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 24 }}>
          © 2025 Adem ŞENER · Ünye Belediyesi
        </p>
      </div>
    </div>
  );
}
