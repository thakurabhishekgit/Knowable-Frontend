
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page now redirects to the profile settings page by default.
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);
  
  return (
      <div className="flex items-center justify-center h-full p-10">
        <h1 className="text-2xl font-bold">Redirecting to settings...</h1>
      </div>
  );
}
