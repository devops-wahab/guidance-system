"use client";

import { useState } from "react";
import { createUser } from "@/lib/admin-actions";
import { User, CreateUserData } from "@/lib/types/admin";
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

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createUser(formData);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      // Create user object for table update
      const newUser: User = {
        uid: result.uid!,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date(),
        ...formData, // Include all optional fields
      };
      onUserCreated(newUser);
      setFormData({ name: "", email: "", password: "", role: "student" });
      setLoading(false);
    }
  };

  const handleRoleChange = (role: any) => {
    // Reset role-specific fields when role changes
    setFormData({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
    });
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="e.g., Chioma Nwankwo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="e.g., +234 901 234 5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="e.g., chioma@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="advisor">Advisor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student-Specific Fields */}
          {formData.role === "student" && (
            <>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">
                  Student Information
                </h4>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                      placeholder="e.g., 2024/CS/001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="matricNumber">Matric Number</Label>
                    <Input
                      id="matricNumber"
                      value={formData.matricNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          matricNumber: e.target.value,
                        })
                      }
                      placeholder="e.g., U2024/3456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">Major/Program</Label>
                    <Input
                      id="major"
                      value={formData.major || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, major: e.target.value })
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, level: value })
                      }
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100 Level">100 Level</SelectItem>
                        <SelectItem value="200 Level">200 Level</SelectItem>
                        <SelectItem value="300 Level">300 Level</SelectItem>
                        <SelectItem value="400 Level">400 Level</SelectItem>
                        <SelectItem value="500 Level">500 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                    <Input
                      id="enrollmentYear"
                      type="number"
                      value={formData.enrollmentYear || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          enrollmentYear: parseInt(e.target.value) || undefined,
                        })
                      }
                      placeholder="e.g., 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedGraduation">
                      Expected Graduation
                    </Label>
                    <Input
                      id="expectedGraduation"
                      value={formData.expectedGraduation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedGraduation: e.target.value,
                        })
                      }
                      placeholder="e.g., 2028"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Advisor-Specific Fields */}
          {formData.role === "advisor" && (
            <>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">
                  Advisor Information
                </h4>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeLocation">Office Location</Label>
                    <Input
                      id="officeLocation"
                      value={formData.officeLocation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          officeLocation: e.target.value,
                        })
                      }
                      placeholder="e.g., Faculty Block B, Room 205"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeHours">Office Hours</Label>
                    <Input
                      id="officeHours"
                      value={formData.officeHours || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          officeHours: e.target.value,
                        })
                      }
                      placeholder="e.g., Mon-Fri 10:00 AM - 12:00 PM"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
