"use client";

import { User } from "@/lib/types/admin";
import { summonStudent, markStudentAsSeen } from "@/lib/advisor-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Megaphone, CheckCircle, Clock } from "lucide-react";

interface GuidanceStudentListProps {
  initialStudents: User[];
}

export function GuidanceStudentList({
  initialStudents,
}: GuidanceStudentListProps) {
  const [students, setStudents] = useState<User[]>(initialStudents);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSummon = async (studentId: string) => {
    setLoadingId(studentId);
    try {
      const result = await summonStudent(studentId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Student summoned successfully");
        // Update local state
        setStudents((prev) =>
          prev.map((s) =>
            s.uid === studentId ? { ...s, guidanceStatus: "sumoned" } : s,
          ),
        );
      }
    } catch (error) {
      toast.error("Failed to summon student");
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkSeen = async (studentId: string) => {
    setLoadingId(studentId);
    try {
      const result = await markStudentAsSeen(studentId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Student marked as seen");
        // Update local state to remove or update status
        setStudents((prev) =>
          prev.map((s) =>
            s.uid === studentId ? { ...s, guidanceStatus: "seen" } : s,
          ),
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const activeStudents = students.filter((s) => s.guidanceStatus !== "seen");
  const seenStudents = students.filter((s) => s.guidanceStatus === "seen");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-destructive" />
          Students Needing Guidance ({activeStudents.length})
        </h2>

        {activeStudents.length === 0 ? (
          <p className="text-muted-foreground italic">
            No students currently flagged for guidance.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeStudents.map((student) => (
              <Card
                key={student.uid}
                className="border-l-4 border-l-destructive shadow-sm"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <Badge variant="destructive" className="ml-2">
                      GPA: {student.gpa?.toFixed(2)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {student.studentId} • {student.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 text-sm">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-muted-foreground block text-xs">
                        Department
                      </span>
                      <span className="font-medium">{student.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">
                        Phone
                      </span>
                      <span className="font-medium">
                        {student.phoneNumber || "N/A"}
                      </span>
                    </div>
                  </div>

                  {student.guidanceStatus === "sumoned" && (
                    <div className="mt-4 p-2 bg-amber-50 rounded border border-amber-200 text-amber-800 flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      Summoned - Waiting for visit
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2 flex gap-2">
                  {student.guidanceStatus !== "sumoned" ? (
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => handleSummon(student.uid)}
                      disabled={loadingId === student.uid}
                    >
                      {loadingId === student.uid ? "Sending..." : "Come See Me"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="default" // Green/Primary for completion
                      onClick={() => handleMarkSeen(student.uid)}
                      disabled={loadingId === student.uid}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Seen
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {seenStudents.length > 0 && (
        <div className="opacity-75">
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recently Seen ({seenStudents.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {seenStudents.map((student) => (
              <Card
                key={student.uid}
                className="bg-muted/50 border-l-4 border-l-green-500"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-muted-foreground">
                    {student.name}
                  </CardTitle>
                  <CardDescription>Guidance Completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Student verified and guided.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
