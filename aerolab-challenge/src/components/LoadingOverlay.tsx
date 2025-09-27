"use client";

import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  message = "Loading...", 
  className 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
      className
    )}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="text-theme font-medium">{message}</p>
      </div>
    </div>
  );
}
