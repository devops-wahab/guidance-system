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
import Link from "next/link";

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
        <p className="text-foreground/70 text-sm">
          {profile.level} • {profile.major} •{" "}
          {profile.matricNumber || "No Matric No"}
        </p>
      </div>

      {/* Critical Alert: Summoned Status */}
      {isSummoned && (
        <Alert className=" border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
          <AlertTriangleIcon />
          <AlertTitle className="text-lg font-semibold">
            Action Required: See Your Advisor
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4 text-foreground/70">
              Your advisor has flagged your profile for academic guidance.
              Please visit their office immediately.
            </p>

            <div className="flex flex-col w-full sm:flex-row gap-4 text-sm p-4 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Advisor Office</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Computer Science Department, Block D, Room 205</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri 10am - 12pm</span>
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
                    ? "text-destructive"
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
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Current Semester Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {course.code.split(" ")[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold">{course.code}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{course.credits} Units</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
                No courses registered for this semester yet.
                <Button className="mt-4">
                  <Link href="/student/registration">Register Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Sidebar */}
        {/* <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Guidance Status</span>
                {profile.guidanceStatus === "good_standing" ? (
                  <Badge className="bg-green-600 hover:bg-green-600 text-white border-transparent">
                    Good Standing
                  </Badge>
                ) : profile.guidanceStatus === "summoned" ? (
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white border-transparent">
                    Summoned
                  </Badge>
                ) : profile.guidanceStatus === "seen" ||
                  profile.guidanceStatus === "completed" ? (
                  <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-transparent">
                    Guidance Completed
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 hover:bg-red-600 text-white border-transparent">
                    Needs Guidance
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">CGPA</span>
                <span className="font-bold">{profile.gpa?.toFixed(2)}</span>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline" asChild>
                  <a href="/student/transcript">View Full Transcript</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
