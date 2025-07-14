
"use client";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
import { Folder } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if(userData) {
            setUser(JSON.parse(userData));
        }
    }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
      <div>
        <div className="space-y-0.5 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Welcome, {user.username}!</h2>
            <p className="text-muted-foreground">
            Here are your knowledge workspaces.
            </p>
        </div>
        
        {user.workspaces && user.workspaces.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {user.workspaces.map((workspace) => (
                    <Link href={`/workspace/${workspace.id}`} key={workspace.id}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Folder className="h-6 w-6 text-primary" />
                                    <CardTitle>{workspace.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{workspace.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 border rounded-lg">
                <h3 className="text-xl font-semibold">No workspaces yet</h3>
                <p className="text-muted-foreground mt-2">Get started by creating a new workspace.</p>
            </div>
        )}
      </div>
  );
}
