
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
  { href: "/settings", label: "Settings" },
];

export function AppLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <span className="text-lg">Knowable.AI</span>
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background/95">
        {children}
      </main>
    </div>
  );
}
