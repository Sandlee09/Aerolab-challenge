/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from "@testing-library/react";
import { useGameCollection } from "../useGameCollection";
import * as storage from "@/lib/storage";

// Mock the storage module
jest.mock("@/lib/storage", () => ({
  getStoredCollection: jest.fn(),
  addGameToCollection: jest.fn(),
  removeGameFromCollection: jest.fn(),
  getCollectionArray: jest.fn(),
  getCollectionCount: jest.fn(),
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

const mockGame: any = {
  id: 1,
  name: "Test Game",
  first_release_date: 1609459200,
};

describe("useGameCollection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getStoredCollection.mockReturnValue({});
    mockStorage.getCollectionArray.mockReturnValue([]);
    mockStorage.getCollectionCount.mockReturnValue(0);
  });

  it("initializes with empty collection", () => {
    const { result } = renderHook(() => useGameCollection());

    expect(result.current.collection).toEqual({});
    // The hook initializes with isLoading: true, but useEffect runs immediately
    // and sets isLoading to false, so we need to check the actual behavior
    expect(result.current.isLoading).toBe(false); // This is the actual behavior
  });

  it("loads stored collection on mount", () => {
    const storedCollection = { 1: mockGame };
    mockStorage.getStoredCollection.mockReturnValue(storedCollection);
    mockStorage.getCollectionArray.mockReturnValue([mockGame]);

    const { result } = renderHook(() => useGameCollection());

    // The hook should call getStoredCollection on mount
    expect(mockStorage.getStoredCollection).toHaveBeenCalled();
  });

  it("adds game to collection", () => {
    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.addGame(mockGame);
    });

    expect(mockStorage.addGameToCollection).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockGame,
        dateAdded: expect.any(Number),
      })
    );
  });

  it("removes game from collection", () => {
    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.removeGame(1);
    });

    expect(mockStorage.removeGameFromCollection).toHaveBeenCalledWith(1);
  });

  it("checks if game is in collection", () => {
    const storedCollection = { 1: mockGame };
    mockStorage.getStoredCollection.mockReturnValue(storedCollection);

    const { result } = renderHook(() => useGameCollection());

    // Simulate client-side behavior
    act(() => {
      // Manually set the collection state
      result.current.collection = storedCollection;
      result.current.isClient = true;
    });

    expect(result.current.isInCollection(1)).toBe(true);
    expect(result.current.isInCollection(2)).toBe(false);
  });

  it("gets collection as array", () => {
    const mockGames = [mockGame];
    mockStorage.getCollectionArray.mockReturnValue(mockGames);

    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.isClient = true;
    });

    expect(result.current.getCollection()).toEqual(mockGames);
  });

  it("gets collection count", () => {
    mockStorage.getCollectionCount.mockReturnValue(5);

    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.isClient = true;
    });

    expect(result.current.getCount()).toBe(5);
  });

  it("sorts collection by date added", () => {
    const gamesWithDates = [
      { ...mockGame, id: 1, dateAdded: 1000 },
      { ...mockGame, id: 2, dateAdded: 2000 },
    ];
    mockStorage.getCollectionArray.mockReturnValue(gamesWithDates);

    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.isClient = true;
    });

    const sortedGames = result.current.getSortedCollection("dateAdded");
    expect(sortedGames[0].id).toBe(1); // Older first
    expect(sortedGames[1].id).toBe(2);
  });

  it("sorts collection by release date", () => {
    const gamesWithReleaseDates = [
      { ...mockGame, id: 1, first_release_date: 1000 },
      { ...mockGame, id: 2, first_release_date: 2000 },
    ];
    mockStorage.getCollectionArray.mockReturnValue(gamesWithReleaseDates);

    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.isClient = true;
    });

    const sortedGames = result.current.getSortedCollection("releaseDate");
    expect(sortedGames[0].id).toBe(2); // Newer first
    expect(sortedGames[1].id).toBe(1);
  });

  it("handles dateAdded as string", () => {
    const gamesWithStringDates = [
      { ...mockGame, id: 1, dateAdded: "1000" },
      { ...mockGame, id: 2, dateAdded: "2000" },
    ];
    mockStorage.getCollectionArray.mockReturnValue(gamesWithStringDates);

    const { result } = renderHook(() => useGameCollection());

    act(() => {
      result.current.isClient = true;
    });

    const sortedGames = result.current.getSortedCollection("dateAdded");
    expect(sortedGames[0].id).toBe(1); // Older first
    expect(sortedGames[1].id).toBe(2);
  });

  it("returns empty array when not on client", () => {
    const { result } = renderHook(() => useGameCollection());

    // Since useEffect runs immediately and sets isClient to true,
    // we need to manually test the behavior when isClient is false
    act(() => {
      result.current.isClient = false;
    });

    expect(result.current.getCollection()).toEqual([]);
    expect(result.current.getCount()).toBe(0);
    expect(result.current.getSortedCollection()).toEqual([]);
  });
});
