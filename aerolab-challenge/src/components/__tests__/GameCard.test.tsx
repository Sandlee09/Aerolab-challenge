/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { GameCard } from "../GameCard";
import { Game } from "@/types/game";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, fill, ...restProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...restProps} />;
  },
}));

// Mock the dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
  }),
}));

jest.mock("@/contexts/LoadingContext", () => ({
  useLoading: () => ({
    startNavigationLoading: jest.fn(),
  }),
}));

jest.mock("@/lib/igdb", () => ({
  getImageUrl: jest.fn(
    (imageId: string, size: string) =>
      `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
  ),
}));

jest.mock("@/lib/utils", () => ({
  formatDate: jest.fn((timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US")
  ),
  createSlug: jest.fn((name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  ),
  cn: jest.fn((...classes) => classes.filter(Boolean).join(" ")),
}));

const mockGame: Game = {
  id: 123,
  name: "Test Game",
  summary: "A test game",
  rating: 85,
  rating_count: 1000,
  first_release_date: 1609459200, // 2020-12-31
  cover: {
    id: 1,
    image_id: "test-cover-id",
  },
  platforms: [
    { id: 1, name: "PC" },
    { id: 2, name: "PlayStation" },
  ],
};

const mockGameWithoutCover: Game = {
  id: 456,
  name: "Game Without Cover",
  first_release_date: 1609459200,
};

describe("GameCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders game information correctly", () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toBeInTheDocument();
  });

  it("renders cover image when available", () => {
    render(<GameCard game={mockGame} />);

    const image = screen.getByAltText("Test Game");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://images.igdb.com/igdb/image/upload/t_cover_big/test-cover-id.jpg"
    );
  });

  it("renders placeholder when no cover is available", () => {
    render(<GameCard game={mockGameWithoutCover} />);

    expect(screen.getByText("No cover")).toBeInTheDocument();
    expect(screen.queryByAltText("Game Without Cover")).not.toBeInTheDocument();
  });

  it("shows release date when showReleaseDate is true", () => {
    render(<GameCard game={mockGame} showReleaseDate={true} />);

    expect(screen.getByText("12/31/2020")).toBeInTheDocument();
  });

  it("does not show release date when showReleaseDate is false", () => {
    render(<GameCard game={mockGame} showReleaseDate={false} />);

    expect(screen.queryByText("12/31/2020")).not.toBeInTheDocument();
  });

  it("handles click events correctly", () => {
    render(<GameCard game={mockGame} />);

    const link = screen.getByRole("link");
    fireEvent.click(link);

    // The component should render without errors
    expect(link).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<GameCard game={mockGame} className={customClass} />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass(customClass);
  });

  it("has correct href attribute", () => {
    render(<GameCard game={mockGame} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/game/123/test-game");
  });
});
