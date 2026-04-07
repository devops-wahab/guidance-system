"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCourse } from "@/lib/admin-actions";
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

// Schema
const createCourseSchema = z.object({
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

type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreated: (course: Course) => void;
}

export function CreateCourseDialog({
  open,
  onOpenChange,
  onCourseCreated,
}: CreateCourseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      code: "",
      name: "",
      credits: 3,
      description: "",
    },
  });

  // Reset form whenever the dialog opens/closes
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (values: CreateCourseFormValues) => {
    // We explicitly add an empty category to satisfy the existing API if needed,
    // or we'll update the API next.
    const result = await createCourse({ ...values, category: "" });

    if ("error" in result) {
      setError("root", { message: result.error });
      return;
    }

    const newCourse: Course = {
      id: result.id!,
      ...values,
      category: "", // Placeholder for backward compatibility
    };

    onCourseCreated(newCourse);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Add a new course to the curriculum catalog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" {...register("code")} />
            {errors.code && (
              <p className="text-xs text-destructive -mt-1">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive -mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              {...register("credits", { valueAsNumber: true })}
            />
            {errors.credits && (
              <p className="text-xs text-destructive -mt-1">
                {errors.credits.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Course description..."
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive -mt-1">
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
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
