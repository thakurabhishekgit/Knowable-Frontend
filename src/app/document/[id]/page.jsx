
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { api } from "@/lib/api";

export default function SingleDocumentPage() {
  const params = useParams();
  const { id } = params;
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        try {
          setLoading(true);
          const docData = await api.get(`/api/documents/${id}`);
          setDocument(docData);
        } catch (error) {
          console.error("Failed to fetch document", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDocument();
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
    return <div className="container mx-auto p-8">Loading document...</div>;
  }

  if (!document) {
    return (
      <div className="container mx-auto p-8">
        Document not found. It may have been deleted.
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
                <BreadcrumbLink href={`/workspace/${document.workspace.id}`}>
                  {document.workspace.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{document.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            {document.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            Type: {document.fileType} | Uploaded: {formatDate(document.uploadedAt)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Text</CardTitle>
          <CardDescription>
            This is the text content extracted from the uploaded file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            <pre className="whitespace-pre-wrap text-sm">{document.textExtracted}</pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
