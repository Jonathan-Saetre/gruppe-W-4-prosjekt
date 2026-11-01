import { describe, it, expect } from "vitest";
import { createId } from "@/lib/id";

describe("createId", () => {
  it("returns a non-empty string", () => {
    const id = createId();

    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("returns a new id on every call", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => createId()));

    expect(ids.size).toBe(1000);
  });

  it("uses only URL safe characters", () => {
    expect(createId()).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe("createId edge cases", () => {
  it("has a fixed length", () => {
    const lengder = new Set(
      Array.from({ length: 100 }, () => createId().length)
    );

    expect(lengder.size).toBe(1);
  });

  it("needs no escaping in a URL", () => {
    const id = createId();

    expect(encodeURIComponent(id)).toBe(id);
  });

  it("never returns an empty or padded string", () => {
    for (let i = 0; i < 100; i++) {
      const id = createId();
      expect(id.trim()).toBe(id);
      expect(id).not.toBe("");
    }
  });
});
