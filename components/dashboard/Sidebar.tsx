"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-actions";
// import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SidebarItem {
  title?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "separator";
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // router.push("/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/20">
      <div className="flex h-14 items-center border-b px-6 font-semibold">
        Guidance System
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item, index) =>
          item.variant === "separator" ? (
            <div key={index} className="my-2 border-t border-muted" />
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.title}
            </Link>
          ),
        )}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
