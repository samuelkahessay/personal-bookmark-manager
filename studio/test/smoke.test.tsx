import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
let uuidCounter = 0;
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: () => `test-uuid-${++uuidCounter}` },
});

beforeEach(() => {
  localStorageMock.clear();
  uuidCounter = 0;
});

describe("Home page (integration)", () => {
  it("renders the bookmark manager heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /personal bookmark manager/i })).toBeInTheDocument();
  });

  it("renders the add bookmark form", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /add bookmark/i })).toBeInTheDocument();
  });

  it("renders the search bar", () => {
    render(<Home />);
    expect(screen.getByLabelText(/search bookmarks/i)).toBeInTheDocument();
  });

  it("shows empty state message when no bookmarks", () => {
    render(<Home />);
    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
  });

  it("adds a bookmark and displays it", async () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Example" } });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));
    expect(await screen.findByText("Example")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
  });

  it("saves bookmarks to localStorage after adding", async () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Example" } });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));
    await screen.findByText("Example");
    const stored = JSON.parse(localStorageMock.getItem("bookmarks") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("Example");
  });

  it("deletes a bookmark", async () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "To Delete" } });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));
    await screen.findByText("To Delete");
    fireEvent.click(screen.getByRole("button", { name: /delete to delete/i }));
    await waitFor(() => expect(screen.queryByText("To Delete")).not.toBeInTheDocument());
  });

  it("filters bookmarks by search query", async () => {
    render(<Home />);
    // Add two bookmarks
    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: "https://a.com" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Alpha Site" } });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));
    await screen.findByText("Alpha Site");

    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: "https://b.com" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Beta Site" } });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));
    await screen.findByText("Beta Site");

    // Search for alpha
    fireEvent.change(screen.getByLabelText(/search bookmarks/i), { target: { value: "alpha" } });
    expect(screen.getByText("Alpha Site")).toBeInTheDocument();
    expect(screen.queryByText("Beta Site")).not.toBeInTheDocument();
  });
});
