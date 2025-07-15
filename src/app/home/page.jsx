
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect this legacy route to the main landing page.
    router.replace("/");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Redirecting...</h1>
    </div>
  );
}
