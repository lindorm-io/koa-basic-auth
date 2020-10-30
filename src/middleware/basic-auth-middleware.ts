import { APIError, HttpStatus, TObject, TPromise } from "@lindorm-io/global";
import { Context } from "koa";
import { Logger } from "@lindorm-io/winston";
import { baseParse, getAuthorizationHeader, stringComparison } from "@lindorm-io/common";
import { includes } from "lodash";

export interface IBasicAuthContext extends Context {
  logger: Logger;
  metrics: TObject<number>;
}

export interface IBasicAuthMiddlewareOptions {
  username: string;
  password: string;
}

export const basicAuthMiddleware = (options: IBasicAuthMiddlewareOptions) => async (
  ctx: IBasicAuthContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  const authorization = getAuthorizationHeader(ctx.get("Authorization"));

  if (authorization.type !== "Basic") {
    throw new APIError("Invalid Authorization Header", {
      details: "Expected header to be: Basic",
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }

  ctx.logger.debug("Basic Auth identified", { credentials: authorization.value });

  const credentials = baseParse(authorization.value);

  if (!includes(credentials, ":")) {
    throw new APIError("Malformed Basic Authorization", {
      details: "The provided basic auth string does not contain a username and password",
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }

  const input = credentials.split(":");
  const validUsername = stringComparison(input[0], options.username);
  const validPassword = stringComparison(input[1], options.password);

  if (!validUsername || !validPassword) {
    throw new APIError("Invalid Basic Authorization", {
      details: "The provided basic auth string does not match the expected",
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }

  ctx.metrics = {
    ...(ctx.metrics || {}),
    basicAuth: Date.now() - start,
  };

  await next();
};
