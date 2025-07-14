
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { NewItemDialog } from "@/components/new-item-dialog";
import { VersionHistorySheet } from "@/components/version-history-sheet";
import { Clock, Folder, PlusCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function SingleWorkspacePage() {
  const params = useParams();
  const { id } = params;
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchWorkspace = async () => {
        try {
          setLoading(true);
          const data = await api.get(`/api/workspace/${id}`);
          setWorkspace(data);
        } catch (error) {
          console.error("Failed to fetch workspace", error);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkspace();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading workspace...</div>;
  }

  if (!workspace) {
    return (
      <div className="container mx-auto p-8">
        Workspace not found. It may have been deleted.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/workspace">Workspaces</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>{workspace.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-3xl font-bold mt-2 flex items-center gap-3">
                    <Folder className="h-8 w-8 text-primary" />
                    {workspace.name}
                </h1>
                <p className="text-muted-foreground mt-1">{workspace.description}</p>
            </div>
            <div className="flex gap-2">
                <VersionHistorySheet item={workspace}>
                    <Button variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        History
                    </Button>
                </VersionHistorySheet>
                <NewItemDialog>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Item
                    </Button>
                </NewItemDialog>
            </div>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Workspace Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">ID</p>
                        <p className="font-mono">{workspace.id}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Created At</p>
                        <p>{formatDate(workspace.createdAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* This will be where documents/notes are listed in the future */}
        <div className="text-center py-10 border rounded-lg">
            <h3 className="text-xl font-semibold">No items yet</h3>
            <p className="text-muted-foreground mt-2">Get started by adding a document, note, or link.</p>
        </div>
    </div>
  );
}
