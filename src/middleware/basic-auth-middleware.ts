import { Credentials } from "../typing";
import { InvalidAuthorizationHeaderError, InvalidServerSettingsError } from "../errors";
import { KoaContext, Middleware } from "@lindorm-io/koa";
import { getCredentials, validateCredentials } from "../utils";

interface Options {
  clients: Array<Credentials>;
}

export const basicAuthMiddleware =
  (options: Options): Middleware<KoaContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    if (!options.clients.length) {
      throw new InvalidServerSettingsError(options.clients);
    }

    const authorization = ctx.getAuthorization();

    ctx.logger.debug("Authorization Header exists", { authorization });

    if (authorization?.type !== "Basic") {
      throw new InvalidAuthorizationHeaderError();
    }

    ctx.logger.debug("Basic Auth identified", { credentials: authorization.value });

    const credentials = getCredentials(authorization.value);
    validateCredentials(credentials, options.clients);

    ctx.logger.info("Basic Auth validated", { username: credentials.username });

    ctx.metrics.basicAuth = Date.now() - start;

    await next();
  };
