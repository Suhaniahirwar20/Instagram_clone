"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

const publicRoutes = ["/login", "/signup"];

export default function AuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore(
    (state) => state.isInitialized
  );

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user && !isPublicRoute) {
      router.replace("/login");
    } else if (user && isPublicRoute) {
      router.replace("/");
    }
  }, [user, isInitialized, isPublicRoute, router]);

  // Wait until authentication initialization finishes
  if (!isInitialized) {
    return <div>Checking authentication...</div>;
  }

  // Don't display pages while redirecting
  if (!user && !isPublicRoute) {
    return null;
  }

  if (user && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}