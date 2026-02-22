"use client";

import AuchanLoader from "@/components/ui/render/AuchanLoader";
import { NEED_CONEXION_PAGES } from "@/constants/needConnexionPage";
import { PATHNAME } from "@/constants/pathname.constant";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/store/auth.store";
import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useProfile();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fallbackTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith("/auth");
    const isRootPage = pathname === "/";
    const needsAuth = NEED_CONEXION_PAGES.some((page) =>
      pathname.startsWith(page.path),
    );

    let targetUrl: string | null = null;

    if (isRootPage) {
      targetUrl = isAuthenticated ? PATHNAME.DASHBOARD.home : PATHNAME.LOGIN;
    } else if (needsAuth && !isAuthenticated) {
      targetUrl = PATHNAME.LOGIN;
    } else if (isAuthPage && isAuthenticated) {
      targetUrl = PATHNAME.DASHBOARD.home;
    }

    if (targetUrl) {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      router.replace(targetUrl);
      const url = targetUrl;
      fallbackTimer.current = setTimeout(() => {
        window.location.replace(url);
      }, 2000);
    }

    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, [isAuthenticated, isLoading, pathname, router]);

  const isAuthPage = pathname.startsWith("/auth");
  const isRootPage = pathname === "/";
  const needsAuth = NEED_CONEXION_PAGES.some((page) =>
    pathname.startsWith(page.path),
  );

  const showLoader =
    isLoading ||
    isRootPage ||
    (needsAuth && !isAuthenticated) ||
    (isAuthPage && isAuthenticated);

  return (
    <>
      <AnimatePresence>
        {showLoader && <AuchanLoader key="auchan-loader" />}
      </AnimatePresence>
      {!showLoader && children}
    </>
  );
}
