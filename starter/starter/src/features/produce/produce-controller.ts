import type { RequestInfo } from "rwsdk/worker";
import { produceService, type ProduceService } from "./produce-service";

export function createProduceController(service: ProduceService) {
  return {
    async list(_info: RequestInfo) {
      
        const result = await service.list();

        return result.ok
        ? Response.json(result, {status: 200})
        : Response.json(result, {status: result.error.code});
      
    },

    async find({ params }: RequestInfo) {
      const result = await service.find(params.id);

      return result.ok
        ? Response.json(result, {status: 200})
        : Response.json(result, {status: result.error.code});
    },

    async create(info: RequestInfo) {
      return new Response("Not implemented", { status: 501 });
    },

    async update(info: RequestInfo) {
      return new Response("Not implemented", { status: 501 });
    },

    async remove(info: RequestInfo) {
      return new Response("Not implemented", { status: 501 });
    },
  };
}

export const produceController = createProduceController(produceService);