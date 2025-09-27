"use client";

import Link from 'next/link';
import { SearchInput } from './SearchInput';
import { SearchResult } from '@/types/game';
import { useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils';

interface HeaderProps {
  showSearch?: boolean;
  onGameSelect?: (game: SearchResult) => void;
}

export function Header({ showSearch = true, onGameSelect }: HeaderProps) {
  const router = useRouter();

  const handleGameSelect = (game: SearchResult) => {
    if (onGameSelect) {
      onGameSelect(game);
    } else {
      // Navigate to game detail page using the same slug function
      const slug = createSlug(game.name);
      router.push(`/game/${game.id}/${slug}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Aerolab</span>
          </Link>

          {/* Search */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-8">
              <SearchInput onGameSelect={handleGameSelect} />
            </div>
          )}

          {/* Right side - could add user menu here */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Collection
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
