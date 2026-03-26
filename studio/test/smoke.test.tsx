import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

describe("Home page integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the main landmark", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /bookmark manager/i })).toBeInTheDocument();
  });

  it("renders the bookmark form", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /add bookmark/i })).toBeInTheDocument();
  });

  it("renders the search bar", () => {
    render(<Home />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("shows empty state when no bookmarks exist", () => {
    render(<Home />);
    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
  });

  it("adds a bookmark and displays it", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Example Site" } });
    fireEvent.submit(screen.getByLabelText("URL").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Example Site")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "https://example.com" })).toBeInTheDocument();
    });
  });

  it("deletes a bookmark", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Example Site" } });
    fireEvent.submit(screen.getByLabelText("URL").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Example Site")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /delete example site/i }));

    await waitFor(() => {
      expect(screen.queryByText("Example Site")).not.toBeInTheDocument();
    });
  });

  it("filters bookmarks by search query", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://react.dev" } });
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "React Docs" } });
    fireEvent.submit(screen.getByLabelText("URL").closest("form")!);

    await waitFor(() => expect(screen.getByText("React Docs")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://typescript.org" } });
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "TypeScript Home" } });
    fireEvent.submit(screen.getByLabelText("URL").closest("form")!);

    await waitFor(() => expect(screen.getByText("TypeScript Home")).toBeInTheDocument());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "react" } });

    await waitFor(() => {
      expect(screen.getByText("React Docs")).toBeInTheDocument();
      expect(screen.queryByText("TypeScript Home")).not.toBeInTheDocument();
    });
  });

  it("persists bookmarks to localStorage when adding", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://example.com" } });
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Saved Bookmark" } });
    fireEvent.submit(screen.getByLabelText("URL").closest("form")!);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe("Saved Bookmark");
    });
  });

  it("loads bookmarks from localStorage on mount", async () => {
    const existing = [
      { id: "1", url: "https://stored.com", title: "Stored Bookmark", tags: [], createdAt: new Date().toISOString() },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(existing));

    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText("Stored Bookmark")).toBeInTheDocument();
  });
});
