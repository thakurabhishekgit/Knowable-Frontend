
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
import { Clock, Folder, PlusCircle, FileText } from "lucide-react";
import { api } from "@/lib/api";

export default function SingleWorkspacePage() {
  const params = useParams();
  const { id } = params;
  const [workspace, setWorkspace] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaceAndDocuments = async () => {
    if (id) {
      try {
        setLoading(true);
        const workspaceData = await api.get(`/api/workspace/${id}`);
        setWorkspace(workspaceData);
        // Assuming there is an endpoint to get documents for a workspace
        const documentsData = await api.get(`/api/documents/workspace/${id}`);
        setDocuments(documentsData);
      } catch (error) {
        // If the get documents call fails, we can assume there are none yet.
        if (error.message.includes('404')) {
          setDocuments([]);
        } else {
          console.error("Failed to fetch workspace or documents", error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchWorkspaceAndDocuments();
  }, [id]);

  const handleItemCreated = () => {
    fetchWorkspaceAndDocuments(); // Re-fetch everything to get the new document
  };

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
                <NewItemDialog workspaceId={id} onItemCreated={handleItemCreated}>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Item
                    </Button>
                </NewItemDialog>
            </div>
        </div>

      <div className="grid gap-8">
        {documents && documents.length > 0 ? (
          <div className="grid gap-6">
            <h2 className="text-2xl font-semibold">Documents</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <FileText className="h-6 w-6 mt-1 text-primary" />
                      <div>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>{doc.fileType}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Uploaded: {formatDate(doc.uploadedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-card">
              <h3 className="text-xl font-semibold">No items yet</h3>
              <p className="text-muted-foreground mt-2">Get started by adding a document, note, or link.</p>
          </div>
        )}
      </div>
    </div>
  );
}
