import { describe, it, expect } from "vitest";
import { createProduceSchema } from "../produce-validation";
import { validateListParams } from "../utils/validate-list-params";

describe("Produce Validation", () => {
  it("skal godta gyldig data for et nytt innlegg", () => {
    const validData = {
      title: "Søte epler",
      category: "frukt",
      pickupLocation: "Storgata 1",
      amount: 5,
      unit: "kg",
      contactInfo: "ola@example.com",
      pickupDeadline: new Date(Date.now() + 86400000), // I morgen
    };
    
    // safeParse skal returnere success: true
    const result = createProduceSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("skal avvise negativ mengde", () => {
    const invalidData = {
      title: "Råtne epler",
      category: "frukt",
      pickupLocation: "Storgata 1",
      amount: -5, // Ugyldig
      unit: "kg",
      contactInfo: "123",
      pickupDeadline: new Date(),
    };
    
    const result = createProduceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("validateListParams", () => {
  it("skal avvise ugyldig limit", () => {
    // Tester at limit over maksgrensen (100) avvises.
    const result = validateListParams({ limit: "150" });
    expect(result.ok).toBe(false);
  });

  it("skal konvertere gyldige parametere til riktig type", () => {
    // Tester at strenger fra URL blir til tall og booleans.
    const result = validateListParams({ pickedUp: "true", limit: "10" });
    
    if (result.ok) {
      expect(result.params.pickedUp).toBe(true);
      expect(result.params.limit).toBe(10);
    }
  });
});