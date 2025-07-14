import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  FileText,
  Clock,
  Trash2,
  Edit,
  Folder,
} from "lucide-react";
import { NewItemDialog } from "@/components/new-item-dialog";
import { VersionHistorySheet } from "@/components/version-history-sheet";

const items = [
  { name: "Project Phoenix Proposal", type: "Document", lastModified: "2 hours ago", icon: FileText, category: "Projects" },
  { name: "Q3 Marketing Analytics", type: "Document", lastModified: "1 day ago", icon: FileText, category: "Marketing" },
  { name: "Competitor Analysis", type: "Research", lastModified: "3 days ago", icon: Folder, category: "Research" },
  { name: "Onboarding new members", type: "Document", lastModified: "5 days ago", icon: FileText, category: "Internal" },
  { name: "UI/UX Inspiration", type: "Collection", lastModified: "1 week ago", icon: Folder, category: "Design" },
];

export default function WorkspacePage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Workspace</h1>
            <p className="text-muted-foreground">Manage all your team's knowledge assets.</p>
        </div>
        <NewItemDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Item
          </Button>
        </NewItemDialog>
      </div>

      <div className="border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>{item.lastModified}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <NewItemDialog>
                      <Button variant="ghost" size="icon" aria-label="Edit Item">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </NewItemDialog>
                    <VersionHistorySheet>
                      <Button variant="ghost" size="icon" aria-label="View Version History">
                        <Clock className="h-4 w-4" />
                      </Button>
                    </VersionHistorySheet>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete Item">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
