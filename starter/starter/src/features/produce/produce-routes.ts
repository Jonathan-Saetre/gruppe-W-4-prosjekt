import { route } from "rwsdk/router";
import { produceController } from "./produce-controller";

export const produceRoutes = [
  route("/api/v1/produce", {
    get: produceController.list,
  }),

  route("/api/v1/produce/:id", {
    get: produceController.find,
  })
];

