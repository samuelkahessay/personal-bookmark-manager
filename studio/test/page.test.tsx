import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";
import { loadBookmarks, saveBookmarks } from "@/lib/storage";

jest.mock("@/lib/storage", () => ({
  loadBookmarks: jest.fn(() => []),
  saveBookmarks: jest.fn(),
}));

const mockLoadBookmarks = loadBookmarks as jest.MockedFunction<typeof loadBookmarks>;
const mockSaveBookmarks = saveBookmarks as jest.MockedFunction<typeof saveBookmarks>;

const sampleBookmark = {
  id: "test-id-1",
  url: "https://example.com",
  title: "Example Site",
  tags: ["test", "example"],
  createdAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  mockLoadBookmarks.mockReturnValue([]);
  mockSaveBookmarks.mockClear();
});

describe("Home page integration", () => {
  it("loads bookmarks from localStorage on mount", () => {
    mockLoadBookmarks.mockReturnValueOnce([sampleBookmark]);
    render(<Home />);
    expect(screen.getByText("Example Site")).toBeInTheDocument();
  });

  it("adds a bookmark via the form and saves to localStorage", async () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/^url$/i), {
      target: { value: "https://github.com" },
    });
    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "GitHub" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));

    await waitFor(() => {
      expect(screen.getByText("GitHub")).toBeInTheDocument();
    });
    expect(mockSaveBookmarks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ url: "https://github.com", title: "GitHub" }),
      ])
    );
  });

  it("deletes a bookmark and saves updated list to localStorage", async () => {
    mockLoadBookmarks.mockReturnValueOnce([sampleBookmark]);
    render(<Home />);
    expect(screen.getByText("Example Site")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete example site/i }));

    await waitFor(() => {
      expect(screen.queryByText("Example Site")).not.toBeInTheDocument();
    });
    expect(mockSaveBookmarks).toHaveBeenCalledWith([]);
  });

  it("filters bookmarks via search bar", async () => {
    mockLoadBookmarks.mockReturnValueOnce([
      sampleBookmark,
      {
        id: "test-id-2",
        url: "https://openai.com",
        title: "OpenAI",
        tags: ["ai"],
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ]);
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/search bookmarks/i), {
      target: { value: "example" },
    });

    await waitFor(() => {
      expect(screen.getByText("Example Site")).toBeInTheDocument();
      expect(screen.queryByText("OpenAI")).not.toBeInTheDocument();
    });
  });

  it("shows all bookmarks when search query is cleared", async () => {
    mockLoadBookmarks.mockReturnValueOnce([
      sampleBookmark,
      {
        id: "test-id-2",
        url: "https://openai.com",
        title: "OpenAI",
        tags: ["ai"],
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ]);
    render(<Home />);

    const searchInput = screen.getByLabelText(/search bookmarks/i);
    fireEvent.change(searchInput, { target: { value: "example" } });
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getByText("Example Site")).toBeInTheDocument();
      expect(screen.getByText("OpenAI")).toBeInTheDocument();
    });
  });

  it("form does not submit when URL is missing", () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "No URL" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));
    expect(mockSaveBookmarks).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("clears the form after a successful submission", async () => {
    render(<Home />);
    const urlInput = screen.getByLabelText(/^url$/i);
    const titleInput = screen.getByLabelText(/^title$/i);
    fireEvent.change(urlInput, { target: { value: "https://example.org" } });
    fireEvent.change(titleInput, { target: { value: "Example Org" } });
    fireEvent.click(screen.getByRole("button", { name: /add bookmark/i }));

    await waitFor(() => {
      expect((urlInput as HTMLInputElement).value).toBe("");
      expect((titleInput as HTMLInputElement).value).toBe("");
    });
  });
});
