"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileState } from "@/hooks/use-study";
import { PageSkeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const { profile, loaded } = useProfileState();

  useEffect(() => {
    if (!loaded) return;
    router.replace(profile ? "/today" : "/welcome");
  }, [loaded, profile, router]);

  return (
    <div className="mx-auto w-full max-w-[460px] bg-bg">
      <PageSkeleton />
    </div>
  );
}
