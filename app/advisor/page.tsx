import {
  getAdvisorProfile,
  getGuidanceStudents,
  getAdvisorStats,
} from "@/lib/advisor-actions";
import { GuidanceStudentList } from "@/components/advisor/GuidanceStudentList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Timer,
  GraduationCap,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default async function AdvisorDashboard() {
  const profile = await getAdvisorProfile();
  const atRiskStudents = await getGuidanceStudents();
  const stats = await getAdvisorStats();

  const completionRate =
    stats.totalStudents > 0
      ? Math.round((stats.seen / (stats.needsGuidance || 1)) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Welcome Section */}
      <Card>
        <CardContent className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-6">
              <div className="flex flex-col items-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Welcome, {profile.name}!
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  You have{" "}
                  <span className="font-bold text-foreground">
                    {atRiskStudents.length} students
                  </span>{" "}
                  requiring attention this week. Let&apos;s help them get back
                  on track.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {profile.department}
                </div>
                <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                  <Calendar className="mr-2 h-4 w-4" />
                  Semester 2, 2026
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/10">
                <div className="text-sm font-medium  mb-1">
                  Department Avg GPA
                </div>
                <div className="text-4xl font-bold">{stats.avgGpa}</div>
                <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +0.2 from last semester
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="rounded-lg bg-muted-foreground/10 p-2">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium">
              Department Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active in {profile.department}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="rounded-lg bg-muted-foreground/10 p-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.needsGuidance}</div>
            <p className="text-xs text-muted-foreground mt-1">
              GPA below 2.0 or flagged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="rounded-lg bg-muted-foreground/10 p-2">
              <Timer className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium">
              Currently Summoned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.summoned}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="rounded-lg bg-muted-foreground/10 p-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium">
              Guidance Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.seen}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Processed this semester
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-10">
        {/* Student List Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Priority Students
              </h2>
              <p className="text-muted-foreground text-sm">
                Students requiring immediate technical advising
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-card/50 shadow-sm overflow-hidden">
            <GuidanceStudentList initialStudents={atRiskStudents} />
          </div>
        </div>
      </div>
    </div>
  );
}
