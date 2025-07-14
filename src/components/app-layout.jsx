
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
];

function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">&copy; 2024 Knowable.AI. All rights reserved.</p>
                <div className="flex gap-4 mt-2 sm:mt-0">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
                </div>
            </div>
        </footer>
    )
}

export function AppLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Do not render layout for login/register pages
  if (pathname === "/" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-50">
        
        {/* Mobile Menu */}
        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium mt-6">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                            <BrainCircuit className="w-6 h-6 text-primary" />
                            <span className="text-lg">Knowable.AI</span>
                        </Link>
                        {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "transition-colors hover:text-foreground",
                                pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
        
        {/* Desktop Menu */}
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 font-semibold mr-6">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <span className="text-lg hidden sm:inline-block">Knowable.AI</span>
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
        
        <div className="flex items-center gap-4 ml-auto md:gap-2 lg:gap-4">
            <UserNav />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
