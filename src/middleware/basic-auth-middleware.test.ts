import { baseHash } from "@lindorm-io/core";
import { basicAuthMiddleware } from "./basic-auth-middleware";
import { logger } from "../test";
import {
  InvalidAuthorizationHeaderError,
  InvalidBasicAuthorizationError,
  InvalidServerSettingsError,
  MalformedBasicAuthorizationError,
} from "../errors";

describe("basic-auth-middleware.ts", () => {
  let options: any;
  let ctx: any;
  let next: any;

  beforeEach(() => {
    options = {
      clients: [{ username: "mock-username", password: "mock-password" }],
    };
    ctx = {
      getAuthorization: () => undefined,
      logger,
      metrics: {},
    };
    next = () => Promise.resolve();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully validate basic auth with clients", async () => {
    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("mock-username:mock-password"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).resolves.toBeUndefined();
  });

  test("should throw error when clients is empty", async () => {
    options.clients = [];

    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("mock-username:mock-password"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(InvalidServerSettingsError));
  });

  test("should throw error on missing Basic Auth", async () => {
    ctx.getAuthorization = () => ({
      type: "Bearer",
      value: "jwt.jwt.jwt",
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(InvalidAuthorizationHeaderError));
  });

  test("should throw error on malformed basic auth formatting", async () => {
    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("string-without-any-colon"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(MalformedBasicAuthorizationError));
  });

  test("should throw error on wrong basic auth", async () => {
    ctx.getAuthorization = () => ({
      type: "Basic",
      value: baseHash("wrong-username:wrong-password"),
    });

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(InvalidBasicAuthorizationError));
  });
});
