import { ClientError, ServerError } from "@lindorm-io/errors";
import { Metric } from "@lindorm-io/koa";
import { baseHash } from "@lindorm-io/core";
import { basicAuthMiddleware } from "./basic-auth-middleware";
import { logger } from "../test";

const next = () => Promise.resolve();

describe("basic-auth-middleware.ts", () => {
  let options: any;
  let ctx: any;

  beforeEach(() => {
    options = {
      clients: [{ username: "mock-username", password: "mock-password" }],
    };
    ctx = {
      logger,
      metrics: {},
    };
    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("mock-username:mock-password"),
    });
    ctx.getMetric = (key: string) => new Metric(ctx, key);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully validate basic auth with clients", async () => {
    await expect(basicAuthMiddleware(options)(ctx, next)).resolves.toBeUndefined();
  });

  test("should throw error when clients is empty", async () => {
    options.clients = [];

    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("mock-username:mock-password"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(ServerError));
  });

  test("should throw error on missing Basic Auth", async () => {
    ctx.getAuthorization = () => ({
      type: "Bearer",
      value: "jwt.jwt.jwt",
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(ClientError));
  });

  test("should throw error on malformed basic auth formatting", async () => {
    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("string-without-any-colon"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(ClientError));
  });

  test("should throw error on wrong basic auth", async () => {
    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("wrong-username:wrong-password"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(ClientError));
  });
});
