import { route } from "rwsdk/router";
import { produceController } from "./produce-controller";

// REST-ruter for innlegg. Samme URL, forskjellig HTTP-metode:
// GET henter, POST oppretter, PATCH endrer enkeltfelt, DELETE sletter.
// Versjonert (/v1) så API-et kan endres senere uten å ødelegge eksisterende klienter.
export const produceRoutes = [
  route("/api/v1/produce", {
    get: produceController.list,
    post: produceController.create,
  }),

  route("/api/v1/produce/:id", {
    get: produceController.find,
    patch: produceController.update,
    delete: produceController.remove,
  })
];

