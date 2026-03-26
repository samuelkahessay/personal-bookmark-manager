import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

jest.mock("@/lib/storage", () => ({
  loadBookmarks: jest.fn(() => []),
  saveBookmarks: jest.fn(),
}));

describe("App shell", () => {
  it("renders the bookmark manager page", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the Bookmark Manager heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /bookmark manager/i })).toBeInTheDocument();
  });

  it("renders the add bookmark form", () => {
    render(<Home />);
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("renders the search bar", () => {
    render(<Home />);
    expect(screen.getByLabelText(/search bookmarks/i)).toBeInTheDocument();
  });

  it("renders empty state message when no bookmarks", () => {
    render(<Home />);
    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
  });
});
