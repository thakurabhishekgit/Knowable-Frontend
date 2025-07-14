
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut, Folder, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";

const getInitials = (name = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);

  const fetchWorkspaces = async (userId) => {
    try {
        const fetchedWorkspaces = await api.get(`/api/workspace/user/${userId}`);
        setWorkspaces(fetchedWorkspaces);
         // Update user in local storage with fresh workspaces
         const localUser = JSON.parse(localStorage.getItem('user'));
         if(localUser) {
             localUser.workspaces = fetchedWorkspaces;
             localStorage.setItem('user', JSON.stringify(localUser));
         }
    } catch (error) {
        console.error("Failed to fetch workspaces for sidebar", error);
    }
  }

  useEffect(() => {
    const handleStorageChange = () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.id) {
                fetchWorkspaces(parsedUser.id);
            }
        } else {
            setUser(null);
            setWorkspaces([]);
        }
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/4">
          <nav className="flex flex-col space-y-4">
             <div className="px-4 py-2">
                <h3 className="mb-2 text-lg font-semibold tracking-tight">Workspaces</h3>
                <div className="flex flex-col gap-1">
                    {workspaces && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <Link
                                key={workspace.id}
                                href={`/workspace/${workspace.id}`}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "justify-start gap-2"
                                )}
                            >
                                <Folder className="h-4 w-4" />
                                {workspace.name}
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No workspaces yet.</p>
                    )}
                </div>
            </div>
            <Separator />
            <div className="flex flex-col space-y-1 px-2">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start gap-2"
                    )}
                >
                    <Edit className="h-4 w-4" />
                    Update Profile
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
