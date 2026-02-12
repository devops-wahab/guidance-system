import { getStudentProfile, getEnrolledCourses } from "@/lib/student-actions";
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

export default async function StudentDashboard() {
  const profile = await getStudentProfile();
  const enrolledCourses = await getEnrolledCourses();

  const isSummoned = profile.guidanceStatus === "sumoned";

  return (
    <div className="space-y-6 container mx-auto py-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome, {profile.name}</h1>
        <p className="text-muted-foreground text-lg">
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
              className={`text-2xl font-bold ${profile.gpa && profile.gpa < 2.0 ? "text-destructive" : "text-green-600"}`}
            >
              {profile.gpa && profile.gpa < 2.0 ? "Probation" : "Good Standing"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile.gpa && profile.gpa < 2.0
                ? "See Advisor Immediately"
                : "Keep it up!"}
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
            <div className="text-2xl font-bold">2025/2026</div>
            <p className="text-xs text-muted-foreground">First Semester</p>
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
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
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
              <div className="text-center py-8 text-muted-foreground">
                No courses registered for this semester yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Guidance Status</span>
                {profile.guidanceStatus === "good_standing" ? (
                  <Badge className="bg-green-500">Good Standing</Badge>
                ) : (
                  <Badge variant="destructive">Needs Guidance</Badge>
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
        </div>
      </div>
    </div>
  );
}
