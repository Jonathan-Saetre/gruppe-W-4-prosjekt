import { produceRepository, type ProduceRepository } from "./produce-repository";
import { toProduceDTO, type ProduceDTO } from "./produce-mapper";

type ServiceError = { code: number; message: string };

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: ServiceError };

export interface ProduceService {
  list(): Promise<Result<ProduceDTO[]>>;
  find(id: string): Promise<Result<ProduceDTO>>;
  create(input: unknown): Promise<Result<ProduceDTO>>;
  update(id: string, input: unknown): Promise<Result<ProduceDTO>>;
  remove(id: string): Promise<Result<null>>;
}

export function createProduceService(repo: ProduceRepository): ProduceService {
  return {
    async list() {
        try {
            
            const rows = await repo.findMany();
            const data = rows.map(toProduceDTO);

            return {
                ok: true, 
                data: data,
            };

        } catch (error) {
            console.error(error);
            return {
               ok: false, 
               error: {
                code: 500,
                message: "Noe gikk galt med serveren",
               }, 
            };
        }
    
    },

    async find(id) {
      try {
        const row = await repo.findById(id);

        if (!row) {
            return {
            ok: false, 
            error: {
            code: 404,
            message: "Innlegget finnes ikke",
            }, 
        };
        }

        return {
            ok: true, 
            data: toProduceDTO(row),
        };

      } catch (error){
        console.error(error);
        return {
            ok: false, 
            error: {
            code: 500,
            message: "Noe gikk galt med serveren",
            }, 
        };
      }
    },

    async create(input) {
      throw new Error("Not implemented");
    },

    async update(id, input) {
      throw new Error("Not implemented");
    },

    async remove(id) {
      throw new Error("Not implemented");
    },
  };
}

export const produceService = createProduceService(produceRepository);