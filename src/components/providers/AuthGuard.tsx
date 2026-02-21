"use client";

import AuchanLoader from "@/components/ui/render/AuchanLoader";
import { NEED_CONEXION_PAGES } from "@/constants/needConnexionPage";
import { PATHNAME } from "@/constants/pathname.constant";
import { useAuthStore } from "@/store/auth.store";
import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith("/auth");
    const isRootPage = pathname === "/";
    const needsAuth = NEED_CONEXION_PAGES.some((page) =>
      pathname.startsWith(page.path),
    );

    if (isRootPage) {
      router.replace(
        isAuthenticated ? PATHNAME.DASHBOARD.home : PATHNAME.LOGIN,
      );
      return;
    }

    if (needsAuth && !isAuthenticated) {
      router.replace(PATHNAME.LOGIN);
      return;
    }

    if (isAuthPage && isAuthenticated) {
      router.replace(PATHNAME.DASHBOARD.home);
    }
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
