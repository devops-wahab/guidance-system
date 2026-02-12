import { getAllCourses } from "@/lib/admin-actions";
import { CourseManagementTable } from "@/components/admin/CourseManagementTable";

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Manage the course catalog and curriculum
        </p>
      </div>

      <CourseManagementTable initialCourses={courses} />
    </div>
  );
}
