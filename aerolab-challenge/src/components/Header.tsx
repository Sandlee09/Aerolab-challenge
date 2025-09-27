"use client";

import Link from "next/link";
import { SearchInput } from "./SearchInput";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Aerolab
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <SearchInput />
            </div>

            {/* Right side - Theme toggle and navigation */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                Collection
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="flex-1 my-2 mx-2 block md:hidden">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
