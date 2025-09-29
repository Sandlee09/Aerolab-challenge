import { useState, useEffect, useCallback } from "react";
import { Game, GameCollection } from "@/types/game";
import {
  getStoredCollection,
  addGameToCollection,
  removeGameFromCollection,
  getCollectionArray,
  getCollectionCount,
} from "@/lib/storage";

export function useGameCollection() {
  const [collection, setCollection] = useState<GameCollection>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    const storedCollection = getStoredCollection();

    // Add timestamps to existing games that don't have them
    const migratedCollection: GameCollection = {};
    let hasChanges = false;

    Object.entries(storedCollection).forEach(([gameId, game], index) => {
      if (!game.dateAdded) {
        // Add timestamp based on order in collection (older games get earlier timestamps)
        const timestamp =
          Date.now() - (Object.keys(storedCollection).length - index) * 1000;
        migratedCollection[parseInt(gameId as string)] = {
          ...game,
          dateAdded: timestamp,
        };
        hasChanges = true;
      } else {
        migratedCollection[parseInt(gameId as string)] = game;
      }
    });

    if (hasChanges) {
      // Save migrated collection
      localStorage.setItem(
        "aerolab-game-collection",
        JSON.stringify(migratedCollection)
      );
      setCollection(migratedCollection);
    } else {
      setCollection(storedCollection);
    }

    setIsLoading(false);
  }, []);

  // Add game to collection
  const addGame = useCallback(
    (game: Game) => {
      if (!isClient) return;
      const gameWithTimestamp = {
        ...game,
        dateAdded: Date.now(), // Add timestamp when game is added
      };
      addGameToCollection(gameWithTimestamp);
      setCollection((prev) => ({ ...prev, [game.id]: gameWithTimestamp }));
    },
    [isClient]
  );

  // Remove game from collection
  const removeGame = useCallback(
    (gameId: number) => {
      if (!isClient) return;
      removeGameFromCollection(gameId);
      setCollection((prev) => {
        const newCollection = { ...prev };
        delete newCollection[gameId];
        return newCollection;
      });
    },
    [isClient]
  );

  // Check if game is in collection
  const isInCollection = useCallback(
    (gameId: number) => {
      if (!isClient) return false;
      return gameId in collection;
    },
    [collection, isClient]
  );

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
  const getSortedCollection = useCallback(
    (sortBy: "dateAdded" | "releaseDate" = "dateAdded") => {
      if (!isClient) return [];
      const games = getCollectionArray();

      if (sortBy === "releaseDate") {
        return games.sort((a, b) => {
          const dateA = a.first_release_date || 0;
          const dateB = b.first_release_date || 0;
          return dateB - dateA; // Newest first
        });
      }

      // Sort by date added (oldest first - chronological order)
      return games.sort((a, b) => {
        const dateA =
          typeof a.dateAdded === "number"
            ? a.dateAdded
            : typeof a.dateAdded === "string"
            ? parseInt(a.dateAdded)
            : 0;
        const dateB =
          typeof b.dateAdded === "number"
            ? b.dateAdded
            : typeof b.dateAdded === "string"
            ? parseInt(b.dateAdded)
            : 0;
        return dateA - dateB; // Oldest added first
      });
    },
    [isClient]
  );

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
