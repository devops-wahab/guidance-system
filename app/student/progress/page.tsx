import { getStudentProfile } from "@/lib/student-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default async function DegreeProgressPage() {
  const profile = await getStudentProfile();

  // Mock Progress Data based on Level
  const totalUnitsRequired = 150;
  let earnedUnits = 0;

  if (profile.level === "100 Level") earnedUnits = 15;
  if (profile.level === "200 Level") earnedUnits = 45;
  if (profile.level === "300 Level") earnedUnits = 85;
  if (profile.level === "400 Level") earnedUnits = 120;
  if (profile.level === "500 Level") earnedUnits = 140;

  const progressPercentage = (earnedUnits / totalUnitsRequired) * 100;

  const requirements = [
    {
      name: "General Studies (GNS)",
      required: 12,
      earned: profile.level === "100 Level" ? 4 : 12,
      completed: profile.level !== "100 Level",
    },
    {
      name: "Faculty Core",
      required: 30,
      earned: earnedUnits > 30 ? 30 : earnedUnits,
      completed: earnedUnits > 30,
    },
    {
      name: "Departmental Core",
      required: 90,
      earned: earnedUnits > 45 ? 60 : 20,
      completed: false,
    },
    { name: "Electives", required: 18, earned: 6, completed: false },
  ];

  return (
    <div className="space-y-8 container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Degree Progress</h1>
        <p className="text-muted-foreground mb-8">
          Track your progress towards your Bachelor of Science in{" "}
          {profile.major}.
        </p>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Completion</CardTitle>
            <CardDescription>
              {earnedUnits} of {totalUnitsRequired} Units Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-4 w-full" />
            <p className="text-right text-sm text-muted-foreground mt-2">
              {progressPercentage.toFixed(1)}% Completed
            </p>
          </CardContent>
        </Card>

        {/* Requirements Breakdown */}
        <h2 className="text-xl font-semibold mb-4">Degree Requirements</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {requirements.map((req) => (
            <Card
              key={req.name}
              className={
                req.completed ? "border-green-500/50 bg-green-50/10" : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{req.name}</CardTitle>
                  {req.completed ? (
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                  ) : (
                    <Circle className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span>
                    {req.earned} / {req.required} Units
                  </span>
                  <span
                    className={
                      req.completed
                        ? "text-green-600 font-medium"
                        : "text-amber-600"
                    }
                  >
                    {req.completed ? "Completed" : "In Progress"}
                  </span>
                </div>
                <Progress
                  value={(req.earned / req.required) * 100}
                  className="h-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">
              Graduation Requirement Note
            </h4>
            <p className="text-sm opacity-90">
              Students must maintain a minimum CGPA of 1.50 to remain in good
              standing. Ensure all GNS courses are passed before final
              clearance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
