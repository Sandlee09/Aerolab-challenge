"use client";

import { useState } from 'react';
import { GameCard } from './GameCard';
import { useGameCollection } from '@/hooks/useGameCollection';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionGridProps {
  className?: string;
}

export function CollectionGrid({ className }: CollectionGridProps) {
  const { getSortedCollection, removeGame, isLoading, isClient } = useGameCollection();
  const [sortBy, setSortBy] = useState<'dateAdded' | 'releaseDate'>('dateAdded');
  const [showRemoveButtons, setShowRemoveButtons] = useState(false);

  // Don't render anything until we're on the client side
  if (!isClient) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const games = getSortedCollection(sortBy);

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Plus className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No games in your collection</h3>
        <p className="text-gray-500 mb-6">
          Start building your collection by searching for games and adding them to your library.
        </p>
        <div className="text-sm text-gray-400">
          Use the search bar above to find games you love!
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Collection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Collection</h2>
          <p className="text-gray-600">{games.length} game{games.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Options */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSortBy('dateAdded')}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                sortBy === 'dateAdded'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Date Added
            </button>
            <button
              onClick={() => setSortBy('releaseDate')}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                sortBy === 'releaseDate'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Release Date
            </button>
          </div>

          {/* Remove Toggle */}
          <button
            onClick={() => setShowRemoveButtons(!showRemoveButtons)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showRemoveButtons
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
            title={showRemoveButtons ? 'Hide remove buttons' : 'Show remove buttons'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {games.map((game) => (
          <div key={game.id} className="relative group">
            <GameCard game={game} showReleaseDate={sortBy === 'releaseDate'} />
            
            {/* Remove Button */}
            {showRemoveButtons && (
              <button
                onClick={() => removeGame(game.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove from collection"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
