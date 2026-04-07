"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  level?: string;
}

interface EnrolledCoursesListProps {
  courses: Course[];
}

export function EnrolledCoursesList({ courses }: EnrolledCoursesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Semester Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-4 mb-4">
              {paginatedCourses.map((course) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, courses.length)} of{" "}
                  {courses.length} courses
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
            No courses registered for this semester yet.
            <Button className="mt-4" asChild>
              <Link href="/student/registration">Register Courses</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
