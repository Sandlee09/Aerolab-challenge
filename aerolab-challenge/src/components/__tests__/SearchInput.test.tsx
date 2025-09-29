/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "../SearchInput";
import { searchGames } from "@/lib/igdb";
import { useLoading } from "@/contexts/LoadingContext";

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
jest.mock("@/lib/igdb", () => ({
  searchGames: jest.fn(),
}));

jest.mock("@/contexts/LoadingContext", () => ({
  useLoading: () => ({
    startNavigationLoading: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/utils", () => ({
  debounce: (fn: any) => fn,
  createSlug: (name: string) => name.toLowerCase().replace(/\s+/g, "-"),
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

const mockSearchResults = [
  {
    id: 1,
    name: "Test Game 1",
    cover: { id: 1, image_id: "cover1" },
    first_release_date: 1609459200,
  },
  {
    id: 2,
    name: "Test Game 2",
    cover: { id: 2, image_id: "cover2" },
    first_release_date: 1609545600,
  },
];

describe("SearchInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (searchGames as jest.Mock).mockResolvedValue(mockSearchResults);
  });

  it("renders search input with placeholder", () => {
    render(<SearchInput />);

    expect(
      screen.getByPlaceholderText("Search for games...")
    ).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    render(<SearchInput placeholder="Custom placeholder" />);

    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  it("shows search results when typing", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search for games...");
    await user.type(input, "test");

    await waitFor(() => {
      expect(screen.getByText("Test Game 1")).toBeInTheDocument();
      expect(screen.getByText("Test Game 2")).toBeInTheDocument();
    });
  });

  it("shows loading state while searching", async () => {
    const user = userEvent.setup();
    (searchGames as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockSearchResults), 100)
        )
    );

    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search for games...");
    await user.type(input, "test");

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("shows no results message when no games found", async () => {
    const user = userEvent.setup();
    (searchGames as jest.Mock).mockResolvedValue([]);

    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search for games...");
    await user.type(input, "nonexistent");

    await waitFor(() => {
      expect(
        screen.getByText('No games found for "nonexistent"')
      ).toBeInTheDocument();
    });
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search for games...");
    await user.type(input, "test");

    // Find the clear button by its position (right side of input)
    const buttons = screen.getAllByRole("button");
    const clearButton = buttons.find((button) =>
      button.className.includes("right-3 top-1/2")
    );
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton!);

    expect(input).toHaveValue("");
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SearchInput />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const input = screen.getByPlaceholderText("Search for games...");
    await user.type(input, "test");

    await waitFor(() => {
      expect(screen.getByText("Test Game 1")).toBeInTheDocument();
    });

    const outsideElement = screen.getByTestId("outside");
    await user.click(outsideElement);

    await waitFor(() => {
      expect(screen.queryByText("Test Game 1")).not.toBeInTheDocument();
    });
  });

  it("handles game selection", async () => {
    const user = userEvent.setup();

    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search for games...");
    await user.type(input, "test");

    await waitFor(() => {
      expect(screen.getByText("Test Game 1")).toBeInTheDocument();
    });

    // The game button should be present before clicking
    const gameButton = screen.getByText("Test Game 1");
    expect(gameButton).toBeInTheDocument();

    // Click the game button
    await user.click(gameButton);

    // After clicking, the dropdown should close and the button should no longer be visible
    await waitFor(() => {
      expect(screen.queryByText("Test Game 1")).not.toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<SearchInput className={customClass} />);

    const container = screen
      .getByPlaceholderText("Search for games...")
      .closest("div")?.parentElement;
    expect(container).toHaveClass(customClass);
  });
});
