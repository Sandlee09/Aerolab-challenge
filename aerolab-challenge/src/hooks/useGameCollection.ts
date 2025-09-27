import { useState, useEffect, useCallback } from 'react';
import { Game, GameCollection } from '@/types/game';
import { 
  getStoredCollection, 
  addGameToCollection, 
  removeGameFromCollection,
  getCollectionArray,
  getCollectionCount
} from '@/lib/storage';

export function useGameCollection() {
  const [collection, setCollection] = useState<GameCollection>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    const storedCollection = getStoredCollection();
    setCollection(storedCollection);
    setIsLoading(false);
  }, []);

  // Add game to collection
  const addGame = useCallback((game: Game) => {
    if (!isClient) return;
    addGameToCollection(game);
    setCollection(prev => ({ ...prev, [game.id]: game }));
  }, [isClient]);

  // Remove game from collection
  const removeGame = useCallback((gameId: number) => {
    if (!isClient) return;
    removeGameFromCollection(gameId);
    setCollection(prev => {
      const newCollection = { ...prev };
      delete newCollection[gameId];
      return newCollection;
    });
  }, [isClient]);

  // Check if game is in collection
  const isInCollection = useCallback((gameId: number) => {
    if (!isClient) return false;
    return gameId in collection;
  }, [collection, isClient]);

  // Get collection as array
  const getCollection = useCallback(() => {
    if (!isClient) return [];
    return getCollectionArray();
  }, [isClient]);

  // Get collection count
  const getCount = useCallback(() => {
    if (!isClient) return 0;
    return getCollectionCount();
  }, [isClient]);

  // Sort collection
  const getSortedCollection = useCallback((sortBy: 'dateAdded' | 'releaseDate' = 'dateAdded') => {
    if (!isClient) return [];
    const games = getCollectionArray();
    
    if (sortBy === 'releaseDate') {
      return games.sort((a, b) => {
        const dateA = a.first_release_date || 0;
        const dateB = b.first_release_date || 0;
        return dateB - dateA; // Newest first
      });
    }
    
    // Default: sort by date added (most recent first)
    return games.sort((a, b) => b.id - a.id);
  }, [isClient]);

  return {
    collection,
    isLoading,
    isClient,
    addGame,
    removeGame,
    isInCollection,
    getCollection,
    getCount,
    getSortedCollection,
  };
}
