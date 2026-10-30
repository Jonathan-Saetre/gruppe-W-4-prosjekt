// Controller: tar imot HTTP-forespørselen og gjør svaret fra servicen
// om til en Response med riktig statuskode.

import type { RequestInfo } from "rwsdk/worker";
import { produceService, type ProduceService } from "./produce-service";
import { parseParams } from "./utils/parse-params";
export interface ProduceController{
    list(requestInfo: RequestInfo): Promise<Response>;
    find(requestInfo: RequestInfo): Promise<Response>;
    create(requestInfo: RequestInfo): Promise<Response>;
    update(requestInfo: RequestInfo): Promise<Response>;
    remove(requestInfo: RequestInfo): Promise<Response>;
   
}


export function createProduceController(service: ProduceService): ProduceController {
    return {
        async list( {request, ctx}: RequestInfo) {
            const params = parseParams(request);

            const result = await service.list(params);

            if(!result.ok){
                return Response.json({
                    ok: false,
                    error: result.error
                },{
                    status: Number(result.error.code),
                }
            )
            }
            return Response.json({
                ok: true,
                data: result.data,
            },{
                status: 200,
            }
          )
        },

        async find({ params }: RequestInfo) {
            const result = await service.find(params.id);

            return result.ok
                ? Response.json(result, { status: 200 })
                : Response.json(result, { status: result.error.code });
        },

        async create({ request, ctx }: RequestInfo) {
            // ctx.user settes av authMiddleware i worker.tsx. 401 = ikke innlogget.
            if (!ctx.user) {
                return Response.json({
                    ok: false,
                    error: {
                        code: 401,
                        message: "Du må være logget inn"
                    }
                },
                    { status: 401 },
                );
            }
// request.json() kaster feil hvis bodyen ikke er gyldig JSON, derfor try/catch.
            let body: unknown;
            try {
                body = await request.json();

            } catch (error) {
                console.error(error);
                return Response.json({
                    ok: false,
                    error: {
                        code: 400,
                        message: "Ugyldig JSON"
                    }
                },
                    { status: 400 });

            }
            const result = await service.create(body, ctx.user.id);

            return result.ok
                ? Response.json(result, { status: 201 })
                : Response.json(result, { status: result.error.code });

        },

        async update({ request, ctx, params }: RequestInfo) {
            if (!ctx.user) {
                return Response.json({
                    ok: false,
                    error: {
                        code: 401,
                        message: "Du må være logget inn"
                    }
                },
                    { status: 401 },
                );
            }

            let body: unknown;
            try {
                body = await request.json();

            } catch (error) {
                console.error(error);
                return Response.json({
                    ok: false,
                    error: {
                        code: 400,
                        message: "Ugyldig JSON"
                    }
                },
                    { status: 400 });

            }
            const result = await service.update(params.id, body, ctx.user.id);

            return result.ok
                ? Response.json(result, { status: 200 })
                : Response.json(result, { status: result.error.code });

        },

        async remove({ ctx, params }: RequestInfo) {
            if (!ctx.user) {
                return Response.json({
                    ok: false,
                    error: {
                        code: 401,
                        message: "Du må være logget inn"
                    }
                },
                    { status: 401 },
                );
            }
            const result = await service.remove(params.id, ctx.user.id);
// 204 No Content har ingen body, så vi bruker new Response(null)
// i stedet for Response.json.
            return result.ok
                ? new Response(null, { status: 204 })
                : Response.json(result, { status: result.error.code });
        },
    };
}

export const produceController = createProduceController(produceService);