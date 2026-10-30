// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreateListingModal } from "../CreateListingModal";

describe("CreateListingModal", () => {
  it("does not render when isOpen is false", () => {
    render(
      <CreateListingModal
        isOpen={false}
        onClose={vi.fn()}
        onAddListing={vi.fn()}
      />
    );

    expect(screen.queryByText("Del fra hagen din 🌿")).not.toBeInTheDocument();
  });

  it("renders form elements when isOpen is true", () => {
    render(
      <CreateListingModal
        isOpen={true}
        onClose={vi.fn()}
        onAddListing={vi.fn()}
      />
    );

    expect(screen.getByText("Del fra hagen din 🌿")).toBeInTheDocument();
    expect(screen.getByLabelText("Hva tilbyr du?")).toBeInTheDocument();
    expect(screen.getByLabelText("Mengde / Antall")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Legg ut i nabolaget" })).toBeInTheDocument();
  });

  it("calls onAddListing with form values on submit", () => {
    const handleAddListing = vi.fn();
    const handleClose = vi.fn();

    render(
      <CreateListingModal
        isOpen={true}
        onClose={handleClose}
        onAddListing={handleAddListing}
      />
    );

    fireEvent.change(screen.getByLabelText("Hva tilbyr du?"), {
      target: { value: "Søte Moreller" },
    });
    fireEvent.change(screen.getByLabelText("Mengde / Antall"), {
      target: { value: "2 kg" },
    });
    fireEvent.change(screen.getByLabelText("Hvor i landet?"), {
      target: { value: "Halden" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Legg ut i nabolaget" }));

    expect(handleAddListing).toHaveBeenCalledTimes(1);
    expect(handleAddListing).toHaveBeenCalledWith({
      title: "Søte Moreller",
      category: "Epler",
      amount: "2 kg",
      location: "Halden",
      imageUrl: undefined,
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});