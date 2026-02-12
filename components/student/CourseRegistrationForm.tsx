"use client";

import { useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { registerCourses, EnrolledCourse } from "@/lib/student-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CourseRegistrationFormProps {
  availableCourses: any[]; // Using any[] for now as the type for available courses is a bit different from EnrolledCourse which has status
  enrolledCourseIds: string[];
}

export function CourseRegistrationForm({
  availableCourses,
  enrolledCourseIds,
}: CourseRegistrationFormProps) {
  const [selectedCourses, setSelectedCourses] =
    useState<string[]>(enrolledCourseIds);
  const [isPending, startTransition] = useTransition();

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const calculateTotalCredits = () => {
    return availableCourses
      .filter((course) => selectedCourses.includes(course.id))
      .reduce((sum, course) => sum + course.credits, 0);
  };

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const result = await registerCourses(selectedCourses);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Courses registered successfully");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
          <CardDescription>
            Select the courses you want to register for this semester.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={() => handleToggleCourse(course.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.level}</TableCell>
                  </TableRow>
                ))}
                {availableCourses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No courses available for registration.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Total Units Selected
          </span>
          <span className="text-2xl font-bold">{calculateTotalCredits()}</span>
        </div>
        <Button
          onClick={onSubmit}
          disabled={isPending || selectedCourses.length === 0}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Courses
        </Button>
      </div>
    </div>
  );
}
