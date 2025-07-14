
"use client";
import { AppLayout } from "@/components/app-layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Redirecting...</h1>
      </div>
    </AppLayout>
  );
}
