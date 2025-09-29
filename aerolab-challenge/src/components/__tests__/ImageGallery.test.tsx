/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageGallery } from "../ImageGallery";

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("@/lib/igdb", () => ({
  getImageUrl: jest.fn(
    (imageId: string, size: string) =>
      `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
  ),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

const mockImages = [
  { id: 1, image_id: "img1" },
  { id: 2, image_id: "img2" },
  { id: 3, image_id: "img3" },
];

describe("ImageGallery", () => {
  const defaultProps = {
    images: mockImages,
    gameName: "Test Game",
    isOpen: true,
    onClose: jest.fn(),
    initialIndex: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open", () => {
    render(<ImageGallery {...defaultProps} />);

    expect(screen.getByAltText("Test Game screenshot 1")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<ImageGallery {...defaultProps} isOpen={false} />);

    expect(
      screen.queryByAltText("Test Game screenshot 1")
    ).not.toBeInTheDocument();
  });

  it("does not render when no images", () => {
    render(<ImageGallery {...defaultProps} images={[]} />);

    expect(
      screen.queryByAltText("Test Game screenshot 1")
    ).not.toBeInTheDocument();
  });

  it("closes when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(<ImageGallery {...defaultProps} onClose={mockOnClose} />);

    // Find the close button by its position (top-right)
    const buttons = screen.getAllByRole("button");
    const closeButton = buttons.find((button) =>
      button.className.includes("top-4 right-4")
    );
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("navigates to next image", () => {
    render(<ImageGallery {...defaultProps} />);

    // Find the next button by its position (right side)
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons.find((button) =>
      button.className.includes("right-4 top-1/2")
    );
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton!);

    expect(screen.getByAltText("Test Game screenshot 2")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates to previous image", () => {
    render(<ImageGallery {...defaultProps} initialIndex={1} />);

    // Find the previous button by its position (left side)
    const buttons = screen.getAllByRole("button");
    const prevButton = buttons.find((button) =>
      button.className.includes("left-4 top-1/2")
    );
    expect(prevButton).toBeInTheDocument();
    fireEvent.click(prevButton!);

    expect(screen.getByAltText("Test Game screenshot 1")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("wraps around from last to first image", () => {
    render(<ImageGallery {...defaultProps} initialIndex={2} />);

    // Find the next button by its position (right side)
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons.find((button) =>
      button.className.includes("right-4 top-1/2")
    );
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton!);

    expect(screen.getByAltText("Test Game screenshot 1")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("wraps around from first to last image", () => {
    render(<ImageGallery {...defaultProps} initialIndex={0} />);

    // Find the previous button by its position (left side)
    const buttons = screen.getAllByRole("button");
    const prevButton = buttons.find((button) =>
      button.className.includes("left-4 top-1/2")
    );
    expect(prevButton).toBeInTheDocument();
    fireEvent.click(prevButton!);

    expect(screen.getByAltText("Test Game screenshot 3")).toBeInTheDocument();
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    const mockOnClose = jest.fn();
    render(<ImageGallery {...defaultProps} onClose={mockOnClose} />);

    // Test right arrow
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByAltText("Test Game screenshot 2")).toBeInTheDocument();

    // Test left arrow
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByAltText("Test Game screenshot 1")).toBeInTheDocument();

    // Test escape
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows correct image counter", () => {
    render(<ImageGallery {...defaultProps} initialIndex={1} />);

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("shows mobile indicators", () => {
    render(<ImageGallery {...defaultProps} />);

    // Check for the mobile indicators container
    const indicatorsContainer = screen
      .getByText("1 / 3")
      .parentElement?.parentElement?.querySelector(".md\\:hidden");
    expect(indicatorsContainer).toBeInTheDocument();

    // Check for individual indicators
    const indicators = indicatorsContainer?.querySelectorAll(
      ".w-2.h-2.rounded-full"
    );
    expect(indicators).toHaveLength(3);
  });
});
