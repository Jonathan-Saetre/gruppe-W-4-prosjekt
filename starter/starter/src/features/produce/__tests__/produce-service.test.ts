import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocker Cloudflare-miljøet
vi.mock("cloudflare:workers", () => ({
  env: { DB: {}, R2: { put: vi.fn(), get: vi.fn(), delete: vi.fn() } },
}));

import { createProduceService } from "../produce-service";
import type { ProduceRepository } from "../produce-repository";

describe("ProduceService - Forretningsregler", () => {
  let mockRepo: ProduceRepository;
  let service: ReturnType<typeof createProduceService>;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      uploadR2: vi.fn(),
      getR2: vi.fn(),
      deleteR2: vi.fn(),
    };
    service = createProduceService(mockRepo);
  });

  it("skal returnere 403 dersom en bruker prøver å endre et innlegg de ikke eier", async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue({
      id: "123", userId: 1, title: "Epler", imageKey: null,
    } as any);

    const result = await service.update("123", { title: "Nye epler" }, 2);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(403);
      expect(result.error.message).toContain("bare endre dine egne");
    }
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("skal returnere 400 dersom fristen er i fortiden", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await service.create({
      title: "Pærer",
      category: "frukt",
      pickupLocation: "Hagen",
      amount: 5,
      unit: "kg",
      contactInfo: "12345678",
      pickupDeadline: yesterday,
    }, 1);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(400);
      expect(result.error.fieldErrors?.pickupDeadline).toBeDefined();
    }
  });
});