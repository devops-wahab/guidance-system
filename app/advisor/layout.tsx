"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { LayoutDashboard, Calendar, Users } from "lucide-react";

const advisorItems = [
  {
    title: "Dashboard",
    href: "/advisor",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/advisor/schedule",
    icon: Calendar,
  },
  {
    title: "Students",
    href: "/advisor/students",
    icon: Users,
  },
];

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={advisorItems} />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  );
}
