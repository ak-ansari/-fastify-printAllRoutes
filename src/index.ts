import { fastifyPlugin } from "fastify-plugin";
import { Helper } from "./helper";
declare module "fastify" {
  interface FastifyInstance {
    printAllRoutes: () => void;
  }
}
export default fastifyPlugin<{
  ignoreList: string[];
  logger?: (message: string) => void;
}>((fastify, opts, next) => {
  const ignoreList: string[] = ["documentation"];
  const routes = [];

  const { logger = console.log } = opts;

  fastify.addHook("onRoute", routeOptions => {
    //ignore the head routes
    if (routeOptions.method === "HEAD") {
      return;
    }
    // ignore all routes which contains the ignore list items
    for (const ignoreUrl of ignoreList) {
      if (routeOptions.url.includes(ignoreUrl)) {
        return;
      }
    }
    routes.push({ ...routeOptions });
  });

  // decorate the fastify server method
  fastify.decorate("printAllRoutes", Helper.printAllRoutes(routes, logger));

  next();
});
