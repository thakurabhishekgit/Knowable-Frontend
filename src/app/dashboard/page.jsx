
"use client";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NewItemDialog } from "@/components/new-item-dialog";
import { PlusCircle, FileText, User as UserIcon, Mail, School } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";

const recentActivity = [
  { user: "Alex Doe", action: "updated", item: "Project Proposal", time: "2h ago", avatar: "https://placehold.co/100x100.png" },
  { user: "Jane Smith", action: "created", item: "Q3 Research Findings", time: "8h ago", avatar: "https://placehold.co/100x100.png" },
  { user: "Alex Doe", action: "commented on", item: "Marketing Strategy", time: "1d ago", avatar: "https://placehold.co/100x100.png" },
  { user: "System", action: "archived", item: "Old Invoices", time: "2d ago", avatar: "https://placehold.co/100x100.png" },
];

const chartData = [
  { month: "January", items: 186 },
  { month: "February", items: 305 },
  { month: "March", items: 237 },
  { month: "April", items: 273 },
  { month: "May", items: 209 },
  { month: "June", items: 214 },
];

const chartConfig = {
  items: {
    label: "Items",
    color: "hsl(var(--primary))",
  },
};

const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  return (
    <AppLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Welcome, {user?.username || 'User'}!</CardTitle>
            <CardDescription>Here's your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.profilePictureUrl || "https://placehold.co/100x100.png"} alt={user?.username || "User"} data-ai-hint="profile" />
                    <AvatarFallback className="text-2xl">{user ? getInitials(user.username) : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-lg font-bold">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">Welcome to your dashboard</p>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.universityName || 'University not set'}</span>
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle>Knowledge Growth</CardTitle>
            <CardDescription>
              Your team's content creation over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart
                data={chartData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Area
                  dataKey="items"
                  type="natural"
                  fill="var(--color-items)"
                  fillOpacity={0.4}
                  stroke="var(--color-items)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 xl:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              What's new in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint="avatar person" />
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                      <span className="font-semibold text-primary">{activity.item}</span>
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 xl:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Quick Add</CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">New Item</div>
                <p className="text-xs text-muted-foreground">
                Quickly add a new document or note.
                </p>
            </CardContent>
            <CardFooter>
                <NewItemDialog>
                <Button className="w-full">Create New</Button>
                </NewItemDialog>
            </CardFooter>
        </Card>

      </div>
    </AppLayout>
  );
}
