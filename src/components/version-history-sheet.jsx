
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

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function VersionHistorySheet({ children, item }) {
  if (!item) return null;

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
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                  <div className="flex-1 w-px bg-border"></div>
                </div>
                <div>
                  <p className="font-semibold">Version 1</p>
                  <p className="text-sm text-muted-foreground">System - {formatDate(item.createdAt)}</p>
                  <p className="text-sm mt-1">Workspace created.</p>
                  <Button variant="outline" size="sm" className="mt-2" disabled>Current</Button>
                </div>
              </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
