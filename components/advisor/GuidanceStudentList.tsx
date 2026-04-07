"use client";

import { User } from "@/lib/types/admin";
import { summonStudent, markStudentAsSeen } from "@/lib/advisor-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  CheckCircle,
  Clock,
  User as UserIcon,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GuidanceStudentListProps {
  initialStudents: User[];
}

const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return "N/A";
  return phoneNumber.replace(/^\+234\s*/, "0");
};

export function GuidanceStudentList({
  initialStudents,
}: GuidanceStudentListProps) {
  const [students, setStudents] = useState<User[]>(initialStudents);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSummon = async (studentId: string) => {
    setLoadingId(studentId);
    try {
      const result = await summonStudent(studentId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Student summoned successfully");
        setStudents((prev) =>
          prev.map((s) =>
            s.uid === studentId ? { ...s, guidanceStatus: "summoned" } : s,
          ),
        );
      }
    } catch (error) {
      toast.error("Failed to summon student");
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkSeen = async (studentId: string) => {
    setLoadingId(studentId);
    try {
      const result = await markStudentAsSeen(studentId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Student marked as seen");
        setStudents((prev) =>
          prev.map((s) =>
            s.uid === studentId ? { ...s, guidanceStatus: "seen" } : s,
          ),
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const activeStudents = students.filter((s) => s.guidanceStatus !== "seen");
  const seenStudents = students.filter((s) => s.guidanceStatus === "seen");

  const StudentCard = ({
    student,
    isSeen = false,
  }: {
    student: User;
    isSeen?: boolean;
  }) => (
    <Card
      className={`group overflow-hidden transition-all hover:ring-2 hover:ring-indigo-500/20 ${isSeen ? "bg-muted/30 opacity-80" : "bg-card"}`}
    >
      <CardContent className="p-0">
        {student.guidanceStatus === "summoned" && !isSeen && (
          <div className="px-4 py-1 pb-5">
            <div className="rounded px-3 py-2 bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Clock className="h-3 w-3 animate-pulse" />
              Awaiting Student Visit
            </div>
          </div>
        )}
        <div className="py-6 pt-1 px-4 flex items-start gap-4">
          {/* <Avatar className="h-12 w-12 border-2 border-indigo-100 dark:border-indigo-900">
            <AvatarFallback className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
              {student.name?.split(' ').map(n => n[0]).join('').toUpperCase() || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar> */}

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-lg truncate leading-none">
                {student.name}
              </h3>
              <Badge
                variant={
                  isSeen
                    ? "outline"
                    : student.gpa && student.gpa < 2.0
                      ? "warning"
                      : "secondary"
                }
                className="shrink-0"
              >
                GPA: {student.gpa?.toFixed(2)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {student.studentId} • {student.level}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {formatPhoneNumber(student.phoneNumber)}
              </div>
            </div>
          </div>
        </div>

        {/* {student.guidanceStatus === "summoned" && !isSeen && (
          <div className="px-4 py-2 pb-5">
            <div className="rounded px-3 py-2 bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Clock className="h-3 w-3 animate-pulse" />
              Awaiting Student Visit
            </div>
          </div>
        )} */}

        <div className="p-3 pb-0 bg-muted/20 border-t flex gap-2">
          {!isSeen ? (
            student.guidanceStatus !== "summoned" ? (
              <Button
                className="w-full h-9 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-medium dark:bg-amber-600 dark:hover:bg-amber-700 transition-colors"
                onClick={() => handleSummon(student.uid)}
                disabled={loadingId === student.uid}
              >
                <Megaphone className="mr-2 h-4 w-4" />
                Summon Student
              </Button>
            ) : (
              <Button
                className="w-full h-9 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-transform active:scale-[0.98]"
                onClick={() => handleMarkSeen(student.uid)}
                disabled={loadingId === student.uid}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Session
              </Button>
            )
          ) : (
            <div className="w-full flex items-center justify-center py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1">
              <CheckCircle className="h-3 w-3" />
              Guidance Logged
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="pending" className="w-full">
      <div className="px-6 pt-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="pending">
            Pending ({activeStudents.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({seenStudents.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="pending"
        className="mt-4 px-6 pb-6 outline-none focus:ring-0"
      >
        {activeStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-4 mb-4">
              <CheckCircle className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-medium">All clear!</h3>
            <p className="text-muted-foreground">
              No students currently flagged for guidance.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeStudents.map((student) => (
              <StudentCard key={student.uid} student={student} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="completed"
        className="mt-4 px-6 pb-6 outline-none focus:ring-0"
      >
        {seenStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <p>No students processed yet this semester.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {seenStudents.map((student) => (
              <StudentCard key={student.uid} student={student} isSeen />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
