"use client";

import Link from "next/link";
import { Edit, ClipboardList, BarChart2, Users } from "lucide-react";
import { DeleteSurveyButton } from "@/components/admin/delete-survey-button";
import { formatDate } from "@/lib/utils";

export function SurveyCards({ surveys }: { surveys: any[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))", gap: 16 }}>
      {surveys.map((survey: any) => (
        <div key={survey.id}
          style={{ padding: "22px 24px", background: "rgba(255,255,255,0.76)", border: "1px solid rgba(255,255,255,0.86)", borderRadius: 24, boxShadow: "0 10px 24px rgba(31,90,110,0.07)", transition: "transform 0.22s ease, box-shadow 0.22s ease" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 42px rgba(31,90,110,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 24px rgba(31,90,110,0.07)"; }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8,
                ...(survey.is_active ? { background: "rgba(79,180,119,0.12)", color: "var(--secondary)" } : { background: "rgba(22,48,64,0.07)", color: "var(--muted)" }) }}>
                {survey.is_active ? "● Aktif" : "Kapalı"}
              </span>
              {survey.ends_at && (
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Bitiş: {new Date(survey.ends_at).toLocaleDateString("tr-TR")}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <Link href={`/yonetim/surveys/${survey.id}`}
                style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center" }}>
                <Edit style={{ width: 15, height: 15 }} />
              </Link>
              <Link href={`/yonetim/surveys/${survey.id}/results`}
                style={{ padding: 6, borderRadius: 10, color: "var(--muted)", display: "grid", placeItems: "center" }}
                title="Sonuçlar">
                <BarChart2 style={{ width: 15, height: 15 }} />
              </Link>
              <DeleteSurveyButton surveyId={survey.id} />
            </div>
          </div>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{survey.title}</h3>
          {survey.description && (
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{survey.description}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 12, borderTop: "1px solid rgba(22,48,64,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <ClipboardList style={{ width: 15, height: 15, color: "var(--primary)" }} />
              <span style={{ fontWeight: 700, color: "var(--text)" }}>{(survey.questions || []).length}</span> soru
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <Users style={{ width: 15, height: 15, color: "var(--secondary)" }} />
              <span style={{ fontWeight: 700, color: "var(--text)" }}>{survey.responseCount}</span> yanıt
            </div>
            <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>{formatDate(survey.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
