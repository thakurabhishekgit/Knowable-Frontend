
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, Menu, LogOut, Home } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspaces" },
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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const publicPages = ['/', '/login', '/register'];
  if (publicPages.includes(pathname)) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    router.push("/");
    setIsMobileMenuOpen(false);
  };
  
  const isDocumentPage = pathname.startsWith('/document/');
  const isResultsPage = pathname.startsWith('/results');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-50 shrink-0">
        
        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="p-4 border-b">
                     <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-left">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        <span className="text-lg">Knowable.AI</span>
                    </Link>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium p-4">
                    {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                            pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.label}
                    </Link>
                    ))}
                </nav>
                <div className="mt-auto p-4">
                    <Separator className="mb-4" />
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-lg font-medium text-muted-foreground">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
        
        {/* Desktop Menu */}
        <div className="flex items-center w-full">
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
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
                >
                {item.label}
                </Link>
            ))}
            </nav>
            
            <div className="flex items-center gap-4 ml-auto">
                <UserNav />
            </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!(isDocumentPage || isResultsPage) && <Footer />}
    </div>
  );
}
