"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Home,
  ListChecks,
} from "lucide-react";

const studentItems: any[] = [
  { title: "Dashboard", href: "/student", icon: LayoutDashboard },
  {
    title: "Course Registration",
    href: "/student/registration",
    icon: ListChecks,
  },
  { title: "Transcript", href: "/student/transcript", icon: FileText },
  { title: "Degree Progress", href: "/student/progress", icon: GraduationCap },
  { variant: "separator" },
  { title: "Apply Hostel", href: "/student/hostel", icon: Home },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={studentItems} />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  );
}
