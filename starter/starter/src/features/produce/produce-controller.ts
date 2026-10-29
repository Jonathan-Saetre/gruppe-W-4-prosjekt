import type { RequestInfo } from "rwsdk/worker";
import { produceService, type ProduceService } from "./produce-service";

export function createProduceController(service: ProduceService) {
    return {
        async list(_info: RequestInfo) {

            const result = await service.list();

            return result.ok
                ? Response.json(result, { status: 200 })
                : Response.json(result, { status: result.error.code });

        },

        async find({ params }: RequestInfo) {
            const result = await service.find(params.id);

            return result.ok
                ? Response.json(result, { status: 200 })
                : Response.json(result, { status: result.error.code });
        },

        async create({ request, ctx }: RequestInfo) {
            if (!ctx.user) {
                return Response.json({
                    ok: false,
                    error: {
                        code: 401,
                        message: "Du må være logget inn"
                    } }, 
                    { status: 401 },
                );
        }
       
      let body: unknown;
        try {
            body = await request.json();

        } catch(error) {
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

        async update({request, ctx, params}: RequestInfo) {
        if (!ctx.user) {
                return Response.json({
                    ok: false,
                    error: {
                        code: 401,
                        message: "Du må være logget inn"
                    } }, 
                    { status: 401 },
                );
        }
       
      let body: unknown;
        try {
            body = await request.json();

        } catch(error) {
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

    async remove({ctx, params}: RequestInfo) {
         if (!ctx.user) {
                return Response.json({
                    ok: false,
                    error: {
                        code: 401,
                        message: "Du må være logget inn"
                    } }, 
                    { status: 401 },
                );
        }
        const result = await service.remove(params.id, ctx.user.id);

         return result.ok
            ? new Response(null, { status: 204 })
            : Response.json(result, { status: result.error.code });
    },
};
}

export const produceController = createProduceController(produceService);