import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "../components/mainLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoadingOverlay } from "@/components/GlobalLoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aerolab Challenge - Game Collection",
  description: "Discover and collect your favorite games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LoadingProvider>
            <MainLayout>{children}</MainLayout>
            <GlobalLoadingOverlay />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
