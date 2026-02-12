"use client";

import { useState } from "react";
import { assignStudentToAdvisor } from "@/lib/admin-actions";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignAdvisorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: User;
  advisors: User[];
  onAssignmentComplete: (studentId: string, advisorId: string) => void;
}

export function AssignAdvisorDialog({
  open,
  onOpenChange,
  student,
  advisors,
  onAssignmentComplete,
}: AssignAdvisorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>(
    student.advisorId || "",
  );

  const handleAssign = async () => {
    if (!selectedAdvisorId) {
      setError("Please select an advisor");
      return;
    }

    setLoading(true);
    setError("");

    const result = await assignStudentToAdvisor(student.uid, selectedAdvisorId);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      onAssignmentComplete(student.uid, selectedAdvisorId);
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Advisor</DialogTitle>
          <DialogDescription>
            Assign an advisor to {student.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Student</Label>
            <div className="rounded-md border p-3 bg-muted/50">
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="advisor">Select Advisor</Label>
            <Select
              value={selectedAdvisorId}
              onValueChange={setSelectedAdvisorId}
            >
              <SelectTrigger id="advisor">
                <SelectValue placeholder="Choose an advisor" />
              </SelectTrigger>
              <SelectContent>
                {advisors.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No advisors available
                  </div>
                ) : (
                  advisors.map((advisor) => (
                    <SelectItem key={advisor.uid} value={advisor.uid}>
                      {advisor.name} ({advisor.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {student.advisorId && (
            <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3 text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                Current advisor:{" "}
                <span className="font-medium">
                  {advisors.find((a) => a.uid === student.advisorId)?.name ||
                    "Unknown"}
                </span>
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={loading || !selectedAdvisorId}
          >
            {loading ? "Assigning..." : "Assign Advisor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
