import { getSystemStats } from "@/lib/admin-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, GraduationCap, Calendar, CheckCircle } from "lucide-react";

export default async function ReportsPage() {
  const stats = await getSystemStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          System statistics and activity reports
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active student accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Advisors
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdvisors}</div>
            <p className="text-xs text-muted-foreground">Available advisors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.scheduledAppointments} scheduled,{" "}
              {stats.completedAppointments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Graduation Ready
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.graduationReady}</div>
            <p className="text-xs text-muted-foreground">
              Students eligible to graduate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Reports */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Statistics</CardTitle>
            <CardDescription>Student distribution by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Students</span>
                <span className="text-sm font-medium">
                  {stats.totalStudents}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Advisors</span>
                <span className="text-sm font-medium">
                  {stats.totalAdvisors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Administrators</span>
                <span className="text-sm font-medium">{stats.totalAdmins}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guidance Activity</CardTitle>
            <CardDescription>Appointment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Appointments</span>
                <span className="text-sm font-medium">
                  {stats.totalAppointments}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Scheduled</span>
                <span className="text-sm font-medium">
                  {stats.scheduledAppointments}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">
                  {stats.completedAppointments}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
