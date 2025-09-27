"use client";

import { Header } from "@/components/Header";
import { useTheme } from "next-themes";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark light-text" : "light dark-text"
      } transition-colors duration-200`}
    >
      <Header />
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
