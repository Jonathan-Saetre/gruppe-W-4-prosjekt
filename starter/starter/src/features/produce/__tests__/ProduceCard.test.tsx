// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProduceCard } from "@/components/ProduceCard";
import type { Produce } from "@/db/schema";

describe("ProduceCard", () => {
  const mockProduce: Produce = {
    id: "1",
    title: "Nydelige plommer",
    category: "frukt",
    amount: 10,
    unit: "stk",
    pickupLocation: "Bjørneveien 5",
    pickupDeadline: new Date("2026-08-01"),
    pickedUp: false,
    contactInfo: "test@test.no",
    description: null,
    userId: 1,
    createdAt: new Date(),
    imageKey: null,
  };

  it("skal vise tittel, mengde og hentested", () => {
    render(<ProduceCard produce={mockProduce} />);
    
    expect(screen.getByText("Nydelige plommer")).toBeDefined();
    expect(screen.getByText(/10 stk/)).toBeDefined();
    expect(screen.getByText("Bjørneveien 5")).toBeDefined();
  });

  it("skal vise (Hentet) kun når pickedUp er true", () => {
    // Først: Innlegget er ikke hentet
    const { rerender } = render(<ProduceCard produce={mockProduce} />);
    expect(screen.queryByText("(Hentet)")).toBeNull();

    // Deretter: Oppdaterer med pickedUp: true
    rerender(<ProduceCard produce={{ ...mockProduce, pickedUp: true }} />);
    expect(screen.getByText("(Hentet)")).toBeDefined();
  });

  it("skal bruke placeholder-bilde dersom imageKey mangler", () => {
    render(<ProduceCard produce={mockProduce} />);
    const img = screen.getByAltText("Nydelige plommer") as HTMLImageElement;
    
    expect(img.src).toContain("/placeholder.png");
  });
});