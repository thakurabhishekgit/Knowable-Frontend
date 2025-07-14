import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
  } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  FileText,
  Clock,
  Trash2,
  Edit,
  Folder,
  MoreVertical
} from "lucide-react";
import { NewItemDialog } from "@/components/new-item-dialog";
import { VersionHistorySheet } from "@/components/version-history-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

const items = [
  { name: "Project Phoenix Proposal", type: "Document", lastModified: "2 hours ago", icon: FileText, category: "Projects" },
  { name: "Q3 Marketing Analytics", type: "Document", lastModified: "1 day ago", icon: FileText, category: "Marketing" },
  { name: "Competitor Analysis", type: "Research", lastModified: "3 days ago", icon: Folder, category: "Research" },
  { name: "Onboarding new members", type: "Document", lastModified: "5 days ago", icon: FileText, category: "Internal" },
  { name: "UI/UX Inspiration", type: "Collection", lastModified: "1 week ago", icon: Folder, category: "Design" },
];

function ItemActions({ item }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <NewItemDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                </NewItemDialog>
                <VersionHistorySheet>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Version History</span>
                    </DropdownMenuItem>
                </VersionHistorySheet>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function WorkspacePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Workspace</h1>
            <p className="text-muted-foreground">Manage all your team's knowledge assets.</p>
        </div>
        <NewItemDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Item</span>
            <span className="inline sm:hidden">New</span>
          </Button>
        </NewItemDialog>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block border rounded-lg shadow-sm">
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

      {/* Mobile View - Cards */}
      <div className="md:hidden grid gap-4">
        {items.map((item) => (
            <Card key={item.name}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                             <item.icon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                        </div>
                        <ItemActions item={item} />
                    </div>
                    <CardDescription>
                        <Badge variant="secondary">{item.category}</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Last modified: {item.lastModified}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
