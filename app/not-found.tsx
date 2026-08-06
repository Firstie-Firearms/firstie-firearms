import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found | Firstie Firearms",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#b8946a" }}>
          Page Not Found
        </h1>
        <p className="text-base text-muted-foreground font-serif leading-relaxed">
          {"The page you are looking for does not exist or may have been moved."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="font-sans text-sm font-semibold uppercase tracking-widest px-8 py-3 border transition-opacity hover:opacity-80"
            style={{ borderColor: "#b8946a", color: "#b8946a" }}
          >
            Return Home
          </Link>
          <Link
            href="/faq"
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            View FAQ
          </Link>
        </div>
      </div>
    </main>
  )
}
