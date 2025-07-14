
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page if not authenticated, otherwise to dashboard.
    const token = localStorage.getItem("token");
    if (token) {
        router.replace("/dashboard");
    } else {
        router.replace("/");
    }
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Redirecting...</h1>
    </div>
  );
}
