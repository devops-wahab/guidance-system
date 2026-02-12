"use client";

import { useState } from "react";
import { Course } from "@/lib/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { CreateCourseDialog } from "./CreateCourseDialog";
import { EditCourseDialog } from "./EditCourseDialog";
import { DeleteCourseDialog } from "./DeleteCourseDialog";

interface CourseManagementTableProps {
  initialCourses: Course[];
}

export function CourseManagementTable({
  initialCourses,
}: CourseManagementTableProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter courses
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCourseCreated = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
    setCreateDialogOpen(false);
  };

  const handleCourseUpdated = (updatedCourse: Course) => {
    setCourses(
      courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)),
    );
    setEditDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleCourseDeleted = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Courses ({filteredCourses.length})</CardTitle>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.code}
                      </TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateCourseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCourseCreated={handleCourseCreated}
      />

      {selectedCourse && (
        <>
          <EditCourseDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            course={selectedCourse}
            onCourseUpdated={handleCourseUpdated}
          />
          <DeleteCourseDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            course={selectedCourse}
            onCourseDeleted={handleCourseDeleted}
          />
        </>
      )}
    </div>
  );
}
