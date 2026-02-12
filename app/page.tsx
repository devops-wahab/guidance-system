import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, FileText, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      {/* <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-lg font-semibold">Guidance System</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header> */}

      {/* Hero Section - Takes remaining viewport height */}
      <main className="flex flex-1 items-center justify-center bg-linear-to-b from-background to-muted/20">
        <div className="container px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Academic Guidance
            <span className="block text-primary">Made Simple</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/70">
            Book appointments, track your degree progress, and manage your
            academic journey - all in one place.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto cursor-pointer">
                Login
              </Button>
            </Link>
          </div>

          {/* Feature Icons */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Easy Scheduling</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Digital Transcripts</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Progress Tracking</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Graduation Ready</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2026 Guidance System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
