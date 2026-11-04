// Controller: tar imot HTTP-forespørselen og gjør svaret fra servicen
// om til en Response med riktig statuskode.

import type { RequestInfo } from "rwsdk/worker";
import { produceService, type ProduceService } from "./produce-service";
import { parseParams } from "./utils/parse-params";
import { Result } from "./Result";

export interface ProduceController {
  list(requestInfo: RequestInfo): Promise<Response>;
  find(requestInfo: RequestInfo): Promise<Response>;
  create(requestInfo: RequestInfo): Promise<Response>;
  update(requestInfo: RequestInfo): Promise<Response>;
  remove(requestInfo: RequestInfo): Promise<Response>;
  getImage(requestInfo: RequestInfo): Promise<Response>;
}

export function createProduceController(service: ProduceService): ProduceController {
  return {
    async list({ request, ctx }: RequestInfo) {
      const params = parseParams(request);

      const result = await service.list(params);

      if (!result.ok) {
        return Response.json({
          ok: false,
          error: result.error
        }, {
          status: Number(result.error.code),
        });
      }
      return Response.json({
        ok: true,
        data: result.data,
      }, {
        status: 200,
      });
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

      let formData: FormData;
      try {
        formData = await request.formData();
      } catch (error) {
        console.error(error);
        return Response.json({
          ok: false,
          error: {
            code: 400,
            message: "Ugyldig skjema-data (FormData)"
          }
        },
          { status: 400 });
      }

      // Henter filen og sørger for at den er undefined (ikke null) hvis den mangler,
      // slik at Zod-valideringen (.optional()) godtar det.
      const imageFile = formData.get("imageKey");
      const imageKey = imageFile instanceof File ? imageFile : undefined;

      const body = {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        category: formData.get("category") as string,
        pickupLocation: formData.get("pickupLocation") as string,
        amount: Number(formData.get("amount")),
        unit: formData.get("unit") as "kg" | "stk" | "poser",
        contactInfo: formData.get("contactInfo") as string,
        pickupDeadline: (formData.get("pickupDeadline") as string) || undefined,
        imageKey, // Bruker den nye variabelen
      };

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

      let formData: FormData;
      try {
        formData = await request.formData();
      } catch (error) {
        console.error(error);
        return Response.json({
          ok: false,
          error: {
            code: 400,
            message: "Ugyldig skjema-data (FormData)"
          }
        },
          { status: 400 });
      }

      // Samme fiks for update
      const imageFile = formData.get("imageKey");
      const imageKey = imageFile instanceof File ? imageFile : undefined;

      const body = {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        category: formData.get("category") as string,
        pickupLocation: formData.get("pickupLocation") as string,
        amount: Number(formData.get("amount")),
        unit: formData.get("unit") as "kg" | "stk" | "poser",
        contactInfo: formData.get("contactInfo") as string,
        pickupDeadline: (formData.get("pickupDeadline") as string) || undefined,
        imageKey, // Bruker den nye variabelen
        pickedUp: formData.get("pickedUp") === "true",
      };

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
      
      return result.ok
        ? new Response(null, { status: 204 })
        : Response.json(result, { status: result.error.code });
    },
    
    async getImage({params}: RequestInfo){
      const key = params.$0; 

      const result = await service.getImage(key);

      if(!result.ok){
        return new Response(result.error.message, 
          {status: result.error.code})
      }

      const object = result.data
      
      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
          "Cache-Control": "public, max-age=2592000, immutable",
          "ETag": object.httpEtag,
        }
      })
    }
  };
}
export const produceController = createProduceController(produceService);