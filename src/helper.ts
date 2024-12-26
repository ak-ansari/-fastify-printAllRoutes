import chalk from "chalk";
import { FastifyRouteConfig } from "fastify/types/route";

export class Helper {
  public static printAllRoutes(
    routes: FastifyRouteConfig[],
    logger: (message: string) => void
  ) {
    return () => {
      if (routes.length === 0) {
        return;
      }

      // sort the routes alphabetically ASC by urls, then by method ASC
      this.sortRoutes(routes);
      const output = this.getColouredLogs(routes);
      // print all the routes
      if (routes.length > 0) {
        logger(`🏷️  Routes:`);
        logger(output);
        logger("🏷️ Routes End");
      }
    };
  }

  private static sortRoutes(routes: FastifyRouteConfig[]) {
    routes.sort((a, b) =>
      a.url !== b.url ? (a.url > b.url ? 1 : -1) : a.method > b.method ? 1 : -1
    );
  }
  private static getColouredLogs(routes: FastifyRouteConfig[]): string {
    let output = "";
    for (const route of routes) {
      let methods = [];
      // one route can support more than one method
      if (!Array.isArray(route.method)) {
        methods.push(route.method);
      } else {
        methods = route.method.sort((a, b) => (a > b ? 1 : -1));
      }

      methods.forEach(method => {
        output += `${chalk.green(method.toUpperCase())}\t${route.url.replace(
          /(?::[\w]+|\[:\w+\])/g,
          chalk.cyan("$&")
        )}\n`;
      });
    }
    return output;
  }
}
