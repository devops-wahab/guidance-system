"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUser } from "@/lib/admin-actions";
import { User } from "@/lib/types/admin";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const baseSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Enter a valid phone number"),
  role: z.enum(["student", "advisor", "admin"]),
  // Student-specific (validated in superRefine)
  studentId: z.string().optional(),
  matricNumber: z.string().optional(),
  major: z.string().optional(),
  level: z.string().optional(),
  enrollmentYear: z.any().optional(), // Validated in superRefine
  expectedGraduation: z.string().optional(),
  // Advisor-specific (validated in superRefine)
  department: z.string().optional(),
  officeLocation: z.string().optional(),
  officeHours: z.string().optional(),
});

// Conditionally require student / advisor fields based on role
const createUserSchema = baseSchema.superRefine((data, ctx) => {
  if (data.role === "student") {
    if (!data.studentId?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Student ID is required",
        path: ["studentId"],
      });
    }
    if (!data.matricNumber?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Matric number is required",
        path: ["matricNumber"],
      });
    }
    if (!data.major?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Major/Program is required",
        path: ["major"],
      });
    }
    if (!data.level?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Level is required",
        path: ["level"],
      });
    }
    if (
      data.enrollmentYear === undefined ||
      data.enrollmentYear === null ||
      isNaN(data.enrollmentYear)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Enrollment year is required",
        path: ["enrollmentYear"],
      });
    } else if (data.enrollmentYear < 1900 || data.enrollmentYear > 2100) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter a valid year between 1900 and 2100",
        path: ["enrollmentYear"],
      });
    }
    if (!data.expectedGraduation?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Expected graduation is required",
        path: ["expectedGraduation"],
      });
    }
  }

  if (data.role === "advisor") {
    if (!data.department?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Department is required for advisors",
        path: ["department"],
      });
    }
    if (!data.officeLocation?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Office location is required",
        path: ["officeLocation"],
      });
    }
    if (!data.officeHours?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Office hours are required",
        path: ["officeHours"],
      });
    }
  }
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: User) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "student",
    },
  });

  const role = watch("role");

  // Reset form whenever the dialog opens/closes
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: CreateUserFormValues) => {
    const result = await createUser(data);

    if ("error" in result) {
      setError("root", { message: result.error });
      return;
    }

    const newUser: User = {
      uid: result.uid!,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date(),
    };

    onUserCreated(newUser);
    reset();
  };

  const handleRoleChange = (value: "student" | "advisor" | "admin") => {
    // Preserve common fields, clear role-specific ones
    setValue("role", value);
    setValue("studentId", "");
    setValue("matricNumber", "");
    setValue("major", "");
    setValue("level", "");
    setValue("enrollmentYear", undefined);
    setValue("expectedGraduation", "");
    setValue("department", "");
    setValue("officeLocation", "");
    setValue("officeHours", "");
  };

  // Helper: renders a field-level error message
  const FieldError = ({
    name,
  }: {
    name: keyof CreateUserFormValues | "root";
  }) => {
    const error =
      name === "root"
        ? errors.root
        : errors[name as keyof CreateUserFormValues];

    if (!error) return null;

    const message = error.message;

    return typeof message === "string" ? (
      <p className="text-xs text-destructive mt-1">{message}</p>
    ) : null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new student, advisor, or administrator to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} />
            <div className="-mt-1">
              <FieldError name="name" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input id="phoneNumber" {...register("phoneNumber")} />
            <div className="-mt-1">
              <FieldError name="phoneNumber" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input id="email" type="email" {...register("email")} />
            <div className="-mt-1">
              <FieldError name="email" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input id="password" type="password" {...register("password")} />
            <div className="-mt-1">
              <FieldError name="password" />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="advisor">Advisor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="-mt-1">
              <FieldError name="role" />
            </div>
          </div>

          {/* ── Student-Specific Fields ── */}
          {role === "student" && (
            <div className="border-t pt-6 space-y-5">
              <h4 className="text-sm font-semibold">Student Information</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="studentId">
                    Student ID <span className="text-destructive">*</span>
                  </Label>
                  <Input id="studentId" {...register("studentId")} />
                  <div className="-mt-1">
                    <FieldError name="studentId" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricNumber">
                    Matric Number <span className="text-destructive">*</span>
                  </Label>
                  <Input id="matricNumber" {...register("matricNumber")} />
                  <div className="-mt-1">
                    <FieldError name="matricNumber" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">
                    Major/Program <span className="text-destructive">*</span>
                  </Label>
                  <Input id="major" {...register("major")} />
                  <div className="-mt-1">
                    <FieldError name="major" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">
                    Level <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("level") ?? ""}
                    onValueChange={(v) =>
                      setValue("level", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "100 Level",
                        "200 Level",
                        "300 Level",
                        "400 Level",
                        "500 Level",
                      ].map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="-mt-1">
                    <FieldError name="level" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentYear">
                    Enrollment Year <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="enrollmentYear"
                    type="number"
                    {...register("enrollmentYear", { valueAsNumber: true })}
                  />
                  <div className="-mt-1">
                    <FieldError name="enrollmentYear" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedGraduation">
                    Expected Graduation{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="expectedGraduation"
                    {...register("expectedGraduation")}
                  />
                  <div className="-mt-1">
                    <FieldError name="expectedGraduation" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Advisor-Specific Fields ── */}
          {role === "advisor" && (
            <div className="border-t pt-6 space-y-5">
              <h4 className="text-sm font-semibold">Advisor Information</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="department"
                    placeholder="e.g., Computer Science"
                    {...register("department")}
                  />
                  <div className="-mt-1">
                    <FieldError name="department" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeLocation">
                    Office Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="officeLocation"
                    placeholder="e.g., Faculty Block B, Room 205"
                    {...register("officeLocation")}
                  />
                  <div className="-mt-1">
                    <FieldError name="officeLocation" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeHours">
                    Office Hours <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="officeHours"
                    placeholder="e.g., Mon-Fri 10:00 AM - 12:00 PM"
                    {...register("officeHours")}
                  />
                  <div className="-mt-1">
                    <FieldError name="officeHours" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Root / server error */}
          {errors.root && typeof errors.root.message === "string" && (
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
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
