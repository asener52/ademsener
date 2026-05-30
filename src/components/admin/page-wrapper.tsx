"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AdminPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Her route değişiminde animasyonu yeniden tetikle
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("admin-page-enter");
    // Reflow zorla — animasyonun baştan başlaması için
    void el.offsetHeight;
    el.classList.add("admin-page-enter");
  }, [pathname]);

  return (
    <div ref={ref} className="admin-page-enter" style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
}
