"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Reset loading when pathname changes (navigation completed)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const startLoading = () => {
    setIsLoading(true);
  };

  return {
    isLoading,
    startLoading,
    setIsLoading
  };
}
