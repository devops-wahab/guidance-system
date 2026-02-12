"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { LayoutDashboard, Users, BookOpen, BarChart } from "lucide-react";

const adminItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Reports", href: "/admin/reports", icon: BarChart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={adminItems} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
