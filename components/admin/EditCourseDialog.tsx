"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateCourse } from "@/lib/admin-actions";
import { Course } from "@/lib/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const editCourseSchema = z.object({
  code: z
    .string()
    .min(3, "Course code must be at least 3 characters")
    .max(10, "Course code must not exceed 10 characters")
    .toUpperCase(),
  name: z.string().min(3, "Course name must be at least 3 characters"),
  credits: z
    .number()
    .min(1, "Credits must be at least 1")
    .max(6, "Credits cannot exceed 6"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type EditCourseFormValues = z.infer<typeof editCourseSchema>;

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onCourseUpdated: (course: Course) => void;
}

export function EditCourseDialog({
  open,
  onOpenChange,
  course,
  onCourseUpdated,
}: EditCourseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditCourseFormValues>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      code: course.code,
      name: course.name,
      credits: course.credits,
      description: course.description,
    },
  });

  // Load course data into form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        code: course.code,
        name: course.name,
        credits: course.credits,
        description: course.description,
      });
    }
  }, [open, course, reset]);

  const onSubmit = async (values: EditCourseFormValues) => {
    const result = await updateCourse(course.id, { ...values, category: "" });

    if ("error" in result) {
      setError("root", { message: result.error });
      return;
    }

    const updatedCourse: Course = {
      ...course,
      ...values,
      category: "", // Preserve empty category for backward compatibility
    };

    onCourseUpdated(updatedCourse);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update course information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-code">Course Code</Label>
            <Input id="edit-code" {...register("code")} placeholder="e.g. CS101" />
            {errors.code && (
              <p className="text-xs text-destructive mt-1">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Course Name</Label>
            <Input
              id="edit-name"
              {...register("name")}
              placeholder="e.g. Intro to Programming"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-credits">Credits</Label>
            <Input
              id="edit-credits"
              type="number"
              {...register("credits", { valueAsNumber: true })}
            />
            {errors.credits && (
              <p className="text-xs text-destructive mt-1">
                {errors.credits.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              {...register("description")}
              placeholder="Course description..."
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
