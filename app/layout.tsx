import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase-context";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Boulder Builders | Connect & Build Together",
  description: "Connect with Boulder's tech community, share projects, and find collaborators",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-white text-gray-900">
        <SupabaseProvider>
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-12 items-center">
              <nav className="w-full flex justify-center border-b border-emerald-100 h-16 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/80">
                <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5">
                  <div className="flex gap-6 items-center">
                    <Link 
                      href="/" 
                      className="text-xl font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <span className="text-2xl">🏔️</span> Boulder Builders
                    </Link>
                    <div className="hidden md:flex gap-6">
                      <Link href="/feed" className="text-gray-600 hover:text-emerald-600 transition-colors">Feed</Link>
                      <Link href="/projects" className="text-gray-600 hover:text-emerald-600 transition-colors">Projects</Link>
                      <Link href="/learn" className="text-gray-600 hover:text-emerald-600 transition-colors">Learn</Link>
                      <Link href="/meetups" className="text-gray-600 hover:text-emerald-600 transition-colors">Meetups</Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </div>
              </nav>

              <div className="flex flex-col gap-8 max-w-6xl w-full p-5">
                {children}
              </div>

              <footer className="w-full border-t border-emerald-100">
                <div className="max-w-6xl mx-auto py-12 px-5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>© 2025 Boulder Builders</span>
                    <span className="hidden md:inline">•</span>
                    <Link href="/about" className="hover:text-emerald-600 transition-colors">About</Link>
                    <span className="hidden md:inline">•</span>
                    <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <a href="https://github.com/boulder-builders" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors">
                      GitHub
                    </a>
                    <a href="https://twitter.com/boulderbuilders" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors">
                      Twitter
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
