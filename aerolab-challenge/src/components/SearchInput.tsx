"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { SearchResult } from "@/types/game";
import { searchGames } from "@/lib/igdb";
import { createSlug, debounce } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  onGameSelect?: (game: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search for games...",
  className,
}: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search function with abort controller for cancellation
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      try {
        const searchResults = await searchGames(searchQuery, 10);
        // Only update results if the request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setResults(searchResults);
        }
      } catch (error) {
        // Don't log aborted requests as errors
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error);
        }
        if (!abortControllerRef.current?.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 500),
    [setResults, setIsLoading]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setResults([]);
      setIsLoading(false);
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  };

  // Handle game selection
  const handleGameSelect = (game: SearchResult) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const slug = createSlug(game.name);
    router.push(`/game/${game.id}/${slug}`);
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-theme placeholder-gray-500 dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query || results.length > 0) && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  {game.cover && (
                    <Image
                      src={`https://images.igdb.com/igdb/image/upload/t_thumb/${game.cover.image_id}.jpg`}
                      alt={game.name}
                      width={48}
                      height={64}
                      className="object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-theme truncate">
                      {game.name}
                    </p>
                    {game.first_release_date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(game.first_release_date * 1000).getFullYear()}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No games found for &quot;{query}&quot;</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
