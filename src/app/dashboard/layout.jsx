
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
]

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex flex-col space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start gap-2"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
            <Separator className="my-2" />
             <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
            </Button>
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
