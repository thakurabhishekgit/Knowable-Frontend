import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";

const versions = [
    { id: 5, author: "Alex Doe", timestamp: "2 hours ago", summary: "Revised introduction and added new data points." },
    { id: 4, author: "Alex Doe", timestamp: "1 day ago", summary: "Edited for clarity and style." },
    { id: 3, author: "Jane Smith", timestamp: "3 days ago", summary: "Added section on future research." },
    { id: 2, author: "Alex Doe", timestamp: "5 days ago", summary: "Initial draft." },
    { id: 1, author: "System", timestamp: "5 days ago", summary: "Document created." },
];

export function VersionHistorySheet({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            Review and restore previous versions of this item.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-4rem)] pr-4 mt-4">
          <div className="space-y-6">
            {versions.map((version) => (
              <div key={version.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                  <div className="flex-1 w-px bg-border"></div>
                </div>
                <div>
                  <p className="font-semibold">Version {version.id}</p>
                  <p className="text-sm text-muted-foreground">{version.author} - {version.timestamp}</p>
                  <p className="text-sm mt-1">{version.summary}</p>
                  <Button variant="outline" size="sm" className="mt-2">Restore</Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
