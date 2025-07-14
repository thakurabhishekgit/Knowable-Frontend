
"use client";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, FileText } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    color: "hsl(var(--chart-1))",
  },
};

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                 <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,592</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Documents</CardTitle>
                 <PlusCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">+18.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workspace Size</CardTitle>
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2 GB</div>
                <p className="text-xs text-muted-foreground">Your team is growing</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+5</div>
                <p className="text-xs text-muted-foreground">members online</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Knowledge Growth</CardTitle>
                <CardDescription>Your team's content creation over the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                 <ChartContainer config={chartConfig} className="h-full w-full">
                   <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Area dataKey="items" type="natural" fill="var(--color-items)" fillOpacity={0.4} stroke="var(--color-items)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>What's new in your workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint="avatar person" />
                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                          <span className="font-semibold text-primary">{activity.item}</span>
                        </p>
                         <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    </AppLayout>
  );
}
