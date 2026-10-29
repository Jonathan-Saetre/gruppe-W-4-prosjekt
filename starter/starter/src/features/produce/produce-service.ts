// Service: appens regler og validering. Vet ingenting om HTTP eller databasen.
// Alle metoder svarer med { ok: true, data } eller { ok: false, error },
// der error.code er HTTP-statusen controlleren skal bruke.

import { produceRepository, type ProduceRepository } from "./produce-repository";
import { toProduceDTO, type ProduceDTO } from "./produce-mapper";
import { z } from "zod";
import { createProduceSchema, updateProduceSchema } from "./produce-validation";

type ServiceError = { code: number; message: string; fieldErrors?: Record<string, string[] | undefined>; };

export type Result<T> =
    | { ok: true; data: T }
    | { ok: false; error: ServiceError };

export interface ProduceService {
    list(): Promise<Result<ProduceDTO[]>>;
    find(id: string): Promise<Result<ProduceDTO>>;
    create(input: unknown, userId: number): Promise<Result<ProduceDTO>>;
    update(id: string, input: unknown, userId: number): Promise<Result<ProduceDTO>>;
    remove(id: string, userId: number): Promise<Result<null>>;
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

        async create(input, userId) {
            // Validering i to trinn: først sjekker Zod formen på dataene,
            // så sjekker vi appens egne regler (fristen kan ikke være passert).
            const parsed = createProduceSchema.safeParse(input);

            if (!parsed.success) {
                return {
                    ok: false,
                    error: {
                        code: 400,
                        message: "Ugyldig data",
                        fieldErrors: z.flattenError(parsed.error).fieldErrors,
                    }
                }
            }
            if (parsed.data.pickupDeadline < new Date()) {
                return {
                    ok: false,
                    error: {
                        code: 400,
                        message: "Fristen kan ikke være passert",
                        fieldErrors: { pickupDeadline: ["Fristen kan ikke være passert"] },
                    }
                }
            }

            try {
                // userId kommer fra innloggingen, ikke fra det brukeren sender inn.
                // Ellers kunne hvem som helst lagt ut innlegg i andres navn.
                const row = await repo.create({ ...parsed.data, userId })

                return {
                    ok: true,
                    data: toProduceDTO(row),
                };
            } catch (error) {
                console.error(error);
                return {
                    ok: false,
                    error: {
                        code: 500,
                        message: "Noe gikk galt med serveren"
                    },
                }
            }
        },

        async update(id, input, userId) {
            const parsed = updateProduceSchema.safeParse(input);

            if (!parsed.success) {
                return {
                    ok: false,
                    error: {
                        code: 400,
                        message: "Ugyldig data",
                        fieldErrors: z.flattenError(parsed.error).fieldErrors,
                    }
                }
            }

            if (Object.keys(parsed.data).length === 0) {
                return {
                    ok: false,
                    error: {
                        code: 400,
                        message: "Ingenting å oppdatere",
                    }
                }
            }

            if (parsed.data.pickupDeadline && parsed.data.pickupDeadline < new Date()) {
                return {
                    ok: false,
                    error: {
                        code: 400,
                        message: "Fristen kan ikke være passert",
                        fieldErrors: { pickupDeadline: ["Fristen kan ikke være passert"] }
                    }
                }
            }

            try {

                const existing = await repo.findById(id)

                if (!existing) {
                    return {
                        ok: false,
                        error: {
                            code: 404,
                            message: "Innlegget finnes ikke"
                        }
                    }
                }
                // Eierskap sjekkes FØR vi endrer noe. 404 hvis innlegget ikke finnes,
                // 403 hvis det tilhører en annen bruker.
                if (existing.userId !== userId) {
                    return {
                        ok: false,
                        error: {
                            code: 403,
                            message: "Du kan bare endre dine egne innlegg"
                        }
                    }
                }
                const row = await repo.update(id, parsed.data);
                if (!row) {
                    return {
                        ok: false,
                        error: {
                            code: 404,
                            message: "Innlegget finnes ikke"
                        }
                    }
                }
                return {
                    ok: true,
                    data: toProduceDTO(row),
                }

            } catch (error) {
                console.error(error);
                return {
                    ok: false,
                    error: {
                        code: 500,
                        message: "Noe gikk galt med serveren"
                    },
                }
            }
        },

        async remove(id, userId) {
            try {

                const existing = await repo.findById(id)

                if (!existing) {
                    return {
                        ok: false,
                        error: {
                            code: 404,
                            message: "Innlegget finnes ikke"
                        }
                    }
                }
                // Samme eierskapssjekk som i update: bare eieren kan slette.
                if (existing.userId !== userId) {
                    return {
                        ok: false,
                        error: {
                            code: 403,
                            message: "Du kan bare slette dine egne innlegg"
                        }
                    }
                }
                await repo.remove(id);

                return {
                    ok: true,
                    data: null,
                }

            } catch (error) {
                console.error(error);
                return {
                    ok: false,
                    error: {
                        code: 500,
                        message: "Noe gikk galt med serveren"
                    },
                }
            }
        },
    };
}

export const produceService = createProduceService(produceRepository);