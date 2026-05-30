import { PublicSidebar } from "@/components/public/sidebar";
import { MobileTopbar } from "@/components/public/mobile-topbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile topbar (< lg) */}
      <div className="lg:hidden">
        <MobileTopbar />
        <main className="min-h-screen" style={{ background: "rgba(255,255,255,0.72)", padding: "16px" }}>
          <div
            className="page-enter"
            style={{
              borderRadius: "24px",
              background: "rgba(255,255,255,0.60)",
              border: "1px solid rgba(255,255,255,0.80)",
              minHeight: "80vh",
            }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Desktop layout (≥ lg) */}
      <div
        className="hidden lg:grid min-h-screen"
        style={{
          gridTemplateColumns: "290px 1fr",
          padding: "22px",
          gap: "22px",
        }}
      >
        {/* Sticky Sidebar */}
        <div className="sticky top-[22px] h-[calc(100vh-44px)]">
          <PublicSidebar />
        </div>

        {/* Main content */}
        <main
          className="relative overflow-hidden"
          style={{
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.42)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "var(--shadow)",
            minHeight: "calc(100vh - 44px)",
          }}
        >
          <div className="absolute inset-0 overflow-y-auto">
            <div className="page-enter">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
