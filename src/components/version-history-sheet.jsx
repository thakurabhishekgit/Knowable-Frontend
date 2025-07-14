
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
import { Badge } from "./ui/badge";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(date);
}

const mockHistory = [
    {
        date: "2024-07-28T10:00:00.000Z",
        events: [
            {
                version: 3,
                time: "2024-07-28T14:30:00.000Z",
                author: "Alex Doe",
                description: "Updated document with new findings.",
                current: true,
            },
            {
                version: 2,
                time: "2024-07-28T11:15:00.000Z",
                author: "Alex Doe",
                description: "Minor typo fixes.",
            },
        ]
    },
    {
        date: "2024-07-27T09:00:00.000Z",
        events: [
            {
                version: 1,
                time: "2024-07-27T09:05:00.000Z",
                author: "System",
                description: "Item created.",
            },
        ]
    }
];

export function VersionHistorySheet({ children, item }) {
  if (!item) return null;

  // For now, we'll use a mix of real and mock data.
  // The first version will use the item's creation date.
  const history = mockHistory;
  if (item.createdAt) {
      history[history.length - 1].events[0].time = item.createdAt;
      history[history.length - 1].date = item.createdAt;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            Review and restore previous versions of &quot;{item.name}&quot;.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-4rem)] pr-4 mt-4">
          <div className="space-y-8">
            {history.map((day, dayIndex) => (
                <div key={day.date}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px flex-1 bg-border"></div>
                        <h4 className="text-sm font-medium text-muted-foreground">{formatDate(day.date)}</h4>
                        <div className="h-px flex-1 bg-border"></div>
                    </div>

                    <div className="space-y-6">
                        {day.events.map((event, eventIndex) => (
                            <div key={event.version} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                                {(dayIndex < history.length -1 || eventIndex < day.events.length - 1) && (
                                    <div className="flex-1 w-px bg-border"></div>
                                )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{event.author}</p>
                                        <p className="text-xs text-muted-foreground">{formatTime(event.time)}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                    
                                    <div className="mt-2 flex gap-2 items-center">
                                        {event.current ? (
                                             <Badge variant="outline">Current</Badge>
                                        ) : (
                                            <Button variant="outline" size="sm">Restore</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
