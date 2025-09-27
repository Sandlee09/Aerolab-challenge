"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  startNavigationLoading: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const { isLoading: isNavigationLoading, startLoading } = useNavigationLoading();

  // Combine manual loading and navigation loading
  const isLoading = isManualLoading || isNavigationLoading;

  const setLoading = (loading: boolean, message: string = "Loading...") => {
    setIsManualLoading(loading);
    if (loading) {
      setLoadingMessage(message);
    }
  };

  const startNavigationLoading = (message: string = "Loading...") => {
    setLoadingMessage(message);
    startLoading();
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      loadingMessage, 
      setLoading,
      startNavigationLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
