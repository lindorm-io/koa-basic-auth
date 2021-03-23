import { IBasicAuthContext, IBasicAuthMiddlewareOptions, TNext } from "../typing";
import { InvalidAuthorizationHeaderError, InvalidServerSettingsError } from "../errors";
import { getAuthorizationHeader } from "@lindorm-io/core";
import { getCredentials, validateCredentials } from "../utils";

export const basicAuthMiddleware = (options: IBasicAuthMiddlewareOptions) => async (
  ctx: IBasicAuthContext,
  next: TNext,
): Promise<void> => {
  const start = Date.now();

  if (!options.clients.length) {
    throw new InvalidServerSettingsError(options.clients);
  }

  const authorization = getAuthorizationHeader(ctx.get("Authorization"));

  ctx.logger.debug("Authorization Header exists", { authorization });

  if (authorization.type !== "Basic") {
    throw new InvalidAuthorizationHeaderError();
  }

  ctx.logger.debug("Basic Auth identified", { credentials: authorization.value });

  const credentials = getCredentials(authorization.value);
  validateCredentials(credentials, options.clients);

  ctx.logger.info("Basic Auth validated", { username: credentials.username });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    basicAuth: Date.now() - start,
  };

  await next();
};
