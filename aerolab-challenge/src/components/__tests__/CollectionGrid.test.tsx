/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { CollectionGrid } from "../CollectionGrid";
import { useGameCollection } from "@/hooks/useGameCollection";
import { Game } from "@/types/game";

// Mock the hook
jest.mock("@/hooks/useGameCollection");
const mockUseGameCollection = useGameCollection as jest.MockedFunction<
  typeof useGameCollection
>;

// Mock GameCard component
jest.mock("../GameCard", () => ({
  GameCard: ({
    game,
    showReleaseDate,
  }: {
    game: Game;
    showReleaseDate?: boolean;
  }) => (
    <div data-testid={`game-card-${game.id}`}>
      {game.name} {showReleaseDate && "(with date)"}
    </div>
  ),
}));

const mockGames: Game[] = [
  {
    id: 1,
    name: "Game 1",
    first_release_date: 1609459200,
    dateAdded: Date.now() - 1000,
  },
  {
    id: 2,
    name: "Game 2",
    first_release_date: 1609545600,
    dateAdded: Date.now() - 2000,
  },
];

describe("CollectionGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when not on client", () => {
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue([]),
      removeGame: jest.fn(),
      isLoading: false,
      isClient: false,
    } as any);

    render(<CollectionGrid />);

    // Check for loading spinner by its class instead of role
    const loadingSpinner = document.querySelector(".animate-spin");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("renders loading state when loading", () => {
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue([]),
      removeGame: jest.fn(),
      isLoading: true,
      isClient: true,
    } as any);

    render(<CollectionGrid />);

    // Check for loading spinner by its class instead of role
    const loadingSpinner = document.querySelector(".animate-spin");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("renders empty state when no games", () => {
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue([]),
      removeGame: jest.fn(),
      isLoading: false,
      isClient: true,
    } as any);

    render(<CollectionGrid />);

    expect(screen.getByText("No games in your collection")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Start building your collection by searching for games and adding them to your library."
      )
    ).toBeInTheDocument();
  });

  it("renders games when collection has items", () => {
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue(mockGames),
      removeGame: jest.fn(),
      isLoading: false,
      isClient: true,
    } as any);

    render(<CollectionGrid />);

    expect(screen.getByText("Your Collection")).toBeInTheDocument();
    expect(screen.getByText("2 games")).toBeInTheDocument();
    expect(screen.getByTestId("game-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("game-card-2")).toBeInTheDocument();
  });

  it("shows release date when sorted by release date", () => {
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue(mockGames),
      removeGame: jest.fn(),
      isLoading: false,
      isClient: true,
    } as any);

    render(<CollectionGrid />);

    const releaseDateButton = screen.getByText("Release Date");
    fireEvent.click(releaseDateButton);

    expect(screen.getByTestId("game-card-1")).toHaveTextContent("(with date)");
  });

  it("toggles remove buttons visibility", () => {
    const mockRemoveGame = jest.fn();
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue(mockGames),
      removeGame: mockRemoveGame,
      isLoading: false,
      isClient: true,
    } as any);

    render(<CollectionGrid />);

    const removeButton = screen.getByTitle("Show remove buttons");
    fireEvent.click(removeButton);

    expect(screen.getByTitle("Hide remove buttons")).toBeInTheDocument();
  });

  it("calls removeGame when remove button is clicked", () => {
    const mockRemoveGame = jest.fn();
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue(mockGames),
      removeGame: mockRemoveGame,
      isLoading: false,
      isClient: true,
    } as any);

    render(<CollectionGrid />);

    // Show remove buttons
    const toggleButton = screen.getByTitle("Show remove buttons");
    fireEvent.click(toggleButton);

    // Click remove button (assuming it appears)
    const removeButtons = screen.getAllByTitle("Remove from collection");
    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
      expect(mockRemoveGame).toHaveBeenCalledWith(1);
    }
  });

  it("applies custom className", () => {
    mockUseGameCollection.mockReturnValue({
      getSortedCollection: jest.fn().mockReturnValue([]),
      removeGame: jest.fn(),
      isLoading: false,
      isClient: true,
    } as any);

    const customClass = "custom-class";
    render(<CollectionGrid className={customClass} />);

    const container = screen
      .getByText("No games in your collection")
      .closest("div");
    expect(container).toHaveClass(customClass);
  });
});
