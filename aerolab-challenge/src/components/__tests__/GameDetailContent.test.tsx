/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { GameDetailContent } from "../GameDetailContent";
import { useGameCollection } from "@/hooks/useGameCollection";
import { Game, SearchResult } from "@/types/game";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, fill, ...restProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...restProps} />;
  },
}));

// Mock dependencies
jest.mock("@/hooks/useGameCollection");
jest.mock("../GameCard", () => ({
  GameCard: ({ game }: { game: SearchResult }) => (
    <div data-testid={`similar-game-${game.id}`}>{game.name}</div>
  ),
}));

jest.mock("../ImageGallery", () => ({
  ImageGallery: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => (isOpen ? <div data-testid="image-gallery">Gallery</div> : null),
}));

jest.mock("@/lib/igdb", () => ({
  getImageUrl: jest.fn(
    (imageId: string, size: string) =>
      `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
  ),
}));

jest.mock("@/lib/utils", () => ({
  formatDate: jest.fn((timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString()
  ),
  getYearsAgo: jest.fn((timestamp: number) => 3),
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

const mockGame: Game = {
  id: 123,
  name: "Test Game",
  summary: "A test game summary",
  rating: 85,
  rating_count: 1000,
  first_release_date: 1609459200,
  cover: { id: 1, image_id: "cover1" },
  screenshots: [
    { id: 1, image_id: "screenshot1" },
    { id: 2, image_id: "screenshot2" },
  ],
  platforms: [
    { id: 1, name: "PC" },
    { id: 2, name: "PlayStation" },
  ],
};

const mockSimilarGames: SearchResult[] = [
  { id: 1, name: "Similar Game 1" },
  { id: 2, name: "Similar Game 2" },
];

describe("GameDetailContent", () => {
  const mockUseGameCollection = useGameCollection as jest.MockedFunction<
    typeof useGameCollection
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGameCollection.mockReturnValue({
      addGame: jest.fn(),
      removeGame: jest.fn(),
      isInCollection: jest.fn().mockReturnValue(false),
      isClient: true,
    } as any);
  });

  it("renders game information correctly", () => {
    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("A test game summary")).toBeInTheDocument();
    expect(screen.getByText("PC")).toBeInTheDocument();
    expect(screen.getByText("PlayStation")).toBeInTheDocument();
  });

  it("renders cover image when available", () => {
    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    const image = screen.getByAltText("Test Game");
    expect(image).toBeInTheDocument();
    // Check that the image has a src attribute (the exact URL format may vary)
    expect(image).toHaveAttribute("src");
  });

  it("renders placeholder when no cover", () => {
    const gameWithoutCover = { ...mockGame, cover: undefined };
    render(
      <GameDetailContent
        game={gameWithoutCover}
        similarGames={mockSimilarGames}
      />
    );

    expect(screen.queryByAltText("Test Game")).not.toBeInTheDocument();
  });

  it("shows rating information when available", () => {
    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("(1,000 ratings)")).toBeInTheDocument();
  });

  it("adds game to collection when not collected", () => {
    const mockAddGame = jest.fn();
    mockUseGameCollection.mockReturnValue({
      addGame: mockAddGame,
      removeGame: jest.fn(),
      isInCollection: jest.fn().mockReturnValue(false),
      isClient: true,
    } as any);

    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    const addButton = screen.getByTitle("Add to collection");
    fireEvent.click(addButton);

    expect(mockAddGame).toHaveBeenCalledWith(mockGame);
    expect(screen.getByText("Added to collection")).toBeInTheDocument();
  });

  it("removes game from collection when collected", () => {
    const mockRemoveGame = jest.fn();
    mockUseGameCollection.mockReturnValue({
      addGame: jest.fn(),
      removeGame: mockRemoveGame,
      isInCollection: jest.fn().mockReturnValue(true),
      isClient: true,
    } as any);

    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    const removeButton = screen.getByTitle("Remove from collection");
    fireEvent.click(removeButton);

    expect(mockRemoveGame).toHaveBeenCalledWith(mockGame.id);
    expect(screen.getByText("Removed from collection")).toBeInTheDocument();
  });

  it("renders screenshots when available", () => {
    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    expect(screen.getByText("Screenshots")).toBeInTheDocument();
    expect(screen.getByAltText("Test Game screenshot 1")).toBeInTheDocument();
    expect(screen.getByAltText("Test Game screenshot 2")).toBeInTheDocument();
  });

  it("opens image gallery when screenshot is clicked", () => {
    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    const screenshot = screen.getByAltText("Test Game screenshot 1");
    fireEvent.click(screenshot);

    expect(screen.getByTestId("image-gallery")).toBeInTheDocument();
  });

  it("renders similar games when available", () => {
    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    expect(screen.getByText("Similar Games")).toBeInTheDocument();
    expect(screen.getByTestId("similar-game-1")).toBeInTheDocument();
    expect(screen.getByTestId("similar-game-2")).toBeInTheDocument();
  });

  it("does not render screenshots section when no screenshots", () => {
    const gameWithoutScreenshots = { ...mockGame, screenshots: [] };
    render(
      <GameDetailContent
        game={gameWithoutScreenshots}
        similarGames={mockSimilarGames}
      />
    );

    expect(screen.queryByText("Screenshots")).not.toBeInTheDocument();
  });

  it("does not render similar games section when no similar games", () => {
    render(<GameDetailContent game={mockGame} similarGames={[]} />);

    expect(screen.queryByText("Similar Games")).not.toBeInTheDocument();
  });

  it("hides notification after timeout", async () => {
    jest.useFakeTimers();

    render(
      <GameDetailContent game={mockGame} similarGames={mockSimilarGames} />
    );

    const addButton = screen.getByTitle("Add to collection");
    fireEvent.click(addButton);

    expect(screen.getByText("Added to collection")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.queryByText("Added to collection")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
