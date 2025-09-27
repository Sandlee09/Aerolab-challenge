import { Game, GameCollection } from '@/types/game';

const COLLECTION_KEY = 'aerolab-game-collection';

export function getStoredCollection(): GameCollection {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(COLLECTION_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading collection from storage:', error);
    return {};
  }
}

export function saveCollection(collection: GameCollection): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Error saving collection to storage:', error);
  }
}

export function addGameToCollection(game: Game): void {
  const collection = getStoredCollection();
  collection[game.id] = game;
  saveCollection(collection);
}

export function removeGameFromCollection(gameId: number): void {
  const collection = getStoredCollection();
  delete collection[gameId];
  saveCollection(collection);
}

export function isGameInCollection(gameId: number): boolean {
  const collection = getStoredCollection();
  return gameId in collection;
}

export function getCollectionArray(): Game[] {
  const collection = getStoredCollection();
  return Object.values(collection);
}

export function getCollectionCount(): number {
  return getCollectionArray().length;
}
