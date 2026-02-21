import { DialogProvider } from "@/components/dialog_system";
import { QueryProvider } from "@/components/providers/QueryProvider";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asernum - Auchan Super Admin",
  description: "Plateforme de gestion des magasins Auchan",
  creator: "Asernum - Charles Désiré Bally",
  keywords: ["Asernum", "Auchan", "Super Admin", "Admin", "Dashboard", "Admin Dashboard", "Asernum Auchan", "Asernum Auchan Super Admin", "Asernum Auchan Admin", "Asernum Auchan Dashboard", "Asernum Auchan Admin Dashboard"],
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#ffffff",
};

const sanaSans = localFont({
  src: [
    { path: "../fonts/sana-sans-alt-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/sana-sans-alt-medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/sana-sans-alt-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/sana-sans-alt-black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sana-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${sanaSans.variable} antialiased`}>
        <QueryProvider>
          {children}
          <DialogProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
