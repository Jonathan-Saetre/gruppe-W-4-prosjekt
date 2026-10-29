import { route } from "rwsdk/router";
import { produceController } from "./produce-controller";

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

