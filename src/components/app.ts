import { GlobalController } from "./globalController";

export function app() {
  const gController = new GlobalController();
  gController.initialize();
}