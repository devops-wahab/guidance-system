import { Suspense } from "react";
import { getAvailableCourses, getEnrolledCourses } from "@/lib/student-actions";
import { CourseRegistrationForm } from "@/components/student/CourseRegistrationForm";
import { Separator } from "@/components/ui/separator";

export default async function CourseRegistrationPage() {
  const availableCourses = await getAvailableCourses();
  const enrolledCourses = await getEnrolledCourses();

  const enrolledCourseIds = enrolledCourses.map((c) => c.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-bold">Course Registration</h3>
        <p className="text-sm text-muted-foreground">
          Register new courses for the upcoming semester.
        </p>
      </div>

      <Suspense fallback={<div>Loading courses...</div>}>
        <CourseRegistrationForm
          availableCourses={availableCourses}
          enrolledCourseIds={enrolledCourseIds}
        />
      </Suspense>
    </div>
  );
}
