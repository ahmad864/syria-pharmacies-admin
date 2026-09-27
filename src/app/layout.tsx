import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "لوحة تحكم صيدليات سوريا",
  description: "لوحة تحكم إدارية لمنصة صيدليات سوريا",
};

/**
 * Root layout. Arabic + RTL is the baseline direction for the whole app
 * (per the brief) — an English toggle can be added later under
 * /settings without changing this shell, since every component already
 * uses logical CSS properties (start/end, ps/pe) rather than left/right.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
