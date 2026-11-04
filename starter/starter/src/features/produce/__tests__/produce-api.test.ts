import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocker Cloudflare-miljøet
vi.mock("cloudflare:workers", () => ({
  env: { DB: {}, R2: { put: vi.fn(), get: vi.fn(), delete: vi.fn() } },
}));

import { createProduceController } from "../produce-controller";
import { createProduceService } from "../produce-service";
import type { ProduceRepository } from "../produce-repository";

describe("Produce API (Integrasjon)", () => {
  let mockRepo: ProduceRepository;
  let controller: ReturnType<typeof createProduceController>;

  beforeEach(() => {
    mockRepo = {
      // Legger til createdAt og pickedUp slik at toProduceDTO fungerer
      create: vi.fn().mockImplementation((data) =>
        Promise.resolve({
          id: "new-id",
          createdAt: new Date(),
          pickedUp: false,
          ...data,
        }),
      ),
      findMany: vi.fn().mockResolvedValue({ ok: true, data: [] }),
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      uploadR2: vi.fn(),
      getR2: vi.fn(),
      deleteR2: vi.fn(),
    };
    const service = createProduceService(mockRepo);
    controller = createProduceController(service);
  });

  it("skal opprette et innlegg (201) og returnere data", async () => {
    const formData = new FormData();
    formData.append("title", "Integrasjons-epler");
    formData.append("category", "frukt");
    formData.append("pickupLocation", "Testveien");
    formData.append("amount", "3");
    formData.append("unit", "kg");
    formData.append("contactInfo", "123");
    formData.append("pickupDeadline", new Date(Date.now() + 86400000).toISOString());

    const mockRequestInfo = {
      request: new Request("http://localhost/api/v1/produce", {
        method: "POST",
        body: formData,
      }),
      ctx: { user: { id: 1, name: "Test" } },
    } as any;

    const response = await controller.create(mockRequestInfo);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.ok).toBe(true);
    expect(json.data.title).toBe("Integrasjons-epler");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});