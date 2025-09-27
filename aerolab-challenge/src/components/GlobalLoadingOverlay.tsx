"use client";

import { useLoading } from "@/contexts/LoadingContext";

export function GlobalLoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="text-theme font-medium">{loadingMessage}</p>
      </div>
    </div>
  );
}
