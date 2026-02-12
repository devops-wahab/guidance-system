import { getAdvisorProfile, getGuidanceStudents } from "@/lib/advisor-actions";
import { GuidanceStudentList } from "@/components/advisor/GuidanceStudentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle } from "lucide-react";

export default async function AdvisorDashboard() {
  const profile = await getAdvisorProfile();
  const atRiskStudents = await getGuidanceStudents();

  return (
    <div className="space-y-6 container mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Advisor Dashboard</h1>
        <p className="text-muted-foreground">
          Department:{" "}
          <span className="font-semibold text-foreground">
            {profile.department || "Not Assigned"}
          </span>{" "}
          • Office:{" "}
          <span className="font-semibold text-foreground">
            {profile.officeLocation || "Not Assigned"}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Department Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              in {profile.department}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Guidance
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {atRiskStudents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Students with GPA &lt; 2.0
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <GuidanceStudentList initialStudents={atRiskStudents} />
      </div>
    </div>
  );
}
