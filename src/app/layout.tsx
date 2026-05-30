import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adem ŞENER | CBS Uzmanı & Yazılım Geliştirici",
  description: "Ünye Belediyesi Bilgi İşlem Müdürlüğü CBS Uzmanı ve Yazılım Geliştirici Adem ŞENER'in kişisel web sitesi.",
  keywords: ["CBS", "GIS", "Coğrafi Bilgi Sistemleri", "Yazılım Geliştirici", "Adem Şener", "Ünye"],
  authors: [{ name: "Adem ŞENER" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
