import { getStudentProfile, getEnrolledCourses } from "@/lib/student-actions";
import { getCurrentSession } from "@/lib/session-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Users,
  Clock,
  MapPin,
  AlertTriangleIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EnrolledCoursesList } from "@/components/student/EnrolledCoursesList";

export default async function StudentDashboard() {
  const profile = await getStudentProfile();
  const enrolledCourses = await getEnrolledCourses();
  const currentSession = await getCurrentSession();

  const isSummoned = profile.guidanceStatus === "summoned";

  return (
    <div className="space-y-6 container mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome, {profile.name}</h1>
        <p className="text-muted-foreground text-sm">
          {profile.level} • {profile.major} •{" "}
          {profile.matricNumber || "No Matric No"}
        </p>
      </div>

      {/* Critical Alert: Summoned Status */}
      {isSummoned && (
        <Alert className="border-l-4 border-l-amber-500 bg-amber-50/50 text-amber-900 dark:border-l-amber-600 dark:bg-amber-950/20 dark:text-amber-50">
          <AlertTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-full bg-white shadow-sm">
              <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
            </div>
            See Your Advisor
            <Badge className="bg-amber-500 text-white hover:bg-amber-500 animate-pulse border-transparent">
              URGENT
            </Badge>
          </AlertTitle>
          <AlertDescription className="mt-4">
            <p className="text-amber-900/80 dark:text-amber-50/80 text-base mb-6">
              Your advisor has flagged your profile for academic guidance.
              Please visit their office immediately. Prioritize visiting their
              office during the hours listed below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-background/6 dark:border-amber-900/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-semibold">
                    Location
                  </span>
                  <span className="text-sm font-medium">
                    Computer Science Dept.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-semibold">
                    Room
                  </span>
                  <span className="text-sm font-medium">Block D, Room 205</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-semibold">
                    Office Hours
                  </span>
                  <span className="text-sm font-medium">
                    Mon-Fri: 10am - 12pm
                  </span>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Academic Status
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                profile.guidanceStatus === "seen"
                  ? "text-blue-600"
                  : profile.guidanceStatus === "summoned"
                    ? "text-amber-600"
                    : (profile.gpa ?? 0) > 2.0
                      ? "text-green-600"
                      : "text-red-600"
              }`}
            >
              {profile.guidanceStatus === "seen"
                ? "Completed"
                : profile.guidanceStatus === "summoned"
                  ? "See Advisor"
                  : (profile.gpa ?? 0) > 2.0
                    ? "Good Standing"
                    : "Probation"}
            </div>

            <p className="text-xs text-muted-foreground">
              {profile.guidanceStatus === "seen"
                ? "Student has completed guidance."
                : profile.guidanceStatus === "summoned"
                  ? "Student must see advisor."
                  : (profile.gpa ?? 0) > 2.0
                    ? "Student is in good academic standing."
                    : "Academic performance is below requirement."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Units
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrolledCourses.reduce((sum, c) => sum + c.credits, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This Semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSession?.name || "2025/2026"}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentSession?.currentSemester || "Second"} Semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.gpa?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Cumulative Grade Point
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses List */}
      <EnrolledCoursesList courses={enrolledCourses} />
    </div>
  );
}
