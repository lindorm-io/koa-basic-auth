import { baseHash } from "@lindorm-io/core";
import { basicAuthMiddleware } from "./basic-auth-middleware";
import { MissingAuthorizationHeaderError } from "@lindorm-io/koa";
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
      get: jest.fn(),
      logger: {
        info: jest.fn(),
        debug: jest.fn(),
      },
      metrics: {},
    };
    next = () => Promise.resolve();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully validate basic auth with clients", async () => {
    ctx.get = jest.fn(() => `Basic ${baseHash("mock-username:mock-password")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).resolves.toBeUndefined();
  });

  test("should throw error when clients is empty", async () => {
    options.clients = [];
    ctx.get = jest.fn(() => `Basic ${baseHash("mock-username:mock-password")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(InvalidServerSettingsError));
  });

  test("should throw error on missing authorization header", async () => {
    ctx.get = jest.fn(() => undefined);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(MissingAuthorizationHeaderError));
  });

  test("should throw error on missing Basic Auth", async () => {
    ctx.get = jest.fn(() => "Bearer TOKEN");

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(InvalidAuthorizationHeaderError));
  });

  test("should throw error on malformed basic auth formatting", async () => {
    ctx.get = jest.fn(() => `Basic ${baseHash("string-without-any-colon")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(MalformedBasicAuthorizationError));
  });

  test("should throw error on wrong basic auth", async () => {
    ctx.get = jest.fn(() => `Basic ${baseHash("wrong-username:wrong-password")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toThrow(expect.any(InvalidBasicAuthorizationError));
  });
});
